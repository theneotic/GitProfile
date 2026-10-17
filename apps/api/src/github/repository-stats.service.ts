import { GitHubClient } from './github-client.js';
import { RepositoryCardData } from '../cards/mock-data.js';

const REPO_CARD_QUERY = `
query RepoCard($owner: String!, $name: String!) {
  rateLimit {
    remaining
    resetAt
    cost
  }
  repository(owner: $owner, name: $name) {
    name
    description
    primaryLanguage { name color }
    stargazerCount
    forkCount
    licenseInfo { spdxId }
  }
}
`;

export class RepositoryStatsService {
  constructor(private client: GitHubClient = new GitHubClient()) {}

  public async getRepositoryStats(owner: string, repo: string): Promise<RepositoryCardData> {
    const result = await this.client.graphql<{
      repository: {
        name: string;
        description: string | null;
        primaryLanguage?: { name: string; color: string } | null;
        stargazerCount: number;
        forkCount: number;
        licenseInfo?: { spdxId: string } | null;
      };
    }>(REPO_CARD_QUERY, { owner, name: repo });

    const r = result.repository;
    if (!r) {
      throw new Error(`Repository ${owner}/${repo} not found`);
    }

    return {
      owner,
      repo: r.name,
      description: r.description,
      stars: r.stargazerCount,
      forks: r.forkCount,
      language: r.primaryLanguage?.name || null,
      license: r.licenseInfo?.spdxId || null,
    };
  }
}
