/**
 * Typography Measurement and Text Wrapping
 * Provides reliable text metrics estimation without requiring a headless browser canvas.
 */

// Average width factor relative to font size for proportional sans fonts (~0.58)
const DEFAULT_CHAR_WIDTH_FACTOR = 0.58;

// Monospace characters have a fixed 0.6 factor
const MONO_CHAR_WIDTH_FACTOR = 0.6;

/**
 * Estimates text width in SVG units given font size and family.
 */
export function estimateTextWidth(text: string, fontSize: number = 14, isMono: boolean = false): number {
  if (!text) return 0;
  const factor = isMono ? MONO_CHAR_WIDTH_FACTOR : DEFAULT_CHAR_WIDTH_FACTOR;
  return Math.ceil(text.length * fontSize * factor);
}

/**
 * Truncates text with an ellipsis if it exceeds maxLength.
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, Math.max(0, maxLength - 3)).trim() + '...';
}

/**
 * Splits text into wrapped lines that fit within a maxWidth.
 */
export function wrapText(text: string, maxWidth: number, fontSize: number = 14): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (estimateTextWidth(candidate, fontSize) <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
