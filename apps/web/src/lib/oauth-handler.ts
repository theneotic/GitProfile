import { NextRequest, NextResponse } from 'next/server';

export async function processOAuthCallback(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error || !code) {
    const errorMsg = errorDescription || error || 'missing_authorization_code';
    console.error('GitHub OAuth returned error:', errorMsg);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMsg)}`, origin)
    );
  }

  const clientId = (
    process.env.GITHUB_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ||
    'Ov23liAXtwA3sEW0T5XI'
  )
    .trim()
    .replace(/[\r\n\t\s"']/g, '');

  const clientSecret = (
    process.env.GITHUB_CLIENT_SECRET || ''
  )
    .trim()
    .replace(/[\r\n\t\s"']/g, '');

  try {
    // 1. Exchange authorization code for user access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!tokenData.access_token) {
      const failReason = tokenData.error_description || tokenData.error || 'token_exchange_failed';
      console.error('Token exchange failure:', failReason);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(failReason)}`, origin)
      );
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch authenticated GitHub user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'InstrumentStats/1.0',
      },
    });

    if (!userRes.ok) {
      throw new Error(`Failed to fetch user from GitHub API: ${userRes.status}`);
    }

    const ghUser = (await userRes.json()) as {
      id: number;
      login: string;
      name: string | null;
      avatar_url: string;
      email: string | null;
    };

    // 3. Set cookie session AND redirect with user params for 100% reliability
    const sessionPayload = JSON.stringify({
      id: ghUser.id,
      username: ghUser.login,
      name: ghUser.name || ghUser.login,
      avatar: ghUser.avatar_url,
      token: accessToken,
    });

    const targetUrl = new URL('/dashboard', origin);
    targetUrl.searchParams.set('auth_user', ghUser.login);
    targetUrl.searchParams.set('auth_avatar', ghUser.avatar_url);
    targetUrl.searchParams.set('auth_name', ghUser.name || ghUser.login);

    const response = NextResponse.redirect(targetUrl);
    response.cookies.set('instrument_session', sessionPayload, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('Unhandled OAuth Callback Error:', err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || 'auth_failed')}`, origin)
    );
  }
}
