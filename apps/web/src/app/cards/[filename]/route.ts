import { NextRequest, NextResponse } from 'next/server';
import { CARD_REGISTRY } from '../../../cards/registry';
import { CardType, CardOptions, Density, FontStyleOption } from '../../../cards/engine/types';
import { renderErrorCard } from '../../../cards/errorCard';

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

  const options: CardOptions = {
    theme,
    density,
    animated,
    hideBorder,
    borderRadius,
    accent,
    background,
    fontStyle,
  };

  try {
    const entry = CARD_REGISTRY[cardType];
    const data = entry.getMockData();
    const svg = entry.render(data, options);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400',
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
