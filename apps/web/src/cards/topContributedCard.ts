import {
  CardOptions,
  Density,
  Theme,
  resolveThemeWithOptions,
  svgDocument,
  renderCardFrame,
  getCardWidth,
  text,
  icon,
  rect,
  formatCompact,
  truncate,
  isAutoTheme,
  getAutoTheme,
  generateAutoThemeCss,
} from './engine/index';
import { TopContributedCardData, MOCK_TOP_CONTRIBUTED } from './mock-data';

export function renderTopContributedCard(
  data: TopContributedCardData = MOCK_TOP_CONTRIBUTED,
  options: CardOptions = {}
): string {
  const density: Density = (options.layout as Density) || 'cozy';
  const width = getCardWidth(density, 400);

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  const repos = data.repositories.slice(0, 5);
  const rowHeight = density === 'compact' ? 26 : 32;
  const startY = 75;
  const height = startY + repos.length * rowHeight + 25;

  const bodyElements: string[] = [];

  repos.forEach((r, idx) => {
    const rowY = startY + idx * rowHeight;
    const repoFullName = `${r.owner}/${r.repo}`;
    const truncatedName = truncate(repoFullName, density === 'compact' ? 26 : 34);

    // Repo icon
    bodyElements.push(
      icon({
        name: 'repo',
        x: 25,
        y: rowY - 10,
        size: 13,
        fill: theme.secondaryText,
      }),
      text({
        x: 44,
        y: rowY,
        content: truncatedName,
        fill: theme.primaryText,
        fontSize: density === 'compact' ? 12 : 13,
        fontWeight: 500,
      })
    );

    // Commit badge on the right
    const commitText = `${formatCompact(r.commits)} commits`;
    const badgeTextWidth = commitText.length * 7 + 14;
    const badgeX = width - 25 - badgeTextWidth;

    bodyElements.push(
      rect({
        x: badgeX,
        y: rowY - 12,
        width: badgeTextWidth,
        height: 18,
        rx: 3,
        fill: theme.progressColors.background,
        stroke: theme.border,
        strokeWidth: 1,
      }),
      text({
        x: badgeX + badgeTextWidth / 2,
        y: rowY + 1,
        content: commitText,
        fill: theme.accent,
        fontSize: 10,
        fontWeight: 600,
        textAnchor: 'center',
        fontFamily: '"JetBrains Mono", monospace',
      })
    );
  });

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: `${data.username}'s Top Contributed Repos`,
    iconName: 'branch',
    children: bodyElements.join('\n  '),
  });

  const styleSheet = isAutoTheme(options) ? generateAutoThemeCss(options) : '';

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet,
    ariaLabel: `${data.username}'s Top Contributed Repositories`,
  });
}
