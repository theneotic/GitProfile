import { CyberStatsData, CYBER_THEMES } from './types';

export function compileLanguagesCard(data: CyberStatsData, options: { theme?: string; accent?: string } = {}): string {
  const width = 450;
  const height = 210;
  const cardId = `hud-lang-${Math.random().toString(36).substring(2, 9)}`;
  const baseTheme = CYBER_THEMES[options.theme || 'cybercore'] || CYBER_THEMES.cybercore;
  const accentPrimary = options.accent ? `#${options.accent.replace('#', '')}` : baseTheme.accentPrimary;

  const topLangs = data.topLanguages.slice(0, 5);

  const langRows = topLangs.map((lang, idx) => {
    const y = 68 + idx * 26;
    return `
      <g transform="translate(24, ${y})">
        <circle cx="6" cy="6" r="3.5" fill="${lang.color}" />
        <text x="18" y="10" fill="${baseTheme.textPrimary}" font-size="12" font-weight="600" font-family="monospace">
          ${lang.name}
        </text>
        <rect x="180" y="3" width="160" height="6" fill="#151922" rx="1" />
        <rect x="180" y="3" width="${Math.round((lang.percentage / 100) * 160)}" height="6" fill="${lang.color}" rx="1" />
        <text x="390" y="10" fill="${baseTheme.textMuted}" font-size="11" font-weight="700" font-family="monospace" text-anchor="end">
          ${lang.percentage}%
        </text>
      </g>
    `;
  }).join('\n');

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
    <circle cx="4" cy="4" r="3" fill="${accentPrimary}" />
    <text x="14" y="8" fill="${accentPrimary}" font-size="11" font-weight="700" font-family="monospace" letter-spacing="0.1em">
      PRIMARY_LANGUAGES // ${data.username.toUpperCase()}
    </text>
  </g>

  <line x1="24" y1="44" x2="${width - 24}" y2="44" stroke="${accentPrimary}" stroke-width="0.8" opacity="0.25" />

  ${langRows}
</svg>
  `.trim();
}
