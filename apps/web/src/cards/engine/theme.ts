import { Theme, CardOptions, FontStyleOption } from './types';

export const THEMES: Record<string, Theme> = {
  // Reference backward-compatible 5 themes
  light: {
    name: 'light',
    background: '#ffffff',
    primaryText: '#24292f',
    secondaryText: '#57606a',
    border: '#d0d7de',
    accent: '#0969da',
    progressColors: { background: '#eaeef2', fill: '#0969da' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  dark: {
    name: 'dark',
    background: '#0d1117',
    primaryText: '#c9d1d9',
    secondaryText: '#8b949e',
    border: '#30363d',
    accent: '#58a6ff',
    progressColors: { background: '#161b22', fill: '#58a6ff' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  github: {
    name: 'github',
    background: '#0d1117',
    primaryText: '#c9d1d9',
    secondaryText: '#8b949e',
    border: '#30363d',
    accent: '#2ea44f',
    progressColors: { background: '#161b22', fill: '#2ea44f' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  dracula: {
    name: 'dracula',
    background: '#282a36',
    primaryText: '#f8f8f2',
    secondaryText: '#6272a4',
    border: '#44475a',
    accent: '#50fa7b',
    progressColors: { background: '#44475a', fill: '#ff79c6' },
    fontFamily: 'Courier New, Courier, monospace',
  },
  nord: {
    name: 'nord',
    background: '#2e3440',
    primaryText: '#eceff4',
    secondaryText: '#d8dee9',
    border: '#4c566a',
    accent: '#88c0d0',
    progressColors: { background: '#4c566a', fill: '#88c0d0' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  // 9 New Standard Themes from Section 16
  terminal: {
    name: 'terminal',
    background: '#0a0a0c',
    primaryText: '#e8e8ec',
    secondaryText: '#9a9aa4',
    border: '#26262c',
    accent: '#3ddc84',
    progressColors: { background: '#18181d', fill: '#3ddc84' },
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
  },
  'solarized-dark': {
    name: 'solarized-dark',
    background: '#002b36',
    primaryText: '#839496',
    secondaryText: '#586e75',
    border: '#073642',
    accent: '#268bd2',
    progressColors: { background: '#073642', fill: '#2aa198' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  'solarized-light': {
    name: 'solarized-light',
    background: '#fdf6e3',
    primaryText: '#657b83',
    secondaryText: '#93a1a1',
    border: '#eee8d5',
    accent: '#268bd2',
    progressColors: { background: '#eee8d5', fill: '#2aa198' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  monokai: {
    name: 'monokai',
    background: '#272822',
    primaryText: '#f8f8f2',
    secondaryText: '#75715e',
    border: '#49483e',
    accent: '#a6e22e',
    progressColors: { background: '#49483e', fill: '#fd971f' },
    fontFamily: '"JetBrains Mono", monospace',
  },
  'tokyo-night': {
    name: 'tokyo-night',
    background: '#1a1b26',
    primaryText: '#c0caf5',
    secondaryText: '#565f89',
    border: '#292e42',
    accent: '#7aa2f7',
    progressColors: { background: '#292e42', fill: '#bb9af7' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  'catppuccin-mocha': {
    name: 'catppuccin-mocha',
    background: '#1e1e2e',
    primaryText: '#cdd6f4',
    secondaryText: '#a6adc8',
    border: '#313244',
    accent: '#cba6f7',
    progressColors: { background: '#313244', fill: '#f5c2e7' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  'catppuccin-latte': {
    name: 'catppuccin-latte',
    background: '#eff1f5',
    primaryText: '#4c4f69',
    secondaryText: '#6c6f85',
    border: '#ccd0da',
    accent: '#8839ef',
    progressColors: { background: '#ccd0da', fill: '#ea76cb' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  'rose-pine': {
    name: 'rose-pine',
    background: '#191724',
    primaryText: '#e0def4',
    secondaryText: '#908caa',
    border: '#26233a',
    accent: '#c4a7e7',
    progressColors: { background: '#26233a', fill: '#eb6f92' },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  gruvbox: {
    name: 'gruvbox',
    background: '#282828',
    primaryText: '#ebdbb2',
    secondaryText: '#a89984',
    border: '#3c3836',
    accent: '#fe8019',
    progressColors: { background: '#3c3836', fill: '#b8bb26' },
    fontFamily: '"JetBrains Mono", monospace',
  },
  'wabi-sabi': {
    name: 'wabi-sabi',
    background: '#151412',
    primaryText: '#e7e5e4',
    secondaryText: '#a8a29e',
    border: '#383531',
    accent: '#ca8a04',
    progressColors: { background: '#2b2824', fill: '#ca8a04' },
    fontFamily: '"Shippori Mincho", Georgia, serif',
  },
  'pixel-art': {
    name: 'pixel-art',
    background: '#0f0d1b',
    primaryText: '#f3e8ff',
    secondaryText: '#d8b4fe',
    border: '#a855f7',
    accent: '#e879f9',
    progressColors: { background: '#272244', fill: '#facc15' },
    fontFamily: '"Press Start 2P", "Silkscreen", monospace',
  },
};

export const FONT_STACKS: Record<FontStyleOption, string> = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  mono: '"JetBrains Mono", "SF Mono", Consolas, Menlo, Monaco, monospace',
  rounded: '"Quicksand", "Nunito", -apple-system, BlinkMacSystemFont, sans-serif',
};

/**
 * Normalizes hex colors by ensuring leading '#'
 */
export function sanitizeColor(color?: string): string | undefined {
  if (!color) return undefined;
  const clean = color.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3,8}$/.test(clean)) {
    return `#${clean}`;
  }
  return color;
}

/**
 * Resolves theme with query parameter overrides and custom color palette support.
 * Default fallback is 'terminal' per Section 16 brand requirement.
 */
export function resolveThemeWithOptions(options?: CardOptions): Theme {
  const requestedTheme = options?.theme?.toLowerCase();
  const baseTheme = (requestedTheme && THEMES[requestedTheme]) || THEMES.terminal;

  // Clone base theme
  const resolved: Theme = {
    name: baseTheme.name,
    background: sanitizeColor(options?.background) || baseTheme.background,
    primaryText: sanitizeColor(options?.primary_text) || baseTheme.primaryText,
    secondaryText: sanitizeColor(options?.secondary_text) || baseTheme.secondaryText,
    border: sanitizeColor(options?.border) || baseTheme.border,
    accent: sanitizeColor(options?.accent) || baseTheme.accent,
    progressColors: {
      background: baseTheme.progressColors.background,
      fill: sanitizeColor(options?.accent) || baseTheme.progressColors.fill,
    },
    fontFamily: baseTheme.fontFamily,
  };

  // Font styling options
  if (options?.font_style && FONT_STACKS[options.font_style]) {
    resolved.fontFamily = FONT_STACKS[options.font_style];
  }

  if (options?.font_family) {
    resolved.fontFamily = options.font_family;
  }

  return resolved;
}
