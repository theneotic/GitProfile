import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const rawClientId = process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Ov23liAXtwA3sEW0T5XI';
  const clientId = rawClientId.trim().replace(/[\r\n\t\s"']/g, '');

  if (!clientId) {
    // If OAuth app is not configured yet, redirect back to login with a clear message
    return NextResponse.redirect(
      new URL('/login?error=oauth_not_configured', origin)
    );
  }

  const callbackUrl = `${origin}/api/auth/callback`;
  const state = 'gh_' + Math.random().toString(36).substring(2);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'read:user,repo',
    state,
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
