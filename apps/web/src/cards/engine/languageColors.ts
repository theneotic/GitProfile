/**
 * Official GitHub Linguist language colors.
 * Used for language breakdowns, stacked progress bars, and dot badges.
 */

export const LANGUAGE_COLORS: Record<string, string> = {
  javascript: '#f1e05a',
  typescript: '#3178c6',
  python: '#3572a5',
  html: '#e34c26',
  css: '#563d7c',
  java: '#b07219',
  'c++': '#f34b7d',
  'c#': '#178600',
  c: '#555555',
  go: '#00add8',
  rust: '#dea584',
  ruby: '#701516',
  php: '#4f5d95',
  shell: '#89e051',
  bash: '#89e051',
  swift: '#f05138',
  kotlin: '#a97bff',
  'objective-c': '#438eff',
  scala: '#c22d40',
  r: '#198ce7',
  dart: '#00b4ab',
  vue: '#41b883',
  svelte: '#ff3e00',
  lua: '#000080',
  clojure: '#db5855',
  elixir: '#6e4a7e',
  haskell: '#5e5086',
  zig: '#ec915c',
  solidity: '#aa6746',
  jupyter: '#da5b0b',
  'jupyter notebook': '#da5b0b',
  markdown: '#083fa1',
  dockerfile: '#384d54',
  sql: '#e38c00',
  graphql: '#e10098',
};

/**
 * Retrieves the canonical color for a language, or generates a deterministic fallback hex.
 */
export function getLanguageColor(languageName: string): string {
  const normalized = languageName.toLowerCase().trim();
  if (LANGUAGE_COLORS[normalized]) {
    return LANGUAGE_COLORS[normalized];
  }
  // Deterministic fallback color based on name hash
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${'00000'.substring(0, 6 - c.length)}${c}`;
}
