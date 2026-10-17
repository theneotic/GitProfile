import {
  CardOptions,
  Density,
  Theme,
  resolveThemeWithOptions,
  svgDocument,
  renderCardFrame,
  getCardWidth,
  text,
  circle,
  icon,
  formatCompact,
  truncate,
  getLanguageColor,
  isAutoTheme,
  getAutoTheme,
  generateAutoThemeCss,
} from './engine/index';
import { RepositoryCardData, MOCK_REPOSITORY } from './mock-data';

export function renderRepositoryCard(
  data: RepositoryCardData = MOCK_REPOSITORY,
  options: CardOptions = {}
): string {
  const density: Density = (options.layout as Density) || 'cozy';
  const width = getCardWidth(density, 400);

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  const height = density === 'compact' ? 140 : density === 'detailed' ? 180 : 160;

  const bodyElements: string[] = [];

  // Description
  const maxDescLen = density === 'compact' ? 55 : density === 'detailed' ? 95 : 75;
  const desc = data.description ? truncate(data.description, maxDescLen) : 'No description provided.';

  bodyElements.push(
    text({
      x: 25,
      y: 75,
      content: desc,
      fill: theme.secondaryText,
      fontSize: density === 'compact' ? 11 : 12,
    })
  );

  // Bottom row stats
  const bottomY = height - 30;
  let currentX = 25;

  // Language
  if (data.language) {
    const langColor = getLanguageColor(data.language);
    bodyElements.push(
      circle({
        cx: currentX + 5,
        cy: bottomY - 4,
        r: 4.5,
        fill: langColor,
      }),
      text({
        x: currentX + 16,
        y: bottomY,
        content: data.language,
        fill: theme.primaryText,
        fontSize: 12,
        fontWeight: 500,
      })
    );
    currentX += data.language.length * 7 + 35;
  }

  // Stars
  bodyElements.push(
    icon({
      name: 'star',
      x: currentX,
      y: bottomY - 11,
      size: 14,
      fill: theme.secondaryText,
    }),
    text({
      x: currentX + 18,
      y: bottomY,
      content: formatCompact(data.stars),
      fill: theme.primaryText,
      fontSize: 12,
      fontFamily: '"JetBrains Mono", monospace',
    })
  );
  currentX += 60;

  // Forks
  bodyElements.push(
    icon({
      name: 'fork',
      x: currentX,
      y: bottomY - 11,
      size: 14,
      fill: theme.secondaryText,
    }),
    text({
      x: currentX + 18,
      y: bottomY,
      content: formatCompact(data.forks),
      fill: theme.primaryText,
      fontSize: 12,
      fontFamily: '"JetBrains Mono", monospace',
    })
  );
  currentX += 60;

  // License
  if (data.license && density !== 'compact') {
    bodyElements.push(
      icon({
        name: 'law',
        x: currentX,
        y: bottomY - 11,
        size: 14,
        fill: theme.secondaryText,
      }),
      text({
        x: currentX + 18,
        y: bottomY,
        content: data.license,
        fill: theme.secondaryText,
        fontSize: 11,
      })
    );
  }

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: `${data.owner}/${data.repo}`,
    iconName: 'repo',
    children: bodyElements.join('\n  '),
  });

  const styleSheet = isAutoTheme(options) ? generateAutoThemeCss(options) : '';

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet,
    ariaLabel: `${data.owner}/${data.repo} Repository Card`,
  });
}
