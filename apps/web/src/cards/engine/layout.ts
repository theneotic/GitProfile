import { Theme, CardOptions, Density, IconName } from './types';
import { rect, text, line, circle } from './helpers';
import { icon } from './icons';

export interface CardFrameOptions {
  width: number;
  height: number;
  theme: Theme;
  options: CardOptions;
  title?: string;
  iconName?: IconName;
  children: string;
}

export function getCardWidth(density: Density, defaultWidth = 400): number {
  switch (density) {
    case 'compact':
      return 320;
    case 'detailed':
      return 440;
    case 'cozy':
    default:
      return defaultWidth;
  }
}

export function getBorderRadius(options: CardOptions, defaultRadius = 4.5): number {
  if (options.border_radius !== undefined) {
    const val = typeof options.border_radius === 'string' ? parseFloat(options.border_radius) : options.border_radius;
    return isNaN(val) ? defaultRadius : val;
  }
  return defaultRadius;
}

/**
 * Renders the standardized card frame: outer border, header, divider, footer, and sponsor dot.
 * Adheres strictly to Section 17.1 specifications.
 */
export function renderCardFrame(params: CardFrameOptions): string {
  const { width, height, theme, options, title, iconName, children } = params;
  const rx = getBorderRadius(options);
  const hideBorder = Boolean(options.hide_border);

  // Outer border with 0.5px offset to avoid sub-pixel blur
  const backgroundRect = rect({
    x: 0.5,
    y: 0.5,
    width: width - 1,
    height: height - 1,
    rx,
    fill: theme.background,
    stroke: hideBorder ? undefined : theme.border,
    strokeWidth: hideBorder ? undefined : 1,
  });

  const elements: string[] = [backgroundRect];

  // Header
  if (title) {
    let titleX = 25;
    if (iconName) {
      elements.push(
        icon({
          name: iconName,
          x: 25,
          y: 20,
          size: 18,
          fill: theme.accent,
        })
      );
      titleX = 50;
    }

    elements.push(
      text({
        x: titleX,
        y: 35,
        content: title,
        fill: theme.primaryText,
        fontSize: 18,
        fontWeight: 600,
      })
    );

    // Divider line
    elements.push(
      line({
        x1: 25,
        y1: 50,
        x2: width - 25,
        y2: 50,
        stroke: theme.border,
        strokeWidth: 1,
      })
    );
  }

  // Children / Card Body
  elements.push(children);

  // Footer attribution (Section 5.4 & 17.1)
  const showSponsor = Boolean(options.sponsor);
  const attributionX = showSponsor ? width - 28 : width - 25;

  elements.push(
    text({
      x: attributionX,
      y: height - 12,
      content: 'instrumentstats.dev',
      fill: theme.secondaryText,
      fontSize: 9,
      textAnchor: 'end',
      opacity: 0.6,
      fontFamily: '"JetBrains Mono", monospace',
    })
  );

  // Sponsor dot
  if (showSponsor) {
    elements.push(
      circle({
        cx: width - 14,
        cy: height - 15,
        r: 3,
        fill: theme.accent,
      })
    );
  }

  return elements.join('\n  ');
}
