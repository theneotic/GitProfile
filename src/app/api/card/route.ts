import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubStats } from '@/lib/github';
import { compileCyberCard } from '@/lib/cardCompiler';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || searchParams.get('user') || 'theneotic';
  const theme = searchParams.get('theme') || 'cybercore';
  const accent = searchParams.get('accent') || undefined;
  const secondaryAccent = searchParams.get('secondary_accent') || undefined;

  try {
    const stats = await fetchGitHubStats(username);
    const svg = compileCyberCard(stats, {
      theme,
      accent,
      secondaryAccent,
    });

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    const errorSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="80">
        <rect width="100%" height="100%" fill="#07090e" stroke="#ff0055" stroke-width="2"/>
        <text x="50%" y="50%" fill="#ff0055" font-family="monospace" font-size="12" text-anchor="middle" dominant-baseline="middle">
          SYS_ERR: ${error.message || 'FAILED TO RETRIEVE TELEMETRY'}
        </text>
      </svg>
    `;
    return new NextResponse(errorSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
      },
    });
  }
}
