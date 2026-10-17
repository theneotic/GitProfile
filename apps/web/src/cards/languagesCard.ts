import {
  CardOptions,
  Density,
  Theme,
  resolveThemeWithOptions,
  svgDocument,
  renderCardFrame,
  getCardWidth,
  rect,
  text,
  circle,
  getLanguageColor,
  isAutoTheme,
  getAutoTheme,
  generateAutoThemeCss,
} from './engine/index';
import { LanguagesCardData, MOCK_LANGUAGES } from './mock-data';

export function renderLanguagesCard(
  data: LanguagesCardData = MOCK_LANGUAGES,
  options: CardOptions = {}
): string {
  const density: Density = (options.layout as Density) || 'cozy';
  const width = getCardWidth(density, 400);

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  // Compute percentages if not pre-computed
  const totalSize = data.languages.reduce((acc, l) => acc + l.size, 0);
  const languagesWithPct = data.languages.map((l) => ({
    ...l,
    percentage:
      l.percentage !== undefined
        ? l.percentage
        : totalSize > 0
        ? Math.round((l.size / totalSize) * 1000) / 10
        : 0,
    color: l.color || getLanguageColor(l.name),
  }));

  // Limit to top 5 or 6 languages to avoid vertical overflow
  const displayLanguages = languagesWithPct.slice(0, density === 'compact' ? 5 : 6);

  const isCompactStackedBar = density === 'compact';
  const bodyElements: string[] = [];

  let height = 200;

  if (isCompactStackedBar) {
    // Mode 1: Horizontal Stacked Bar (Section 17.3)
    const barX = 25;
    const barY = 70;
    const barWidth = width - 50;
    const barHeight = 10;

    // Stacked sub-rects
    let currentX = barX;
    const barSegments: string[] = [];

    displayLanguages.forEach((lang, idx) => {
      const segWidth = (lang.percentage / 100) * barWidth;
      if (segWidth <= 0) return;

      const isFirst = idx === 0;
      const isLast = idx === displayLanguages.length - 1;

      barSegments.push(
        rect({
          x: currentX,
          y: barY,
          width: Math.max(1, segWidth),
          height: barHeight,
          rx: isFirst || isLast ? 3 : 0,
          fill: lang.color,
        })
      );
      currentX += segWidth;
    });

    bodyElements.push(...barSegments);

    // Legend below (2 columns or wrapped rows)
    const legendY = 105;
    const colWidth = (width - 50) / 2;

    displayLanguages.forEach((lang, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const lx = 25 + col * colWidth;
      const ly = legendY + row * 22;

      bodyElements.push(
        circle({
          cx: lx + 5,
          cy: ly - 4,
          r: 4.5,
          fill: lang.color,
        }),
        text({
          x: lx + 16,
          y: ly,
          content: `${lang.name}`,
          fill: theme.primaryText,
          fontSize: 11,
        }),
        text({
          x: lx + colWidth - 10,
          y: ly,
          content: `${lang.percentage.toFixed(1)}%`,
          fill: theme.secondaryText,
          fontSize: 11,
          textAnchor: 'end',
          fontFamily: '"JetBrains Mono", monospace',
        })
      );
    });

    const totalLegendRows = Math.ceil(displayLanguages.length / 2);
    height = legendY + totalLegendRows * 22 + 25;
  } else {
    // Mode 2: Vertical List with percentage bars (Section 17.3)
    const startY = 75;
    const rowStep = 32;

    displayLanguages.forEach((lang, i) => {
      const rowY = startY + i * rowStep;

      // Language Name (Left)
      bodyElements.push(
        circle({
          cx: 30,
          cy: rowY - 4,
          r: 4.5,
          fill: lang.color,
        }),
        text({
          x: 42,
          y: rowY,
          content: lang.name,
          fill: theme.primaryText,
          fontSize: 13,
          fontWeight: 500,
        }),
        // Percentage (Right, Monospace)
        text({
          x: width - 25,
          y: rowY,
          content: `${lang.percentage.toFixed(1)}%`,
          fill: theme.secondaryText,
          fontSize: 13,
          fontWeight: 600,
          textAnchor: 'end',
          fontFamily: '"JetBrains Mono", monospace',
        }),
        // Progress Track & Fill
        rect({
          x: 25,
          y: rowY + 6,
          width: width - 50,
          height: 6,
          rx: 3,
          fill: theme.progressColors.background,
        }),
        rect({
          x: 25,
          y: rowY + 6,
          width: Math.max(2, ((width - 50) * lang.percentage) / 100),
          height: 6,
          rx: 3,
          fill: lang.color,
        })
      );
    });

    height = startY + displayLanguages.length * rowStep + 25;
  }

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: 'Most Used Languages',
    iconName: 'language',
    children: bodyElements.join('\n  '),
  });

  const styleSheet = isAutoTheme(options) ? generateAutoThemeCss(options) : '';

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet,
    ariaLabel: `${data.username}'s Language Breakdown`,
  });
}
