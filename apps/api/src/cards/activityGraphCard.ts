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
} from './engine/index.js';
import { ActivityGraphCardData, MOCK_ACTIVITY_GRAPH } from './mock-data.js';

export function renderActivityGraphCard(
  data: ActivityGraphCardData = MOCK_ACTIVITY_GRAPH,
  options: CardOptions = {}
): string {
  // Dimensions per Section 17.6: 580 x 160
  const width = 580;
  const height = 160;

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  const bodyElements: string[] = [];

  // Top summary counter on the right of header
  bodyElements.push(
    text({
      x: width - 25,
      y: 35,
      content: `${formatCompact(data.totalContributions)} in last year`,
      fill: theme.secondaryText,
      fontSize: 11,
      textAnchor: 'end',
      fontFamily: '"JetBrains Mono", monospace',
    })
  );

  // 53 cols x 7 rows heatmap
  const startX = 25;
  const startY = 65;
  const squareSize = 8;
  const step = 10; // 8px size + 2px gap

  const days = data.days;

  for (let col = 0; col < 53; col++) {
    for (let row = 0; row < 7; row++) {
      const dayIndex = col * 7 + row;
      const day = days[dayIndex] || { count: 0, level: 0 };

      const sx = startX + col * step;
      const sy = startY + row * step;

      let fill = theme.progressColors.background;
      let opacity = 1;

      if (day.level === 0 || day.count === 0) {
        fill = theme.progressColors.background;
        opacity = 0.8;
      } else if (day.level === 1) {
        fill = theme.accent;
        opacity = 0.3;
      } else if (day.level === 2) {
        fill = theme.accent;
        opacity = 0.5;
      } else if (day.level === 3) {
        fill = theme.accent;
        opacity = 0.75;
      } else {
        fill = theme.accent;
        opacity = 1.0;
      }

      bodyElements.push(
        rect({
          x: sx,
          y: sy,
          width: squareSize,
          height: squareSize,
          rx: 2,
          fill,
          fillOpacity: opacity,
        })
      );
    }
  }

  // Legend at bottom left (Less [ ] [ ] [ ] [ ] [ ] More)
  const legendY = startY + 7 * step + 15;
  bodyElements.push(
    text({
      x: startX,
      y: legendY,
      content: 'Less',
      fill: theme.secondaryText,
      fontSize: 9,
    })
  );

  const legendOpacities = [0.15, 0.35, 0.55, 0.8, 1.0];
  legendOpacities.forEach((op, idx) => {
    bodyElements.push(
      rect({
        x: startX + 26 + idx * 10,
        y: legendY - 7,
        width: 7,
        height: 7,
        rx: 1.5,
        fill: theme.accent,
        fillOpacity: op,
      })
    );
  });

  bodyElements.push(
    text({
      x: startX + 80,
      y: legendY,
      content: 'More',
      fill: theme.secondaryText,
      fontSize: 9,
    })
  );

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: `${data.username}'s Contribution Graph`,
    iconName: 'graph',
    children: bodyElements.join('\n  '),
  });

  const styleSheet = isAutoTheme(options) ? generateAutoThemeCss(options) : '';

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet,
    ariaLabel: `${data.username}'s GitHub Contribution Heatmap`,
  });
}
