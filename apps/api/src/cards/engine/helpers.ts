import {
  RectOptions,
  TextOptions,
  CircleOptions,
  LineOptions,
  ProgressBarOptions,
} from './types.js';

/**
 * Escapes XML/SVG reserved characters to prevent injection and syntax errors.
 */
export function escapeXml(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Formats numbers into compact metric notation (e.g. 1.2k, 5.4M)
 */
export function formatCompact(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '0';
  const val = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(val)) return '0';
  if (val >= 1000000) return `${(val / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return val.toLocaleString();
}

/**
 * Renders a full SVG document wrapper.
 */
export function svgDocument(params: {
  width: number;
  height: number;
  content: string;
  style?: string;
  defs?: string;
  ariaLabel?: string;
  id?: string;
}): string {
  const { width, height, content, style, defs, ariaLabel, id } = params;
  const cardId = id || `card-${Math.random().toString(36).substring(2, 9)}`;

  return `
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  id="${cardId}"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  role="img"
  aria-label="${escapeXml(ariaLabel || 'GitHub Stats Card')}"
>
  ${style ? `<style>${style}</style>` : ''}
  ${defs ? `<defs>${defs}</defs>` : ''}
  ${content}
</svg>
  `.trim();
}

/**
 * Renders an SVG <rect>.
 * Note: 0.5px offset is used for stroke borders to avoid subpixel antialiasing blur (Section 17.1).
 */
export function rect(options: RectOptions): string {
  const attrs: string[] = [
    `x="${options.x}"`,
    `y="${options.y}"`,
    `width="${options.width}"`,
    `height="${options.height}"`,
  ];

  if (options.rx !== undefined) attrs.push(`rx="${options.rx}"`);
  if (options.ry !== undefined) attrs.push(`ry="${options.ry}"`);
  if (options.fill !== undefined) attrs.push(`fill="${options.fill}"`);
  if (options.stroke !== undefined) attrs.push(`stroke="${options.stroke}"`);
  if (options.strokeWidth !== undefined) attrs.push(`stroke-width="${options.strokeWidth}"`);
  if (options.strokeOpacity !== undefined) attrs.push(`stroke-opacity="${options.strokeOpacity}"`);
  if (options.fillOpacity !== undefined) attrs.push(`fill-opacity="${options.fillOpacity}"`);
  if (options.className) attrs.push(`class="${options.className}"`);
  if (options.clipPath) attrs.push(`clip-path="${options.clipPath}"`);

  return `<rect ${attrs.join(' ')} />`;
}

/**
 * Renders an SVG <text> element.
 */
export function text(options: TextOptions): string {
  const attrs: string[] = [
    `x="${options.x}"`,
    `y="${options.y}"`,
  ];

  if (options.fontSize !== undefined) attrs.push(`font-size="${options.fontSize}"`);
  if (options.fontWeight !== undefined) attrs.push(`font-weight="${options.fontWeight}"`);
  if (options.fontFamily) {
    const cleanFont = options.fontFamily.replace(/"/g, "'");
    attrs.push(`font-family="${cleanFont}"`);
  }
  if (options.fill !== undefined) attrs.push(`fill="${options.fill}"`);
  if (options.textAnchor) {
    const anchor = options.textAnchor === 'center' ? 'middle' : options.textAnchor;
    attrs.push(`text-anchor="${anchor}"`);
  }
  if (options.dominantBaseline) attrs.push(`dominant-baseline="${options.dominantBaseline}"`);
  if (options.className) attrs.push(`class="${options.className}"`);
  if (options.letterSpacing) attrs.push(`letter-spacing="${options.letterSpacing}"`);
  if (options.opacity !== undefined) attrs.push(`opacity="${options.opacity}"`);

  const content = options.content !== undefined ? options.content : options.text ?? '';
  return `<text ${attrs.join(' ')}>${escapeXml(content)}</text>`;
}

/**
 * Renders an SVG <circle> element.
 */
export function circle(options: CircleOptions): string {
  const attrs: string[] = [
    `cx="${options.cx}"`,
    `cy="${options.cy}"`,
    `r="${options.r}"`,
  ];

  if (options.fill !== undefined) attrs.push(`fill="${options.fill}"`);
  if (options.stroke !== undefined) attrs.push(`stroke="${options.stroke}"`);
  if (options.strokeWidth !== undefined) attrs.push(`stroke-width="${options.strokeWidth}"`);
  if (options.className) attrs.push(`class="${options.className}"`);
  if (options.opacity !== undefined) attrs.push(`opacity="${options.opacity}"`);

  return `<circle ${attrs.join(' ')} />`;
}

/**
 * Renders an SVG <line> element.
 */
export function line(options: LineOptions): string {
  const attrs: string[] = [
    `x1="${options.x1}"`,
    `y1="${options.y1}"`,
    `x2="${options.x2}"`,
    `y2="${options.y2}"`,
  ];

  if (options.stroke !== undefined) attrs.push(`stroke="${options.stroke}"`);
  if (options.strokeWidth !== undefined) attrs.push(`stroke-width="${options.strokeWidth}"`);
  if (options.strokeOpacity !== undefined) attrs.push(`stroke-opacity="${options.strokeOpacity}"`);
  if (options.strokeDasharray) attrs.push(`stroke-dasharray="${options.strokeDasharray}"`);
  if (options.strokeLinecap) attrs.push(`stroke-linecap="${options.strokeLinecap}"`);

  return `<line ${attrs.join(' ')} />`;
}

/**
 * Renders a segmented or solid progress bar.
 */
export function progressBar(options: ProgressBarOptions): string {
  const { x, y, width, height, progress, backgroundColor, fillColor, rx, animated } = options;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const fillWidth = Math.round((clampedProgress / 100) * width);
  const radius = rx ?? height / 2;

  const bgRect = rect({
    x,
    y,
    width,
    height,
    rx: radius,
    fill: backgroundColor || 'rgba(255,255,255,0.08)',
  });

  if (fillWidth <= 0) return bgRect;

  const fillRect = rect({
    x,
    y,
    width: fillWidth,
    height,
    rx: radius,
    fill: fillColor || '#3ddc84',
    className: animated ? 'progress-fill-animated' : undefined,
  });

  return `${bgRect}\n${fillRect}`;
}
