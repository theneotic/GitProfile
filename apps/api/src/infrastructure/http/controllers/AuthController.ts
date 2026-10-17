import { Request, Response } from 'express';
import crypto from 'crypto';
import { env } from '../../../config/env.js';
import { defaultSessionService } from '../../../application/services/SessionService.js';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository.js';

export class AuthController {
  private activeStates: Map<string, number> = new Map();

  constructor(private userRepo: IUserRepository) {}

  public loginWithGithub(req: Request, res: Response): void {
    const scope = req.query.scope === 'repo' ? 'read:user repo' : 'read:user';
    const state = crypto.randomBytes(24).toString('hex');
    this.activeStates.set(state, Date.now() + 10 * 60 * 1000); // 10 min expiry

    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: `${env.API_BASE_URL}/auth/github/callback`,
      scope,
      state,
    });

    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
  }

  public async githubCallback(req: Request, res: Response): Promise<void> {
    const { code, state } = req.query;

    if (!code || typeof code !== 'string') {
      res.redirect(`${env.WEB_BASE_URL}/login?error=missing_code`);
      return;
    }

    if (!state || typeof state !== 'string' || !this.activeStates.has(state)) {
      res.redirect(`${env.WEB_BASE_URL}/login?error=invalid_csrf_state`);
      return;
    }

    this.activeStates.delete(state);

    try {
      // Exchange code for token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenData = (await tokenRes.json()) as {
        access_token?: string;
        error?: string;
      };

      if (!tokenData.access_token) {
        res.redirect(`${env.WEB_BASE_URL}/login?error=${tokenData.error || 'auth_failed'}`);
        return;
      }

      // Fetch GitHub User Profile
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'InstrumentStats/1.0',
        },
      });

      const ghUser = (await userRes.json()) as {
        id: number;
        login: string;
        name: string | null;
        email: string | null;
        avatar_url: string;
      };

      // Upsert User in DB
      const user = await this.userRepo.upsert({
        githubId: String(ghUser.id),
        githubLogin: ghUser.login,
        name: ghUser.name,
        email: ghUser.email,
        avatarUrl: ghUser.avatar_url,
        accessToken: tokenData.access_token,
      });

      // Generate Access & Refresh Tokens
      const tokens = defaultSessionService.generateTokens({
        sub: user.id,
        login: user.githubLogin,
      });

      // Set HttpOnly refresh cookie (30 days)
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 3600 * 1000,
      });

      // Redirect with access token fragment (consumed once by client)
      res.redirect(`${env.WEB_BASE_URL}/login/callback#access_token=${tokens.accessToken}`);
    } catch (err: any) {
      res.redirect(`${env.WEB_BASE_URL}/login?error=internal_auth_error`);
    }
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      res.status(401).json({ error: 'Missing refresh token cookie' });
      return;
    }

    const { login } = req.body || {};
    const tokens = await defaultSessionService.refreshTokens(refreshToken, login || '');

    if (!tokens) {
      res.clearCookie('refresh_token');
      res.status(401).json({ error: 'Invalid or revoked refresh token' });
      return;
    }

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 3600 * 1000,
    });

    res.status(200).json({
      accessToken: tokens.accessToken,
      expiresIn: 900, // 15 min
    });
  }

  public logout(req: Request, res: Response): void {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      res.clearCookie('refresh_token');
    }
    res.status(204).send();
  }
}
