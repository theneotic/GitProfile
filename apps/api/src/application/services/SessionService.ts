import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env.js';

export interface UserSessionPayload {
  sub: string; // userId (UUID)
  login: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenRecord {
  tokenHash: string;
  userId: string;
  expiresAt: number;
  familyId: string;
  isUsed: boolean;
}

export class SessionService {
  private tokenRecords: Map<string, RefreshTokenRecord> = new Map();

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public generateTokens(payload: UserSessionPayload, familyId?: string): AuthTokens {
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const famId = familyId || crypto.randomUUID();
    const rawRefreshToken = `${crypto.randomUUID()}.${famId}`;

    const refreshToken = jwt.sign(
      { sub: payload.sub, fam: famId, r: rawRefreshToken },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    const tokenHash = this.hashToken(refreshToken);
    this.tokenRecords.set(tokenHash, {
      tokenHash,
      userId: payload.sub,
      familyId: famId,
      expiresAt: Date.now() + 30 * 24 * 3600 * 1000,
      isUsed: false,
    });

    return { accessToken, refreshToken };
  }

  public verifyAccessToken(token: string): UserSessionPayload | null {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as UserSessionPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  public async refreshTokens(
    refreshToken: string,
    login: string
  ): Promise<AuthTokens | null> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        sub: string;
        fam: string;
      };

      const tokenHash = this.hashToken(refreshToken);
      const record = this.tokenRecords.get(tokenHash);

      // Token reuse detection (Section 8.3)
      if (record && record.isUsed) {
        // Token has already been rotated! Revoke the entire token family
        for (const [hash, rec] of this.tokenRecords.entries()) {
          if (rec.familyId === record.familyId) {
            this.tokenRecords.delete(hash);
          }
        }
        return null; // Reject reuse
      }

      // Mark current token as used
      if (record) {
        record.isUsed = true;
      }

      // Mint new tokens in the same family
      return this.generateTokens({ sub: decoded.sub, login }, decoded.fam);
    } catch {
      return null;
    }
  }

  public revokeUserSessions(userId: string): void {
    for (const [hash, record] of this.tokenRecords.entries()) {
      if (record.userId === userId) {
        this.tokenRecords.delete(hash);
      }
    }
  }
}

export const defaultSessionService = new SessionService();
