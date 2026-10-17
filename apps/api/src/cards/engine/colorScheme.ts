import { Theme, CardOptions } from './types.js';
import { THEMES } from './theme.js';

export const AUTO_THEME_VARIABLES = {
  bg: '--card-bg',
  primaryText: '--card-primary-text',
  secondaryText: '--card-secondary-text',
  border: '--card-border',
  accent: '--card-accent',
  progressBg: '--card-progress-bg',
  progressFill: '--card-progress-fill',
};

/**
 * Checks if the request requests automatic color scheme switching
 */
export function isAutoTheme(options: CardOptions): boolean {
  return options.theme?.toLowerCase() === 'auto';
}

/**
 * Returns a Theme object that uses CSS variable references instead of static hex values.
 */
export function getAutoTheme(options: CardOptions): Theme {
  return {
    name: 'auto',
    background: options.background || `var(${AUTO_THEME_VARIABLES.bg})`,
    primaryText: options.primary_text || `var(${AUTO_THEME_VARIABLES.primaryText})`,
    secondaryText: options.secondary_text || `var(${AUTO_THEME_VARIABLES.secondaryText})`,
    border: options.border || `var(${AUTO_THEME_VARIABLES.border})`,
    accent: options.accent || `var(${AUTO_THEME_VARIABLES.accent})`,
    progressColors: {
      background: `var(${AUTO_THEME_VARIABLES.progressBg})`,
      fill: options.accent || `var(${AUTO_THEME_VARIABLES.progressFill})`,
    },
    fontFamily: options.font_family || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };
}

/**
 * Generates the CSS rules with @media (prefers-color-scheme: dark) and light
 */
export function generateAutoThemeCss(options: CardOptions): string {
  const darkTheme = THEMES['dark'];
  const lightTheme = THEMES['light'];

  const darkBg = options.background || darkTheme.background;
  const darkPrimary = options.primary_text || darkTheme.primaryText;
  const darkSecondary = options.secondary_text || darkTheme.secondaryText;
  const darkBorder = options.border || darkTheme.border;
  const darkAccent = options.accent || darkTheme.accent;

  const lightBg = options.background || lightTheme.background;
  const lightPrimary = options.primary_text || lightTheme.primaryText;
  const lightSecondary = options.secondary_text || lightTheme.secondaryText;
  const lightBorder = options.border || lightTheme.border;
  const lightAccent = options.accent || lightTheme.accent;

  return `
:root {
  ${AUTO_THEME_VARIABLES.bg}: ${darkBg};
  ${AUTO_THEME_VARIABLES.primaryText}: ${darkPrimary};
  ${AUTO_THEME_VARIABLES.secondaryText}: ${darkSecondary};
  ${AUTO_THEME_VARIABLES.border}: ${darkBorder};
  ${AUTO_THEME_VARIABLES.accent}: ${darkAccent};
  ${AUTO_THEME_VARIABLES.progressBg}: ${darkTheme.progressColors.background};
  ${AUTO_THEME_VARIABLES.progressFill}: ${darkAccent};
}
@media (prefers-color-scheme: light) {
  :root {
    ${AUTO_THEME_VARIABLES.bg}: ${lightBg};
    ${AUTO_THEME_VARIABLES.primaryText}: ${lightPrimary};
    ${AUTO_THEME_VARIABLES.secondaryText}: ${lightSecondary};
    ${AUTO_THEME_VARIABLES.border}: ${lightBorder};
    ${AUTO_THEME_VARIABLES.accent}: ${lightAccent};
    ${AUTO_THEME_VARIABLES.progressBg}: ${lightTheme.progressColors.background};
    ${AUTO_THEME_VARIABLES.progressFill}: ${lightAccent};
  }
}
@media (prefers-color-scheme: dark) {
  :root {
    ${AUTO_THEME_VARIABLES.bg}: ${darkBg};
    ${AUTO_THEME_VARIABLES.primaryText}: ${darkPrimary};
    ${AUTO_THEME_VARIABLES.secondaryText}: ${darkSecondary};
    ${AUTO_THEME_VARIABLES.border}: ${darkBorder};
    ${AUTO_THEME_VARIABLES.accent}: ${darkAccent};
    ${AUTO_THEME_VARIABLES.progressBg}: ${darkTheme.progressColors.background};
    ${AUTO_THEME_VARIABLES.progressFill}: ${darkAccent};
  }
}
`.trim();
}
