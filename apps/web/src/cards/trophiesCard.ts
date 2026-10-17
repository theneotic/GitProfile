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
  icon,
  isAutoTheme,
  getAutoTheme,
  generateAutoThemeCss,
} from './engine/index';
import { TrophiesCardData, MOCK_TROPHIES } from './mock-data';

const TIER_COLORS = {
  gold: '#fbbf24',
  silver: '#cbd5e1',
  bronze: '#d97706',
  none: '#475569',
};

export function renderTrophiesCard(
  data: TrophiesCardData = MOCK_TROPHIES,
  options: CardOptions = {}
): string {
  const density: Density = (options.layout as Density) || 'cozy';
  const width = getCardWidth(density, 400);

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  const height = density === 'compact' ? 190 : 210;

  const bodyElements: string[] = [];

  // Render 6 trophies in a 3-col x 2-row grid
  const cols = 3;
  const paddingX = 25;
  const gapX = 10;
  const gapY = 10;
  const startY = 70;

  const badgeWidth = (width - paddingX * 2 - gapX * (cols - 1)) / cols;
  const badgeHeight = density === 'compact' ? 44 : 52;

  data.trophies.slice(0, 6).forEach((trophy, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const bx = paddingX + col * (badgeWidth + gapX);
    const by = startY + row * (badgeHeight + gapY);

    const tierColor = TIER_COLORS[trophy.tier] || TIER_COLORS.none;

    // Badge container
    bodyElements.push(
      rect({
        x: bx,
        y: by,
        width: badgeWidth,
        height: badgeHeight,
        rx: 4,
        fill: theme.progressColors.background,
        stroke: theme.border,
        strokeWidth: 1,
      })
    );

    // Trophy Icon
    bodyElements.push(
      icon({
        name: 'trophy',
        x: bx + 10,
        y: by + (badgeHeight / 2) - 8,
        size: density === 'compact' ? 14 : 16,
        fill: tierColor,
      })
    );

    // Title & Tier
    const textLeft = bx + (density === 'compact' ? 30 : 34);
    bodyElements.push(
      text({
        x: textLeft,
        y: by + (density === 'compact' ? 18 : 22),
        content: trophy.title,
        fill: theme.primaryText,
        fontSize: density === 'compact' ? 10 : 11,
        fontWeight: 600,
      }),
      text({
        x: textLeft,
        y: by + (density === 'compact' ? 32 : 38),
        content: trophy.tier.toUpperCase(),
        fill: tierColor,
        fontSize: density === 'compact' ? 9 : 10,
        fontWeight: 700,
        fontFamily: '"JetBrains Mono", monospace',
      })
    );
  });

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: `${data.username}'s Achievements`,
    iconName: 'medal',
    children: bodyElements.join('\n  '),
  });

  const styleSheet = isAutoTheme(options) ? generateAutoThemeCss(options) : '';

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet,
    ariaLabel: `${data.username}'s GitHub Trophies`,
  });
}
