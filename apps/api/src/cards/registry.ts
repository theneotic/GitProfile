import { CardType, CardOptions } from './engine/types.js';
import { renderProfileCard } from './profileCard.js';
import { renderStatsCard } from './statsCard.js';
import { renderLanguagesCard } from './languagesCard.js';
import { renderStreakCard } from './streakCard.js';
import { renderRepositoryCard } from './repositoryCard.js';
import { renderRankingsCard } from './rankingsCard.js';
import { renderTrophiesCard } from './trophiesCard.js';
import { renderTopContributedCard } from './topContributedCard.js';
import { renderWrappedCard } from './wrappedCard.js';
import { renderActivityGraphCard } from './activityGraphCard.js';
import {
  MOCK_PROFILE,
  MOCK_STATS,
  MOCK_LANGUAGES,
  MOCK_STREAK,
  MOCK_REPOSITORY,
  MOCK_RANKINGS,
  MOCK_TROPHIES,
  MOCK_TOP_CONTRIBUTED,
  MOCK_WRAPPED,
  MOCK_ACTIVITY_GRAPH,
} from './mock-data.js';

export type CardRenderer = (data: any, options: CardOptions) => string;

export const CARD_REGISTRY: Record<
  CardType,
  {
    name: string;
    description: string;
    endpoint: string;
    render: CardRenderer;
    getMockData: () => any;
  }
> = {
  profile: {
    name: 'Profile Card',
    description: 'User avatar, bio, follower count, and account overview',
    endpoint: '/cards/profile.svg',
    render: renderProfileCard,
    getMockData: () => MOCK_PROFILE,
  },
  stats: {
    name: 'Stats Overview Card',
    description: 'Total stars, commits, PRs, issues, and transparent grade',
    endpoint: '/cards/stats.svg',
    render: renderStatsCard,
    getMockData: () => MOCK_STATS,
  },
  languages: {
    name: 'Languages Card',
    description: 'Most used programming languages with stacked or vertical bars',
    endpoint: '/cards/languages.svg',
    render: renderLanguagesCard,
    getMockData: () => MOCK_LANGUAGES,
  },
  streak: {
    name: 'Streak Card',
    description: 'Current, longest, and total contribution streaks',
    endpoint: '/cards/streak.svg',
    render: renderStreakCard,
    getMockData: () => MOCK_STREAK,
  },
  repository: {
    name: 'Repository Card',
    description: 'Single repository stars, forks, language, and license',
    endpoint: '/cards/repository.svg',
    render: renderRepositoryCard,
    getMockData: () => MOCK_REPOSITORY,
  },
  rankings: {
    name: 'Rankings Card',
    description: 'Percentile ranking with radial progress ring and signal drivers',
    endpoint: '/cards/rankings.svg',
    render: renderRankingsCard,
    getMockData: () => MOCK_RANKINGS,
  },
  trophies: {
    name: 'Trophies Card',
    description: 'Tiered achievement medals based on transparent thresholds',
    endpoint: '/cards/trophies.svg',
    render: renderTrophiesCard,
    getMockData: () => MOCK_TROPHIES,
  },
  topContributed: {
    name: 'Top Contributed Card',
    description: 'Top 5 third-party repositories contributed to',
    endpoint: '/cards/top-contributed.svg',
    render: renderTopContributedCard,
    getMockData: () => MOCK_TOP_CONTRIBUTED,
  },
  wrapped: {
    name: 'Wrapped Card',
    description: 'Annual recap card with 2x3 grid of mini-stat recap tiles',
    endpoint: '/cards/wrapped.svg',
    render: renderWrappedCard,
    getMockData: () => MOCK_WRAPPED,
  },
  activityGraph: {
    name: 'Activity Graph Card',
    description: '53x7 contribution heatmap matching your chosen theme accent',
    endpoint: '/cards/activity-graph.svg',
    render: renderActivityGraphCard,
    getMockData: () => MOCK_ACTIVITY_GRAPH,
  },
};

export function renderCardByType(type: CardType, data: any, options: CardOptions = {}): string {
  const entry = CARD_REGISTRY[type];
  if (!entry) {
    throw new Error(`Unknown card type: ${type}`);
  }

  const finalData = options.mock || !data ? entry.getMockData() : data;
  return entry.render(finalData, options);
}
