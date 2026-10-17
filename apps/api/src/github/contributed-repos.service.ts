import { GitHubClient } from './github-client.js';
import { TopContributedCardData, ContributedRepoItem } from '../cards/mock-data.js';

const TOP_CONTRIBUTED_QUERY = `
query TopContributed($login: String!) {
  rateLimit {
    remaining
    resetAt
    cost
  }
  user(login: $login) {
    repositoriesContributedTo(first: 10, contributionTypes: [COMMIT], includeUserRepositories: false, orderBy: {field: STARGAZERS, direction: DESC}) {
      nodes {
        nameWithOwner
        stargazerCount
        primaryLanguage { name color }
      }
    }
  }
}
`;

export class ContributedReposService {
  constructor(private client: GitHubClient = new GitHubClient()) {}

  public async getTopContributed(login: string): Promise<TopContributedCardData> {
    const result = await this.client.graphql<{
      user: {
        repositoriesContributedTo: {
          nodes: Array<{
            nameWithOwner: string;
            stargazerCount: number;
            primaryLanguage?: { name: string; color: string } | null;
          }>;
        };
      };
    }>(TOP_CONTRIBUTED_QUERY, { login });

    const nodes = result.user?.repositoriesContributedTo?.nodes || [];
    const repos: ContributedRepoItem[] = [];

    for (const node of nodes.slice(0, 5)) {
      const parts = node.nameWithOwner.split('/');
      const owner = parts[0] || '';
      const repo = parts[1] || '';

      let commitCount = 1;
      try {
        // Approximate commit count from REST commits query
        const commits = await this.client.rest<any[]>(
          `/repos/${owner}/${repo}/commits?author=${encodeURIComponent(login)}&per_page=100`
        );
        commitCount = Array.isArray(commits) ? commits.length : 1;
      } catch {
        commitCount = 1;
      }

      repos.push({
        owner,
        repo,
        commits: commitCount,
        stars: node.stargazerCount,
        language: node.primaryLanguage?.name,
      });
    }

    repos.sort((a, b) => b.commits - a.commits);

    return {
      username: login,
      repositories: repos,
    };
  }
}
