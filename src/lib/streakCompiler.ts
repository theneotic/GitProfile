import { CyberStatsData, CYBER_THEMES } from './types';

export function compileStreakCard(data: CyberStatsData, options: { theme?: string; accent?: string } = {}): string {
  const width = 450;
  const height = 180;
  const cardId = `hud-streak-${Math.random().toString(36).substring(2, 9)}`;
  const baseTheme = CYBER_THEMES[options.theme || 'cybercore'] || CYBER_THEMES.cybercore;
  const accentPrimary = options.accent ? `#${options.accent.replace('#', '')}` : baseTheme.accentPrimary;

  return `
<svg xmlns="http://www.w3.org/2000/svg" id="${cardId}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <clipPath id="${cardId}-clip">
      <polygon points="0 18, 18 0, ${width - 18} 0, ${width} 18, ${width} ${height - 18}, ${width - 18} ${height}, 18 ${height}, 0 ${height - 18}" />
    </clipPath>
  </defs>

  <g clip-path="url(#${cardId}-clip)">
    <rect width="${width}" height="${height}" fill="${baseTheme.background}" />
    <rect width="${width}" height="${height}" fill="${baseTheme.surface}" />
  </g>

  <polygon points="0 18, 18 0, ${width - 18} 0, ${width} 18, ${width} ${height - 18}, ${width - 18} ${height}, 18 ${height}, 0 ${height - 18}" fill="none" stroke="${accentPrimary}" stroke-width="1.2" opacity="0.45" />

  <!-- Corner Brackets -->
  <path d="M 0 28 L 0 18 L 18 0 L 28 0" fill="none" stroke="${accentPrimary}" stroke-width="2.5" />
  <path d="M ${width - 28} 0 L ${width - 18} 0 L ${width} 18 L ${width} 28" fill="none" stroke="${accentPrimary}" stroke-width="2.5" />

  <!-- Header -->
  <g transform="translate(24, 28)">
    <circle cx="4" cy="4" r="3" fill="#ffaa00" />
    <text x="14" y="8" fill="#ffaa00" font-size="11" font-weight="700" font-family="monospace" letter-spacing="0.1em">
      ACTIVITY_STREAK // TELEMETRY
    </text>
  </g>

  <line x1="24" y1="44" x2="${width - 24}" y2="44" stroke="${accentPrimary}" stroke-width="0.8" opacity="0.25" />

  <!-- 3 Streak Blocks -->
  <g transform="translate(24, 62)">
    <!-- Current Streak -->
    <g transform="translate(0, 0)">
      <rect width="124" height="84" fill="rgba(255,255,255,0.02)" stroke="${baseTheme.bracketColor}" stroke-width="0.8" />
      <rect x="0" y="0" width="3" height="84" fill="#39ff14" />
      <text x="14" y="24" fill="${baseTheme.textMuted}" font-size="10" font-weight="600" font-family="monospace">CURRENT</text>
      <text x="14" y="56" fill="${baseTheme.textPrimary}" font-size="26" font-weight="800" font-family="monospace">${data.currentStreak}d</text>
      <text x="14" y="74" fill="#39ff14" font-size="9" font-family="monospace">ACTIVE SIGNAL</text>
    </g>

    <!-- Longest Streak -->
    <g transform="translate(138, 0)">
      <rect width="124" height="84" fill="rgba(255,255,255,0.02)" stroke="${baseTheme.bracketColor}" stroke-width="0.8" />
      <rect x="0" y="0" width="3" height="84" fill="#ffaa00" />
      <text x="14" y="24" fill="${baseTheme.textMuted}" font-size="10" font-weight="600" font-family="monospace">RECORD</text>
      <text x="14" y="56" fill="${baseTheme.textPrimary}" font-size="26" font-weight="800" font-family="monospace">${data.longestStreak}d</text>
      <text x="14" y="74" fill="#ffaa00" font-size="9" font-family="monospace">MAX TELEMETRY</text>
    </g>

    <!-- Total Commits -->
    <g transform="translate(276, 0)">
      <rect width="124" height="84" fill="rgba(255,255,255,0.02)" stroke="${baseTheme.bracketColor}" stroke-width="0.8" />
      <rect x="0" y="0" width="3" height="84" fill="${accentPrimary}" />
      <text x="14" y="24" fill="${baseTheme.textMuted}" font-size="10" font-weight="600" font-family="monospace">TOTAL</text>
      <text x="14" y="56" fill="${baseTheme.textPrimary}" font-size="26" font-weight="800" font-family="monospace">${data.totalCommits}</text>
      <text x="14" y="74" fill="${accentPrimary}" font-size="9" font-family="monospace">ALL COMMITS</text>
    </g>
  </g>
</svg>
  `.trim();
}
