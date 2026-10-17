import {
  CardOptions,
  Theme,
  resolveThemeWithOptions,
  svgDocument,
  renderCardFrame,
  text,
  rect,
  formatCompact,
  isAutoTheme,
  getAutoTheme,
  generateAutoThemeCss,
} from './engine/index';
import { WrappedCardData, MOCK_WRAPPED } from './mock-data';

export function renderWrappedCard(
  data: WrappedCardData = MOCK_WRAPPED,
  options: CardOptions = {}
): string {
  // Fixed width 440 per Section 17.5
  const width = 440;
  const height = 325;

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  const currentYear = new Date().getFullYear();
  const targetYear = data.year || currentYear;
  const isPastYear = targetYear < currentYear;
  const title = isPastYear
    ? `${targetYear} Wrapped · ${data.username}`
    : `${targetYear} So Far · ${data.username}`;

  const bodyElements: string[] = [];

  const tiles = [
    {
      label: 'TOTAL CONTRIBUTIONS',
      value: formatCompact(data.totalContributions),
      accent: true,
    },
    {
      label: 'MOST ACTIVE MONTH',
      value: data.mostActiveMonth,
      accent: false,
    },
    {
      label: 'BUSIEST DAY',
      value: `${data.busiestDay.count} commits`,
      sub: data.busiestDay.date,
      accent: false,
    },
    {
      label: 'TOP LANGUAGE',
      value: data.topLanguage,
      accent: false,
    },
    {
      label: 'NEW REPOS CREATED',
      value: String(data.newReposCreated),
      accent: false,
    },
    {
      label: 'LONGEST STREAK',
      value: `${data.longestStreak} days`,
      accent: true,
    },
  ];

  const cols = 2;
  const paddingX = 25;
  const gap = 12;
  const startY = 70;
  const tileWidth = (width - paddingX * 2 - gap) / cols;
  const tileHeight = 68;

  tiles.forEach((tile, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const tx = paddingX + col * (tileWidth + gap);
    const ty = startY + row * (tileHeight + gap);

    // Tile Box
    bodyElements.push(
      rect({
        x: tx,
        y: ty,
        width: tileWidth,
        height: tileHeight,
        rx: 4,
        fill: theme.progressColors.background,
        stroke: theme.border,
        strokeWidth: 1,
      }),
      // Top Label
      text({
        x: tx + 14,
        y: ty + 20,
        content: tile.label,
        fill: theme.secondaryText,
        fontSize: 9,
        fontWeight: 600,
        fontFamily: '"JetBrains Mono", monospace',
      }),
      // Big Value
      text({
        x: tx + 14,
        y: ty + 42,
        content: tile.value,
        fill: tile.accent ? theme.accent : theme.primaryText,
        fontSize: 17,
        fontWeight: 700,
        fontFamily: '"JetBrains Mono", monospace',
      })
    );

    // Optional subtext for busiest day date
    if (tile.sub) {
      bodyElements.push(
        text({
          x: tx + 14,
          y: ty + 56,
          content: tile.sub,
          fill: theme.secondaryText,
          fontSize: 9,
          opacity: 0.7,
        })
      );
    }
  });

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title,
    iconName: 'calendar',
    children: bodyElements.join('\n  '),
  });

  const styleSheet = isAutoTheme(options) ? generateAutoThemeCss(options) : '';

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet,
    ariaLabel: `${data.username}'s ${targetYear} GitHub Wrapped Card`,
  });
}
