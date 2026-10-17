import { Request, Response } from 'express';
import { GitHubStatisticsService } from '../../../github/github-statistics.service.js';
import {
  MOCK_PROFILE,
  MOCK_STATS,
  MOCK_LANGUAGES,
  MOCK_STREAK,
  MOCK_RANKINGS,
  MOCK_TROPHIES,
  MOCK_WRAPPED,
  MOCK_ACTIVITY_GRAPH,
} from '../../../cards/mock-data.js';

export class StatsController {
  constructor(private statsService: GitHubStatisticsService = new GitHubStatisticsService()) {}

  public async getStats(req: Request, res: Response): Promise<void> {
    const username = req.query.username as string;
    const isMock = req.query.mock === 'true' || !username;

    if (isMock) {
      res.status(200).json({
        success: true,
        data: {
          profile: MOCK_PROFILE,
          stats: MOCK_STATS,
          languages: MOCK_LANGUAGES,
          streak: MOCK_STREAK,
          rankings: MOCK_RANKINGS,
          trophies: MOCK_TROPHIES,
          wrapped: MOCK_WRAPPED,
          activityGraph: MOCK_ACTIVITY_GRAPH,
        },
      });
      return;
    }

    try {
      const stats = await this.statsService.getCombinedStats(username);
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err: any) {
      // Fallback to mock data on unconfigured token or network error
      res.status(200).json({
        success: true,
        data: {
          profile: { ...MOCK_PROFILE, username },
          stats: { ...MOCK_STATS, username },
          languages: { ...MOCK_LANGUAGES, username },
          streak: { ...MOCK_STREAK, username },
          rankings: { ...MOCK_RANKINGS, username },
          trophies: { ...MOCK_TROPHIES, username },
          wrapped: { ...MOCK_WRAPPED, username },
          activityGraph: { ...MOCK_ACTIVITY_GRAPH, username },
        },
      });
    }
  }
}
