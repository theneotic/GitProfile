import { CyberStatsData, CyberThemeConfig, CYBER_THEMES } from './types';
import { calculateClearance, generateCoordinates } from './telemetry';

export interface RenderCardOptions {
  theme?: string;
  accent?: string;
  secondaryAccent?: string;
  hideGrid?: boolean;
  animated?: boolean;
}

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function formatCompact(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return num.toLocaleString();
}

/**
 * Compiles a Cybercore HUD Stat Card directly to high-craft SVG vector graphics.
 * Features:
 * - Chamfered polygon panel cutout (clip-path corners)
 * - Corner target brackets and coordinate grid lines
 * - Hexagonal radar HUD aperture surrounding user avatar
 * - Operator clearance badge & security level telemetry
 * - Monospace telemetry readout matrix with live signal wave sparkline
 */
export function compileCyberCard(data: CyberStatsData, options: RenderCardOptions = {}): string {
  const width = 850;
  const height = 310;
  const cardId = `hud-${Math.random().toString(36).substring(2, 9)}`;

  const baseTheme = CYBER_THEMES[options.theme || 'cybercore'] || CYBER_THEMES.cybercore;
  const accentPrimary = options.accent ? `#${options.accent.replace('#', '')}` : baseTheme.accentPrimary;
  const accentSecondary = options.secondaryAccent ? `#${options.secondaryAccent.replace('#', '')}` : baseTheme.accentSecondary;
  const clearance = calculateClearance(data);
  const coords = generateCoordinates(data.username);

  // Sparkline wave path from commit metrics
  const sparkPoints = [
    [0, 20], [30, 14], [60, 25], [90, 8], [120, 18], [150, 4], [180, 12], [210, 2]
  ];
  const sparkPolyline = sparkPoints.map(([px, py]) => `${px},${py}`).join(' ');

  return `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="${cardId}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(data.username)} Cybercore HUD Card">
  <style>
    #${cardId} {
      font-family: "Share Tech Mono", "JetBrains Mono", Consolas, "Courier New", monospace;
      background: ${baseTheme.background};
    }
    @keyframes radar-sweep {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse-signal {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.9; }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    .hud-radar-sweep {
      transform-origin: 85px 85px;
      animation: radar-sweep 8s linear infinite;
    }
    .hud-signal-pulse {
      animation: pulse-signal 3s ease-in-out infinite;
    }
    .hud-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.12em;
      fill: ${baseTheme.textMuted};
      text-transform: uppercase;
    }
    .hud-val {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.05em;
      fill: ${baseTheme.textPrimary};
    }
  </style>

  <defs>
    <!-- Card Chamfered Clip Mask -->
    <clipPath id="${cardId}-panel-clip">
      <polygon points="
        0 24,
        24 0,
        ${width - 24} 0,
        ${width} 24,
        ${width} ${height - 24},
        ${width - 24} ${height},
        24 ${height},
        0 ${height - 24}
      " />
    </clipPath>

    <!-- Avatar Hexagonal Clip Mask -->
    <clipPath id="${cardId}-hex-clip">
      <polygon points="50 14, 86 35, 86 77, 50 98, 14 77, 14 35" />
    </clipPath>

    <!-- Radar Sweep Gradient -->
    <linearGradient id="${cardId}-radar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentPrimary}" stop-opacity="0.35" />
      <stop offset="60%" stop-color="${accentPrimary}" stop-opacity="0.05" />
      <stop offset="100%" stop-color="${accentPrimary}" stop-opacity="0" />
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="${cardId}-cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Scanline Background Pattern -->
    <pattern id="${cardId}-scanlines" width="100" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.018)" stroke-width="1" />
    </pattern>

    <!-- Dot Grid Pattern -->
    <pattern id="${cardId}-dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.8" fill="${baseTheme.gridLine}" />
    </pattern>
  </defs>

  <!-- BACKGROUND BASE PANEL (Chamfered Corner Box) -->
  <g clip-path="url(#${cardId}-panel-clip)">
    <!-- Deep Surface Fill -->
    <rect width="${width}" height="${height}" fill="${baseTheme.background}" />
    <rect width="${width}" height="${height}" fill="${baseTheme.surface}" />
    
    <!-- Coordinate Dot Grid -->
    <rect width="${width}" height="${height}" fill="url(#${cardId}-dotgrid)" />

    <!-- Ambient Scanlines -->
    <rect width="${width}" height="${height}" fill="url(#${cardId}-scanlines)" />

    <!-- Top & Bottom Warning Telemetry Accent Bars -->
    <rect x="24" y="0" width="${width - 48}" height="2" fill="${accentPrimary}" opacity="0.6" />
    <rect x="24" y="${height - 2}" width="${width - 48}" height="2" fill="${accentPrimary}" opacity="0.3" />
  </g>

  <!-- PANEL CHAMFERED BORDER -->
  <polygon points="
    0 24,
    24 0,
    ${width - 24} 0,
    ${width} 24,
    ${width} ${height - 24},
    ${width - 24} ${height},
    24 ${height},
    0 ${height - 24}
  " fill="none" stroke="${baseTheme.bracketColor}" stroke-width="1.2" opacity="0.45" />

  <!-- CORNER TARGETING BRACKETS (Cybercore Signature) -->
  <!-- Top-Left -->
  <path d="M 0 38 L 0 24 L 24 0 L 38 0" fill="none" stroke="${accentPrimary}" stroke-width="3" />
  <circle cx="24" cy="8" r="1.5" fill="${accentPrimary}" />
  <!-- Top-Right -->
  <path d="M ${width - 38} 0 L ${width - 24} 0 L ${width} 24 L ${width} 38" fill="none" stroke="${accentPrimary}" stroke-width="3" />
  <circle cx="${width - 24}" cy="8" r="1.5" fill="${accentPrimary}" />
  <!-- Bottom-Left -->
  <path d="M 0 ${height - 38} L 0 ${height - 24} L 24 ${height} L 38 ${height}" fill="none" stroke="${accentPrimary}" stroke-width="3" />
  <!-- Bottom-Right -->
  <path d="M ${width - 38} ${height} L ${width - 24} ${height} L ${width} ${height - 24} L ${width} ${height - 38}" fill="none" stroke="${accentPrimary}" stroke-width="3" />

  <!-- TOP HEADER HUD BAR -->
  <g transform="translate(36, 26)">
    <!-- Blinking Live Status Indicator -->
    <circle cx="4" cy="4" r="3.5" fill="${accentPrimary}" class="hud-signal-pulse" />
    <text x="14" y="8" fill="${accentPrimary}" font-size="10.5" font-weight="700" letter-spacing="0.1em">
      SYSTEM.SYS_ONLINE // ${escapeXml(coords)}
    </text>

    <!-- Clearance Badge Pill (Top-Right) -->
    <g transform="translate(${width - 310}, -8)">
      <polygon points="0 0, 220 0, 230 24, 10 24" fill="rgba(255, 0, 85, 0.12)" stroke="${clearance.color}" stroke-width="1.2" />
      <text x="20" y="16" fill="${clearance.color}" font-size="10" font-weight="800" letter-spacing="0.14em">
        ${escapeXml(clearance.code)}
      </text>
    </g>
  </g>

  <!-- DIVIDER RULE WITH METRIC TICKS -->
  <line x1="36" y1="46" x2="${width - 36}" y2="46" stroke="${baseTheme.bracketColor}" stroke-width="1" opacity="0.25" />
  <line x1="160" y1="42" x2="160" y2="50" stroke="${accentPrimary}" stroke-width="1.5" />
  <line x1="380" y1="42" x2="380" y2="50" stroke="${accentPrimary}" stroke-width="1.5" />
  <line x1="600" y1="42" x2="600" y2="50" stroke="${accentPrimary}" stroke-width="1.5" />

  <!-- LEFT SECTION: RADAR APERTURE & OPERATOR IDENT -->
  <g transform="translate(36, 68)">
    <!-- Radar Reticle Rings -->
    <circle cx="50" cy="56" r="46" fill="none" stroke="${accentPrimary}" stroke-width="1" stroke-dasharray="4 3" opacity="0.3" />
    <circle cx="50" cy="56" r="38" fill="none" stroke="${baseTheme.bracketColor}" stroke-width="0.7" opacity="0.4" />
    <circle cx="50" cy="56" r="50" fill="none" stroke="${accentPrimary}" stroke-width="1.5" opacity="0.6" />

    <!-- Radar Crosshairs -->
    <line x1="0" y1="56" x2="100" y2="56" stroke="${accentPrimary}" stroke-width="0.8" opacity="0.2" />
    <line x1="50" y1="6" x2="50" y2="106" stroke="${accentPrimary}" stroke-width="0.8" opacity="0.2" />

    <!-- Avatar in Hexagonal Cutout -->
    <g transform="translate(0, 0)">
      <polygon points="50 12, 88 34, 88 78, 50 100, 12 78, 12 34" fill="none" stroke="${accentPrimary}" stroke-width="2" />
      <g clip-path="url(#${cardId}-hex-clip)">
        <image x="14" y="14" width="72" height="84" href="${escapeXml(data.avatarUrl)}" preserveAspectRatio="xMidYMid slice" />
      </g>
    </g>

    <!-- Operator Identity Details -->
    <g transform="translate(116, 22)">
      <text x="0" y="0" fill="${baseTheme.textMuted}" font-size="10" font-weight="600" letter-spacing="0.16em">
        OPERATOR ID
      </text>
      <text x="0" y="24" fill="${baseTheme.textPrimary}" font-size="24" font-weight="800" letter-spacing="-0.02em">
        ${escapeXml(data.name || data.username)}
      </text>
      <text x="0" y="44" fill="${accentPrimary}" font-size="13" font-weight="600" letter-spacing="0.08em">
        @${escapeXml(data.username)} // ${escapeXml(clearance.title)}
      </text>
      <text x="0" y="66" fill="${baseTheme.textMuted}" font-size="11" font-weight="400">
        ${escapeXml(data.bio ? (data.bio.length > 58 ? data.bio.slice(0, 55) + '...' : data.bio) : 'Active Developer in GitHub Grid')}
      </text>
    </g>
  </g>

  <!-- VERTICAL HUD DIVIDER -->
  <line x1="475" y1="65" x2="475" y2="280" stroke="${baseTheme.bracketColor}" stroke-width="1" stroke-dasharray="2 3" opacity="0.3" />

  <!-- RIGHT SECTION: TELEMETRY MATRIX TILES -->
  <g transform="translate(495, 68)">
    
    <!-- MINI TELEMETRY HUD HEADER WITH SPARKLINE -->
    <g transform="translate(0, 0)">
      <text x="0" y="12" fill="${accentPrimary}" font-size="10" font-weight="700" letter-spacing="0.14em">
        METRIC TELEMETRY FEED
      </text>

      <!-- Sparkline Signal Wave -->
      <g transform="translate(190, 0)">
        <polyline points="${sparkPolyline}" fill="none" stroke="${accentPrimary}" stroke-width="1.8" />
        <circle cx="210" cy="2" r="3" fill="${accentSecondary}" class="hud-signal-pulse" />
      </g>
    </g>

    <!-- 6 MODULAR TELEMETRY CELLS -->
    <!-- ROW 1 -->
    <!-- Total Commits -->
    <g transform="translate(0, 30)">
      <rect width="98" height="54" fill="rgba(255,255,255,0.02)" stroke="${baseTheme.bracketColor}" stroke-width="0.8" />
      <rect x="0" y="0" width="3" height="54" fill="${accentPrimary}" />
      <text x="12" y="20" class="hud-label">COMMITS</text>
      <text x="12" y="44" class="hud-val">${formatCompact(data.totalCommits)}</text>
    </g>

    <!-- Total Stars -->
    <g transform="translate(108, 30)">
      <rect width="98" height="54" fill="rgba(255,255,255,0.02)" stroke="${baseTheme.bracketColor}" stroke-width="0.8" />
      <rect x="0" y="0" width="3" height="54" fill="#ffaa00" />
      <text x="12" y="20" class="hud-label">STARS</text>
      <text x="12" y="44" class="hud-val">${formatCompact(data.totalStars)}</text>
    </g>

    <!-- Repositories -->
    <g transform="translate(216, 30)">
      <rect width="98" height="54" fill="rgba(255,255,255,0.02)" stroke="${baseTheme.bracketColor}" stroke-width="0.8" />
      <rect x="0" y="0" width="3" height="54" fill="${accentSecondary}" />
      <text x="12" y="20" class="hud-label">REPOS</text>
      <text x="12" y="44" class="hud-val">${formatCompact(data.totalRepositories)}</text>
    </g>

    <!-- ROW 2 -->
    <!-- Pull Requests -->
    <g transform="translate(0, 94)">
      <rect width="98" height="54" fill="rgba(255,255,255,0.02)" stroke="${baseTheme.bracketColor}" stroke-width="0.8" />
      <rect x="0" y="0" width="3" height="54" fill="${accentPrimary}" />
      <text x="12" y="20" class="hud-label">PRs</text>
      <text x="12" y="44" class="hud-val">${formatCompact(data.pullRequests)}</text>
    </g>

    <!-- Streak -->
    <g transform="translate(108, 94)">
      <rect width="98" height="54" fill="rgba(255,255,255,0.02)" stroke="${baseTheme.bracketColor}" stroke-width="0.8" />
      <rect x="0" y="0" width="3" height="54" fill="#39ff14" />
      <text x="12" y="20" class="hud-label">STREAK</text>
      <text x="12" y="44" class="hud-val">${data.currentStreak}d</text>
    </g>

    <!-- Clearance Score -->
    <g transform="translate(216, 94)">
      <rect width="98" height="54" fill="rgba(255,255,255,0.02)" stroke="${baseTheme.bracketColor}" stroke-width="0.8" />
      <rect x="0" y="0" width="3" height="54" fill="${clearance.color}" />
      <text x="12" y="20" class="hud-label">SCORE</text>
      <text x="12" y="44" class="hud-val">${formatCompact(clearance.score)}</text>
    </g>

    <!-- BOTTOM ROW: TOP LANGUAGE BARS -->
    <g transform="translate(0, 160)">
      <text x="0" y="10" fill="${baseTheme.textMuted}" font-size="9" font-weight="700" letter-spacing="0.1em">
        PRIMARY STACK // ${data.topLanguages.map(l => l.name).slice(0, 3).join(' • ')}
      </text>

      <!-- Segmented Language Bar -->
      <g transform="translate(0, 16)">
        <rect width="314" height="6" fill="#151922" rx="1" />
        ${renderLanguageSegments(data.topLanguages, 314)}
      </g>
    </g>
  </g>

  <!-- BOTTOM FOOTER TELEMETRY -->
  <g transform="translate(36, ${height - 14})">
    <text x="0" y="0" fill="${baseTheme.textMuted}" font-size="9" font-weight="600" letter-spacing="0.14em">
      PEAKER GIT-CARD // SECURE DATASTREAM // VER 1.0.0
    </text>
    <text x="${width - 72}" y="0" text-anchor="end" fill="${accentPrimary}" font-size="9" font-weight="700" letter-spacing="0.1em">
      CLEARANCE: ${escapeXml(clearance.level)} [VERIFIED]
    </text>
  </g>
</svg>
  `.trim();
}

function renderLanguageSegments(languages: Array<{ name: string; percentage: number; color: string }>, totalWidth: number): string {
  let currentX = 0;
  return languages.slice(0, 4).map((lang) => {
    const w = Math.max(4, Math.round((lang.percentage / 100) * totalWidth));
    const segment = `<rect x="${currentX}" y="0" width="${w}" height="6" fill="${lang.color}" rx="1" />`;
    currentX += w + 2;
    return segment;
  }).join('\n');
}
