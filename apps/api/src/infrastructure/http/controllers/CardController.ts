import { Request, Response } from 'express';
import { CardType, CardOptions } from '../../../cards/engine/types.js';
import { renderCardByType, renderErrorCard } from '../../../cards/index.js';
import { schemaFor } from '../../../validators/index.js';
import { GetCardPresetUseCase } from '../../../application/use-cases/CardPresetUseCases.js';
import { GitHubStatisticsService } from '../../../github/github-statistics.service.js';
import { RepositoryStatsService } from '../../../github/repository-stats.service.js';
import { ContributedReposService } from '../../../github/contributed-repos.service.js';
import { ICacheService, defaultCacheService } from '../../cache/cacheService.js';

export class CardController {
  constructor(
    private getPresetUseCase: GetCardPresetUseCase,
    private statsService: GitHubStatisticsService = new GitHubStatisticsService(),
    private repoStatsService: RepositoryStatsService = new RepositoryStatsService(),
    private topContributedService: ContributedReposService = new ContributedReposService(),
    private cacheService: ICacheService = defaultCacheService
  ) {}

  public async renderCard(req: Request, res: Response): Promise<void> {
    const rawType = req.params.type?.replace(/\.svg$/, '') as CardType;
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');

    try {
      const validator = schemaFor(rawType);
      const queryParams = validator.parse(req.query) as CardOptions & {
        username?: string;
        owner?: string;
        repo?: string;
        year?: number;
      };

      const cacheKey = `card:${rawType}:${JSON.stringify(req.query)}`;
      const cachedSvg = await this.cacheService.get<string>(cacheKey);
      if (cachedSvg) {
        res.status(200).send(cachedSvg);
        return;
      }

      let data: any = null;
      const isMock = Boolean(queryParams.mock);

      if (!isMock) {
        try {
          if (rawType === 'repository' && queryParams.owner && queryParams.repo) {
            data = await this.repoStatsService.getRepositoryStats(
              queryParams.owner,
              queryParams.repo
            );
          } else if (rawType === 'topContributed' && queryParams.username) {
            data = await this.topContributedService.getTopContributed(queryParams.username);
          } else if (queryParams.username) {
            const combined = await this.statsService.getCombinedStats(
              queryParams.username,
              queryParams.year
            );
            data = (combined as any)[rawType] || combined.stats;
          }
        } catch (fetchErr: any) {
          // If GitHub API fails or user is offline/unauthenticated, fall back to mock data or notice
          if (!process.env.GITHUB_TOKEN) {
            data = null; // renderCardByType falls back to clean mock data
          } else {
            const errorSvg = renderErrorCard(fetchErr.message || 'GitHub API Error', queryParams);
            res.status(200).send(errorSvg);
            return;
          }
        }
      }

      const svg = renderCardByType(rawType, data, queryParams);
      await this.cacheService.set(cacheKey, svg, 300);

      res.status(200).send(svg);
    } catch (err: any) {
      const errorSvg = renderErrorCard(err.message || 'Invalid Request', req.query as CardOptions);
      res.status(200).send(errorSvg);
    }
  }

  public async renderByPreset(req: Request, res: Response): Promise<void> {
    const slug = req.params.slug?.replace(/\.svg$/, '');
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');

    try {
      const preset = await this.getPresetUseCase.getBySlug(slug);
      if (!preset) {
        const errorSvg = renderErrorCard(`Preset '${slug}' not found`);
        res.status(200).send(errorSvg);
        return;
      }

      const cacheKey = `preset:${slug}`;
      const cachedSvg = await this.cacheService.get<string>(cacheKey);
      if (cachedSvg) {
        res.status(200).send(cachedSvg);
        return;
      }

      const options: CardOptions = {
        ...preset.options,
        sponsor: preset.sponsor,
      };

      let data: any = null;
      const username = (options.username as string) || '';

      if (username) {
        try {
          if (preset.cardType === 'repository' && options.owner && options.repo) {
            data = await this.repoStatsService.getRepositoryStats(
              options.owner as string,
              options.repo as string
            );
          } else if (preset.cardType === 'topContributed') {
            data = await this.topContributedService.getTopContributed(username);
          } else {
            const combined = await this.statsService.getCombinedStats(
              username,
              options.year as number
            );
            data = (combined as any)[preset.cardType] || combined.stats;
          }
        } catch {
          data = null;
        }
      }

      const svg = renderCardByType(preset.cardType, data, options);
      await this.cacheService.set(cacheKey, svg, 300);

      res.status(200).send(svg);
    } catch (err: any) {
      const errorSvg = renderErrorCard(err.message || 'Error rendering preset');
      res.status(200).send(errorSvg);
    }
  }
}
