import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID;

  // 1. If backend API is configured, forward to backend OAuth endpoint
  if (apiUrl && apiUrl.startsWith('http')) {
    const backendUrl = new URL('/auth/github', apiUrl);
    request.nextUrl.searchParams.forEach((val, key) => {
      backendUrl.searchParams.set(key, val);
    });
    return NextResponse.redirect(backendUrl.toString());
  }

  // 2. If GitHub Client ID is configured directly, redirect to GitHub OAuth
  if (clientId) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${origin}/login/callback`,
      scope: 'read:user',
      state: 'gh_state_' + Math.random().toString(36).substring(2),
    });
    return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
  }

  // 3. Fallback for standalone demo mode:
  // Seamlessly transition into the dashboard with a preview token so the user never encounters a 404
  return NextResponse.redirect(new URL('/login/callback#access_token=demo-preview-token', origin));
}
