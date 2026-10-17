import { NextRequest, NextResponse } from 'next/server';
import { getRealUserStats } from '../../../lib/github-api';
import {
  MOCK_PROFILE,
  MOCK_STATS,
  MOCK_LANGUAGES,
  MOCK_STREAK,
  MOCK_RANKINGS,
} from '../../../cards/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username') || 'octocat';
  const mock = searchParams.get('mock') === 'true';

  if (mock) {
    return NextResponse.json({
      success: true,
      data: {
        profile: { ...MOCK_PROFILE, username },
        stats: { ...MOCK_STATS, username },
        languages: { ...MOCK_LANGUAGES, username },
        streak: { ...MOCK_STREAK, username },
        rankings: { ...MOCK_RANKINGS, username },
      },
    });
  }

  // Extract user OAuth token from session cookie or Authorization header if available
  let token: string | undefined = undefined;
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.replace(/^Bearer\s+/, '');
  } else {
    const sessionCookie = request.cookies.get('instrument_session');
    if (sessionCookie?.value) {
      try {
        const session = JSON.parse(sessionCookie.value);
        if (session.username?.toLowerCase() === username.toLowerCase() && session.token) {
          token = session.token;
        }
      } catch {
        // Ignore
      }
    }
  }

  try {
    const realData = await getRealUserStats(username, token);
    return NextResponse.json({
      success: true,
      data: realData,
    });
  } catch (err: any) {
    console.error(`Failed to fetch GitHub stats for '${username}':`, err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to fetch live stats from GitHub API',
        data: {
          profile: { ...MOCK_PROFILE, username },
          stats: { ...MOCK_STATS, username },
          languages: { ...MOCK_LANGUAGES, username },
          streak: { ...MOCK_STREAK, username },
          rankings: { ...MOCK_RANKINGS, username },
        },
      },
      { status: 200 }
    );
  }
}
