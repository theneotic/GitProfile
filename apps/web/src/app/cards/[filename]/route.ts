import { NextRequest, NextResponse } from 'next/server';
import { CARD_REGISTRY } from '../../../cards/registry';
import { CardType, CardOptions, Density, FontStyleOption } from '../../../cards/engine/types';
import { renderErrorCard } from '../../../cards/errorCard';
import { getRealUserStats } from '../../../lib/github-api';

export const dynamic = 'force-dynamic';

function normalizeType(name: string): CardType | null {
  const clean = name.replace(/\.svg$/i, '').toLowerCase();
  const map: Record<string, CardType> = {
    stats: 'stats',
    streak: 'streak',
    profile: 'profile',
    languages: 'languages',
    repository: 'repository',
    repo: 'repository',
    rankings: 'rankings',
    ranking: 'rankings',
    trophies: 'trophies',
    trophy: 'trophies',
    'top-contributed': 'topContributed',
    topcontributed: 'topContributed',
    wrapped: 'wrapped',
    'activity-graph': 'activityGraph',
    activitygraph: 'activityGraph',
  };
  return map[clean] || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const searchParams = request.nextUrl.searchParams;

  const cardType = normalizeType(filename);
  if (!cardType || !CARD_REGISTRY[cardType]) {
    const errorSvg = renderErrorCard(`Unknown card type: ${filename}`);
    return new NextResponse(errorSvg, {
      status: 404,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  const username = searchParams.get('username') || 'octocat';
  const isMock = searchParams.get('mock') === 'true';

  const densityParam = (searchParams.get('layout') || searchParams.get('density') || 'cozy') as Density;
  const density: Density = ['compact', 'cozy', 'detailed'].includes(densityParam)
    ? densityParam
    : 'cozy';

  const theme = searchParams.get('theme') || 'terminal';
  const animated = searchParams.get('animated') === 'true';
  const hideBorder = searchParams.get('hide_border') === 'true';
  const borderRadius = searchParams.get('border_radius')
    ? parseInt(searchParams.get('border_radius')!, 10)
    : undefined;
  const accent = searchParams.get('accent') || undefined;
  const background = searchParams.get('background') || undefined;
  const fontStyle = (searchParams.get('font_style') || 'sans') as FontStyleOption;
  const modules = searchParams.get('modules') || undefined;
  const customImage = searchParams.get('custom_image') || searchParams.get('avatar_url') || undefined;
  const bgImage = searchParams.get('bg_image') || searchParams.get('custom_bg') || undefined;

  const options: CardOptions = {
    theme,
    density,
    layout: density,
    animated,
    hide_border: hideBorder,
    hideBorder,
    border_radius: borderRadius,
    borderRadius,
    accent,
    background,
    font_style: fontStyle,
    fontStyle,
    modules,
    custom_image: customImage,
    avatar_url: customImage,
    bg_image: bgImage,
  };

  try {
    const entry = CARD_REGISTRY[cardType];
    let cardData: any = null;

    // Check for user OAuth token from session cookie, query param, or Authorization header
    let token: string | undefined = searchParams.get('token') || undefined;
    if (!token) {
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
    }

    if (isMock) {
      cardData = entry.getMockData();
    } else {
      try {
        const real = await getRealUserStats(username, token);
        if (cardType === 'stats') cardData = real.stats;
        else if (cardType === 'streak') cardData = real.streak;
        else if (cardType === 'languages') cardData = real.languages;
        else if (cardType === 'profile') cardData = real.profile;
        else if (cardType === 'rankings') cardData = real.rankings;
        else cardData = entry.getMockData();
      } catch (fetchErr) {
        // If GitHub API limits or user not found, fallback to mock data
        console.warn(`Fallback to mock for ${username}:`, fetchErr);
        cardData = entry.getMockData();
      }
    }

    const svg = entry.render(cardData, options);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': token
          ? 'private, no-cache, no-store, must-revalidate'
          : 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    const errorSvg = renderErrorCard(err?.message || 'Failed to render card');
    return new NextResponse(errorSvg, {
      status: 500,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
      },
    });
  }
}
