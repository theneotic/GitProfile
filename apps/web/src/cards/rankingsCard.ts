import {
  CardOptions,
  Density,
  Theme,
  resolveThemeWithOptions,
  svgDocument,
  renderCardFrame,
  getCardWidth,
  text,
  rect,
  icon,
  isAutoTheme,
  getAutoTheme,
  generateAutoThemeCss,
} from './engine/index';
import { RankingsCardData, MOCK_RANKINGS } from './mock-data';

export function renderRankingsCard(
  data: RankingsCardData = MOCK_RANKINGS,
  options: CardOptions = {}
): string {
  const density: Density = (options.layout as Density) || 'cozy';
  const width = getCardWidth(density, 400);

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  const height = density === 'compact' ? 180 : density === 'detailed' ? 220 : 195;
  const rank = data.rank;

  // Radial progress calculations
  const radius = density === 'compact' ? 32 : 38;
  const strokeWidth = density === 'compact' ? 6 : 7;
  const ringX = density === 'compact' ? 65 : 75;
  const ringY = density === 'compact' ? 110 : 115;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(100, Math.max(0, rank.score)) / 100);

  const bodyElements: string[] = [];

  // Radial progress ring (Background & Filled Arc)
  bodyElements.push(`
    <!-- Progress Ring -->
    <circle
      cx="${ringX}"
      cy="${ringY}"
      r="${radius}"
      fill="none"
      stroke="${theme.progressColors.background}"
      stroke-width="${strokeWidth}"
    />
    <circle
      cx="${ringX}"
      cy="${ringY}"
      r="${radius}"
      fill="none"
      stroke="${theme.accent}"
      stroke-width="${strokeWidth}"
      stroke-linecap="round"
      stroke-dasharray="${circumference.toFixed(2)}"
      stroke-dashoffset="${strokeDashoffset.toFixed(2)}"
      transform="rotate(-90 ${ringX} ${ringY})"
    />
  `);

  // Grade inside ring center
  bodyElements.push(
    text({
      x: ringX,
      y: ringY + (density === 'compact' ? 7 : 9),
      content: rank.grade,
      fill: theme.primaryText,
      fontSize: density === 'compact' ? 22 : 26,
      fontWeight: 700,
      textAnchor: 'center',
      fontFamily: '"JetBrains Mono", monospace',
    })
  );

  // Right-hand Column (Details & Drivers)
  const rightX = ringX + radius + 25;
  let textY = ringY - 26;

  bodyElements.push(
    text({
      x: rightX,
      y: textY,
      content: `Global Score: ${rank.score}/100`,
      fill: theme.primaryText,
      fontSize: density === 'compact' ? 14 : 15,
      fontWeight: 600,
    })
  );
  textY += 20;

  // Signal driver description (Section 6.5)
  bodyElements.push(
    icon({
      name: 'trending',
      x: rightX,
      y: textY - 11,
      size: 13,
      fill: theme.accent,
    }),
    text({
      x: rightX + 18,
      y: textY,
      content: rank.driverDescription,
      fill: theme.secondaryText,
      fontSize: 12,
    })
  );
  textY += 24;

  // Mini Signal Breakdown Bars
  const barWidth = width - rightX - 30;
  const signals = [
    { label: 'Commits', score: rank.breakdown.commitsScore, max: 30 },
    { label: 'Stars', score: rank.breakdown.starsScore, max: 25 },
    { label: 'PRs/Issues', score: rank.breakdown.prsScore + rank.breakdown.issuesScore, max: 25 },
  ];

  signals.forEach((s) => {
    const pct = Math.min(100, Math.round((s.score / s.max) * 100));
    bodyElements.push(
      text({
        x: rightX,
        y: textY,
        content: s.label,
        fill: theme.secondaryText,
        fontSize: 10,
      }),
      text({
        x: rightX + barWidth,
        y: textY,
        content: `${pct}%`,
        fill: theme.secondaryText,
        fontSize: 10,
        textAnchor: 'end',
        fontFamily: '"JetBrains Mono", monospace',
      }),
      rect({
        x: rightX,
        y: textY + 4,
        width: barWidth,
        height: 4,
        rx: 2,
        fill: theme.progressColors.background,
      }),
      rect({
        x: rightX,
        y: textY + 4,
        width: Math.max(2, (barWidth * pct) / 100),
        height: 4,
        rx: 2,
        fill: theme.accent,
      })
    );
    textY += 18;
  });

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: `${data.username}'s GitHub Ranking`,
    iconName: 'ring',
    children: bodyElements.join('\n  '),
  });

  const styleSheet = isAutoTheme(options) ? generateAutoThemeCss(options) : '';

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet,
    ariaLabel: `${data.username}'s GitHub Ranking Card`,
  });
}
