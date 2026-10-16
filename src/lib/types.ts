export interface GitHubUserRaw {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface CyberStatsData {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  totalRepositories: number;
  pullRequests: number;
  issues: number;
  followers: number;
  currentStreak: number;
  longestStreak: number;
  topLanguages: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  accountAgeYears: number;
}

export interface CyberThemeConfig {
  id: string;
  name: string;
  background: string;
  surface: string;
  accentPrimary: string;
  accentSecondary: string;
  textPrimary: string;
  textMuted: string;
  gridLine: string;
  bracketColor: string;
  glowColor: string;
}

export const CYBER_THEMES: Record<string, CyberThemeConfig> = {
  cybercore: {
    id: 'cybercore',
    name: 'Cybercore Cyan',
    background: '#07090e',
    surface: 'rgba(13, 17, 26, 0.85)',
    accentPrimary: '#00f0ff',
    accentSecondary: '#ff0055',
    textPrimary: '#f0f6fc',
    textMuted: '#6e7681',
    gridLine: 'rgba(0, 240, 255, 0.08)',
    bracketColor: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.35)',
  },
  toxic: {
    id: 'toxic',
    name: 'Toxic Matrix',
    background: '#040d07',
    surface: 'rgba(5, 25, 12, 0.85)',
    accentPrimary: '#39ff14',
    accentSecondary: '#00f0ff',
    textPrimary: '#e6fffa',
    textMuted: '#227040',
    gridLine: 'rgba(57, 255, 20, 0.08)',
    bracketColor: '#39ff14',
    glowColor: 'rgba(57, 255, 20, 0.35)',
  },
  hazard: {
    id: 'hazard',
    name: 'Hazard Amber',
    background: '#0e0b04',
    surface: 'rgba(25, 19, 6, 0.85)',
    accentPrimary: '#ffaa00',
    accentSecondary: '#ff3300',
    textPrimary: '#fff8eb',
    textMuted: '#7c5e20',
    gridLine: 'rgba(255, 170, 0, 0.08)',
    bracketColor: '#ffaa00',
    glowColor: 'rgba(255, 170, 0, 0.35)',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Violet',
    background: '#090a10',
    surface: 'rgba(16, 17, 28, 0.85)',
    accentPrimary: '#a855f7',
    accentSecondary: '#ec4899',
    textPrimary: '#f8fafc',
    textMuted: '#64748b',
    gridLine: 'rgba(168, 85, 247, 0.08)',
    bracketColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.35)',
  },
};
