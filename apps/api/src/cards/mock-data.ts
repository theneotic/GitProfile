import { RankResult, computeRank } from './engine/rank.js';

export interface ProfileCardData {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
}

export interface StatsCardData {
  username: string;
  name: string | null;
  totalStars: number;
  totalCommits: number;
  totalRepositories: number;
  pullRequests: number;
  issues: number;
  followers: number;
  contributedTo: number;
  rank?: RankResult;
}

export interface LanguageItem {
  name: string;
  size: number;
  color?: string;
  percentage?: number;
}

export interface LanguagesCardData {
  username: string;
  languages: LanguageItem[];
}

export interface StreakCardData {
  username: string;
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  currentStreakStart?: string;
  currentStreakEnd?: string;
}

export interface RepositoryCardData {
  owner: string;
  repo: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
}

export interface RankingsCardData {
  username: string;
  rank: RankResult;
}

export interface TrophyItem {
  id: string;
  title: string;
  tier: 'gold' | 'silver' | 'bronze' | 'none';
  icon: 'star' | 'commit' | 'pullRequest' | 'issue' | 'followers' | 'repo';
  description: string;
}

export interface TrophiesCardData {
  username: string;
  trophies: TrophyItem[];
}

export interface ContributedRepoItem {
  owner: string;
  repo: string;
  commits: number;
  stars: number;
  language?: string;
}

export interface TopContributedCardData {
  username: string;
  repositories: ContributedRepoItem[];
}

export interface WrappedCardData {
  username: string;
  year: number;
  totalContributions: number;
  mostActiveMonth: string;
  busiestDay: {
    date: string;
    count: number;
  };
  topLanguage: string;
  newReposCreated: number;
  longestStreak: number;
}

export interface ActivityDayItem {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ActivityGraphCardData {
  username: string;
  totalContributions: number;
  days: ActivityDayItem[];
}

// Generate 53 weeks x 7 days = 371 mock activity days
function generateMockActivityDays(): ActivityDayItem[] {
  const days: ActivityDayItem[] = [];
  const today = new Date();
  for (let i = 370; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Deterministic pseudo-random pattern
    const seed = (i * 17 + 23) % 100;
    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (seed > 80) {
      count = 12;
      level = 4;
    } else if (seed > 60) {
      count = 7;
      level = 3;
    } else if (seed > 35) {
      count = 4;
      level = 2;
    } else if (seed > 15) {
      count = 2;
      level = 1;
    }
    days.push({
      date: d.toISOString().split('T')[0],
      count,
      level,
    });
  }
  return days;
}

export const MOCK_PROFILE: ProfileCardData = {
  username: 'theneotic',
  name: 'Alistair Siddiqui',
  avatarUrl: 'https://avatars.githubusercontent.com/u/157010181?v=4',
  bio: 'Building direct instruments, autonomous systems & high-precision tools.',
  company: 'Direct Instruments',
  followers: 142,
  following: 89,
  publicRepos: 34,
  createdAt: '2022-04-12T00:00:00Z',
};

export const MOCK_STATS: StatsCardData = {
  username: 'theneotic',
  name: 'Alistair Siddiqui',
  totalStars: 486,
  totalCommits: 1842,
  totalRepositories: 34,
  pullRequests: 88,
  issues: 52,
  followers: 142,
  contributedTo: 19,
  rank: computeRank({
    commits: 1842,
    stars: 486,
    prs: 88,
    issues: 52,
    followers: 142,
    contributedTo: 19,
  }),
};

export const MOCK_LANGUAGES: LanguagesCardData = {
  username: 'theneotic',
  languages: [
    { name: 'TypeScript', size: 1245000, percentage: 48.2 },
    { name: 'Python', size: 680000, percentage: 26.3 },
    { name: 'Rust', size: 320000, percentage: 12.4 },
    { name: 'Go', size: 190000, percentage: 7.4 },
    { name: 'HTML', size: 85000, percentage: 3.3 },
    { name: 'CSS', size: 62000, percentage: 2.4 },
  ],
};

export const MOCK_STREAK: StreakCardData = {
  username: 'theneotic',
  currentStreak: 47,
  longestStreak: 128,
  totalContributions: 2490,
  currentStreakStart: '2026-03-01',
  currentStreakEnd: '2026-04-17',
};

export const MOCK_REPOSITORY: RepositoryCardData = {
  owner: 'theneotic',
  repo: 'instrument-stats',
  description: 'High-precision, embeddable GitHub stats cards with terminal aesthetics & custom layout engines.',
  stars: 342,
  forks: 48,
  language: 'TypeScript',
  license: 'MIT',
};

export const MOCK_RANKINGS: RankingsCardData = {
  username: 'theneotic',
  rank: computeRank({
    commits: 1842,
    stars: 486,
    prs: 88,
    issues: 52,
    followers: 142,
    contributedTo: 19,
  }),
};

export const MOCK_TROPHIES: TrophiesCardData = {
  username: 'theneotic',
  trophies: [
    { id: 'commits', title: 'Commits', tier: 'gold', icon: 'commit', description: '1.8k+ commits' },
    { id: 'stars', title: 'Stars', tier: 'gold', icon: 'star', description: '450+ stars' },
    { id: 'prs', title: 'PRs', tier: 'silver', icon: 'pullRequest', description: '80+ PRs opened' },
    { id: 'issues', title: 'Issues', tier: 'silver', icon: 'issue', description: '50+ issues closed' },
    { id: 'followers', title: 'Followers', tier: 'bronze', icon: 'followers', description: '100+ followers' },
    { id: 'repos', title: 'Repositories', tier: 'gold', icon: 'repo', description: '30+ repos' },
  ],
};

export const MOCK_TOP_CONTRIBUTED: TopContributedCardData = {
  username: 'theneotic',
  repositories: [
    { owner: 'vercel', repo: 'next.js', commits: 14, stars: 124000, language: 'TypeScript' },
    { owner: 'shadcn-ui', repo: 'ui', commits: 9, stars: 74000, language: 'TypeScript' },
    { owner: 'expressjs', repo: 'express', commits: 7, stars: 64000, language: 'JavaScript' },
    { owner: 'tailwindlabs', repo: 'tailwindcss', commits: 5, stars: 82000, language: 'CSS' },
    { owner: 'colinhacks', repo: 'zod', commits: 4, stars: 36000, language: 'TypeScript' },
  ],
};

export const MOCK_WRAPPED: WrappedCardData = {
  username: 'theneotic',
  year: 2026,
  totalContributions: 2490,
  mostActiveMonth: 'March',
  busiestDay: {
    date: 'March 14, 2026',
    count: 38,
  },
  topLanguage: 'TypeScript',
  newReposCreated: 12,
  longestStreak: 128,
};

export const MOCK_ACTIVITY_GRAPH: ActivityGraphCardData = {
  username: 'theneotic',
  totalContributions: 2490,
  days: generateMockActivityDays(),
};
