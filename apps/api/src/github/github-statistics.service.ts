import { GitHubClient } from './github-client.js';
import {
  ProfileCardData,
  StatsCardData,
  LanguagesCardData,
  StreakCardData,
  RankingsCardData,
  TrophiesCardData,
  WrappedCardData,
  ActivityGraphCardData,
  ActivityDayItem,
  TrophyItem,
} from '../cards/mock-data.js';
import { computeRank } from '../cards/engine/rank.js';
import { getLanguageColor } from '../cards/engine/languageColors.js';

const INSTRUMENT_STATS_QUERY = `
query InstrumentStats($login: String!, $from: DateTime!, $to: DateTime!) {
  rateLimit {
    remaining
    resetAt
    cost
  }
  user(login: $login) {
    name
    login
    bio
    avatarUrl
    company
    createdAt
    followers { totalCount }
    following { totalCount }
    repositories(ownerAffiliations: OWNER, privacy: PUBLIC, first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        createdAt
        stargazerCount
        forkCount
        primaryLanguage { name color }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoriesWithContributedCommits
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

export interface CombinedStatsDTO {
  profile: ProfileCardData;
  stats: StatsCardData;
  languages: LanguagesCardData;
  streak: StreakCardData;
  rankings: RankingsCardData;
  trophies: TrophiesCardData;
  wrapped: WrappedCardData;
  activityGraph: ActivityGraphCardData;
}

export class GitHubStatisticsService {
  constructor(private client: GitHubClient = new GitHubClient()) {}

  public async getCombinedStats(login: string, year?: number): Promise<CombinedStatsDTO> {
    const targetYear = year || new Date().getFullYear();
    const from = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString();
    const to = new Date().toISOString();

    const result = await this.client.graphql<{
      user: {
        name: string | null;
        login: string;
        bio: string | null;
        avatarUrl: string;
        company: string | null;
        createdAt: string;
        followers: { totalCount: number };
        following: { totalCount: number };
        repositories: {
          totalCount: number;
          nodes: Array<{
            name: string;
            createdAt: string;
            stargazerCount: number;
            forkCount: number;
            primaryLanguage?: { name: string; color: string } | null;
            languages: {
              edges: Array<{ size: number; node: { name: string; color: string } }>;
            };
          }>;
        };
        contributionsCollection: {
          totalCommitContributions: number;
          totalPullRequestContributions: number;
          totalIssueContributions: number;
          totalRepositoriesWithContributedCommits: number;
          contributionCalendar: {
            totalContributions: number;
            weeks: Array<{
              contributionDays: Array<{
                date: string;
                contributionCount: number;
              }>;
            }>;
          };
        };
      };
    }>(INSTRUMENT_STATS_QUERY, { login, from, to });

    const user = result.user;
    if (!user) {
      throw new Error(`GitHub user '${login}' not found`);
    }

    const repos = user.repositories.nodes || [];
    const contribs = user.contributionsCollection;
    const calendar = contribs.contributionCalendar;

    // 1. Profile Data
    const profile: ProfileCardData = {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      company: user.company,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      publicRepos: user.repositories.totalCount,
      createdAt: user.createdAt,
    };

    // 2. Stars and Commits Aggregation
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazerCount || 0), 0);
    const totalCommits = contribs.totalCommitContributions;
    const totalPRs = contribs.totalPullRequestContributions;
    const totalIssues = contribs.totalIssueContributions;
    const contributedTo = contribs.totalRepositoriesWithContributedCommits;

    const rank = computeRank({
      commits: totalCommits,
      stars: totalStars,
      prs: totalPRs,
      issues: totalIssues,
      followers: profile.followers,
      contributedTo,
    });

    const stats: StatsCardData = {
      username: user.login,
      name: user.name,
      totalStars,
      totalCommits,
      totalRepositories: user.repositories.totalCount,
      pullRequests: totalPRs,
      issues: totalIssues,
      followers: profile.followers,
      contributedTo,
      rank,
    };

    // 3. Languages Aggregation (Client-side rollup without N+1 requests)
    const langByteMap: Record<string, { size: number; color?: string }> = {};
    repos.forEach((r) => {
      r.languages?.edges?.forEach((edge) => {
        const name = edge.node.name;
        if (!langByteMap[name]) {
          langByteMap[name] = { size: 0, color: edge.node.color || getLanguageColor(name) };
        }
        langByteMap[name].size += edge.size;
      });
    });

    const totalLangBytes = Object.values(langByteMap).reduce((acc, l) => acc + l.size, 0);
    const languagesList = Object.entries(langByteMap)
      .map(([name, val]) => ({
        name,
        size: val.size,
        color: val.color,
        percentage:
          totalLangBytes > 0
            ? Math.round((val.size / totalLangBytes) * 1000) / 10
            : 0,
      }))
      .sort((a, b) => b.size - a.size);

    const languages: LanguagesCardData = {
      username: user.login,
      languages: languagesList,
    };

    // 4. Streak & Activity Math from Calendar Days
    const allDays: Array<{ date: string; contributionCount: number }> = [];
    calendar.weeks.forEach((w) => {
      w.contributionDays.forEach((d) => allDays.push(d));
    });

    allDays.sort((a, b) => a.date.localeCompare(b.date));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let streakStart = '';
    let streakEnd = '';

    // Walk backwards for current streak
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0];

    let checkIndex = allDays.length - 1;
    if (checkIndex >= 0 && allDays[checkIndex].date === todayStr && allDays[checkIndex].contributionCount === 0) {
      checkIndex--; // Allow today to be 0 if yesterday was active
    }

    if (checkIndex >= 0 && (allDays[checkIndex].date === todayStr || allDays[checkIndex].date === yesterdayStr)) {
      if (allDays[checkIndex].contributionCount > 0) {
        streakEnd = allDays[checkIndex].date;
        for (let i = checkIndex; i >= 0; i--) {
          if (allDays[i].contributionCount > 0) {
            currentStreak++;
            streakStart = allDays[i].date;
          } else {
            break;
          }
        }
      }
    }

    // Longest streak forward pass
    for (const d of allDays) {
      if (d.contributionCount > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    const streak: StreakCardData = {
      username: user.login,
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalContributions: calendar.totalContributions,
      currentStreakStart: streakStart || undefined,
      currentStreakEnd: streakEnd || undefined,
    };

    // 5. Activity Graph Heatmap (53 cols x 7 days)
    const heatmapDays: ActivityDayItem[] = allDays.slice(-371).map((d) => {
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (d.contributionCount >= 10) level = 4;
      else if (d.contributionCount >= 7) level = 3;
      else if (d.contributionCount >= 4) level = 2;
      else if (d.contributionCount >= 1) level = 1;

      return {
        date: d.date,
        count: d.contributionCount,
        level,
      };
    });

    const activityGraph: ActivityGraphCardData = {
      username: user.login,
      totalContributions: calendar.totalContributions,
      days: heatmapDays,
    };

    // 6. Rankings
    const rankings: RankingsCardData = {
      username: user.login,
      rank,
    };

    // 7. Trophies
    const getTier = (val: number, gold: number, silver: number, bronze: number): 'gold' | 'silver' | 'bronze' | 'none' => {
      if (val >= gold) return 'gold';
      if (val >= silver) return 'silver';
      if (val >= bronze) return 'bronze';
      return 'none';
    };

    const trophiesList: TrophyItem[] = [
      {
        id: 'commits',
        title: 'Commits',
        tier: getTier(totalCommits, 1000, 500, 100),
        icon: 'commit',
        description: `${totalCommits} commits in past year`,
      },
      {
        id: 'stars',
        title: 'Stars',
        tier: getTier(totalStars, 300, 100, 25),
        icon: 'star',
        description: `${totalStars} stargazers earned`,
      },
      {
        id: 'prs',
        title: 'PRs',
        tier: getTier(totalPRs, 50, 20, 5),
        icon: 'pullRequest',
        description: `${totalPRs} pull requests opened`,
      },
      {
        id: 'issues',
        title: 'Issues',
        tier: getTier(totalIssues, 40, 15, 5),
        icon: 'issue',
        description: `${totalIssues} issues closed`,
      },
      {
        id: 'followers',
        title: 'Followers',
        tier: getTier(profile.followers, 200, 50, 10),
        icon: 'followers',
        description: `${profile.followers} community followers`,
      },
      {
        id: 'repos',
        title: 'Repositories',
        tier: getTier(user.repositories.totalCount, 25, 10, 3),
        icon: 'repo',
        description: `${user.repositories.totalCount} public repositories`,
      },
    ];

    const trophies: TrophiesCardData = {
      username: user.login,
      trophies: trophiesList,
    };

    // 8. Wrapped Data (Annual Recap)
    const yearDays = allDays.filter((d) => d.date.startsWith(String(targetYear)));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = new Array(12).fill(0);

    let busiestCount = 0;
    let busiestDate = 'None';

    yearDays.forEach((d) => {
      const monthIdx = parseInt(d.date.split('-')[1], 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        monthCounts[monthIdx] += d.contributionCount;
      }
      if (d.contributionCount > busiestCount) {
        busiestCount = d.contributionCount;
        busiestDate = d.date;
      }
    });

    let topMonthIdx = 0;
    monthCounts.forEach((cnt, idx) => {
      if (cnt > monthCounts[topMonthIdx]) topMonthIdx = idx;
    });

    const newReposCount = repos.filter((r) => r.createdAt && r.createdAt.startsWith(String(targetYear))).length;

    const wrapped: WrappedCardData = {
      username: user.login,
      year: targetYear,
      totalContributions: yearDays.reduce((acc, d) => acc + d.contributionCount, 0),
      mostActiveMonth: months[topMonthIdx] || 'Jan',
      busiestDay: {
        date: busiestDate,
        count: busiestCount,
      },
      topLanguage: languagesList[0]?.name || 'TypeScript',
      newReposCreated: newReposCount,
      longestStreak,
    };

    return {
      profile,
      stats,
      languages,
      streak,
      rankings,
      trophies,
      wrapped,
      activityGraph,
    };
  }
}
