import {
  CardOptions,
  Density,
  Theme,
  resolveThemeWithOptions,
  svgDocument,
  renderCardFrame,
  getCardWidth,
  text,
  line,
  icon,
  formatCompact,
  isAutoTheme,
  getAutoTheme,
  generateAutoThemeCss,
  generateAnimationCss,
} from './engine/index';
import { StreakCardData, MOCK_STREAK } from './mock-data';

export function renderStreakCard(
  data: StreakCardData = MOCK_STREAK,
  options: CardOptions = {}
): string {
  const density: Density = (options.layout as Density) || 'cozy';
  const width = getCardWidth(density, 400);

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  const height = density === 'compact' ? 160 : 185;
  const isAnimated = Boolean(options.animated);

  const colWidth = (width - 50) / 3;
  const colY = 90;

  const bodyElements: string[] = [];

  // Column 1: Total Contributions
  const col1CenterX = 25 + colWidth / 2;
  bodyElements.push(
    text({
      x: col1CenterX,
      y: colY + 10,
      content: formatCompact(data.totalContributions),
      fill: theme.primaryText,
      fontSize: density === 'compact' ? 24 : 28,
      fontWeight: 700,
      textAnchor: 'center',
      fontFamily: '"JetBrains Mono", "SF Mono", monospace',
    }),
    text({
      x: col1CenterX,
      y: colY + 32,
      content: 'Total Contributions',
      fill: theme.secondaryText,
      fontSize: density === 'compact' ? 10 : 11,
      textAnchor: 'center',
    })
  );

  // Column 1 | Column 2 Vertical Divider
  bodyElements.push(
    line({
      x1: 25 + colWidth,
      y1: colY - 15,
      x2: 25 + colWidth,
      y2: colY + 45,
      stroke: theme.border,
      strokeOpacity: 0.5,
    })
  );

  // Column 2 (CENTER): Current Streak (Accented + Flame Icon)
  const col2CenterX = 25 + colWidth * 1.5;
  const centerMarkup: string[] = [
    text({
      x: col2CenterX,
      y: colY + 10,
      content: String(data.currentStreak),
      fill: theme.accent,
      fontSize: density === 'compact' ? 24 : 28,
      fontWeight: 700,
      textAnchor: 'center',
      fontFamily: '"JetBrains Mono", "SF Mono", monospace',
    }),
  ];

  if (data.currentStreak > 0) {
    centerMarkup.push(
      icon({
        name: 'fire',
        x: col2CenterX - 6,
        y: colY + 18,
        size: 13,
        fill: theme.accent,
      })
    );
  }

  centerMarkup.push(
    text({
      x: col2CenterX,
      y: colY + 44,
      content: 'Current Streak',
      fill: theme.accent,
      fontSize: density === 'compact' ? 10 : 11,
      fontWeight: 600,
      textAnchor: 'center',
    })
  );

  if (isAnimated) {
    bodyElements.push(`<g class="anim-streak-center">${centerMarkup.join('\n      ')}</g>`);
  } else {
    bodyElements.push(...centerMarkup);
  }

  // Column 2 | Column 3 Vertical Divider
  bodyElements.push(
    line({
      x1: 25 + colWidth * 2,
      y1: colY - 15,
      x2: 25 + colWidth * 2,
      y2: colY + 45,
      stroke: theme.border,
      strokeOpacity: 0.5,
    })
  );

  // Column 3: Longest Streak
  const col3CenterX = 25 + colWidth * 2.5;
  bodyElements.push(
    text({
      x: col3CenterX,
      y: colY + 10,
      content: String(data.longestStreak),
      fill: theme.primaryText,
      fontSize: density === 'compact' ? 24 : 28,
      fontWeight: 700,
      textAnchor: 'center',
      fontFamily: '"JetBrains Mono", "SF Mono", monospace',
    }),
    text({
      x: col3CenterX,
      y: colY + 32,
      content: 'Longest Streak',
      fill: theme.secondaryText,
      fontSize: density === 'compact' ? 10 : 11,
      textAnchor: 'center',
    })
  );

  // Date range footer if provided
  if (data.currentStreakStart && data.currentStreakEnd && density !== 'compact') {
    bodyElements.push(
      text({
        x: col2CenterX,
        y: colY + 60,
        content: `${data.currentStreakStart} — ${data.currentStreakEnd}`,
        fill: theme.secondaryText,
        fontSize: 9,
        textAnchor: 'center',
        opacity: 0.7,
        fontFamily: '"JetBrains Mono", monospace',
      })
    );
  }

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: `${data.username}'s Contribution Streak`,
    iconName: 'fire',
    children: bodyElements.join('\n  '),
  });

  let styleSheet = '';
  if (isAutoTheme(options)) {
    styleSheet += generateAutoThemeCss(options) + '\n';
  }
  if (isAnimated) {
    styleSheet += generateAnimationCss() + '\n';
  }

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet.trim(),
    ariaLabel: `${data.username}'s Contribution Streak Card`,
  });
}
