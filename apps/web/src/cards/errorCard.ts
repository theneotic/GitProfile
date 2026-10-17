import { CardOptions, Theme, resolveThemeWithOptions, svgDocument, renderCardFrame, text, icon } from './engine/index';

export function renderErrorCard(message: string, options: CardOptions = {}): string {
  const width = 400;
  const height = 130;
  const theme: Theme = resolveThemeWithOptions(options);

  const body = `
    ${icon({
      name: 'shield',
      x: 25,
      y: 65,
      size: 20,
      fill: '#f87171',
    })}
    ${text({
      x: 55,
      y: 75,
      content: 'Card Render Notice',
      fill: theme.primaryText,
      fontSize: 14,
      fontWeight: 600,
    })}
    ${text({
      x: 55,
      y: 95,
      content: message.length > 55 ? message.substring(0, 52) + '...' : message,
      fill: theme.secondaryText,
      fontSize: 12,
    })}
  `;

  const frame = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: 'Instrument Stats',
    iconName: 'terminal',
    children: body,
  });

  return svgDocument({
    width,
    height,
    content: frame,
    ariaLabel: `Error: ${message}`,
  });
}
