import { GitHubRateLimiter, defaultRateLimiter } from './rateLimiter.js';

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; type?: string }>;
  rateLimit?: {
    remaining: number;
    resetAt: string;
    cost: number;
  };
}

export class GitHubClient {
  private readonly baseUrl = 'https://api.github.com';
  private readonly graphqlUrl = 'https://api.github.com/graphql';

  constructor(
    private token: string = process.env.GITHUB_TOKEN || '',
    private rateLimiter: GitHubRateLimiter = defaultRateLimiter
  ) {}

  public setToken(token: string): void {
    this.token = token;
  }

  public async graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    await this.rateLimiter.throttleIfNeeded();

    const headers: Record<string, string> = {
      'User-Agent': 'InstrumentStats/1.0',
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `bearer ${this.token}`;
    }

    const response = await fetch(this.graphqlUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`GitHub GraphQL HTTP error ${response.status}: ${errText}`);
    }

    const json = (await response.json()) as GraphQLResponse<T>;

    if (json.rateLimit) {
      this.rateLimiter.update(json.rateLimit);
    }

    if (json.errors && json.errors.length > 0) {
      throw new Error(`GitHub GraphQL error: ${json.errors[0].message}`);
    }

    if (!json.data) {
      throw new Error('Empty data in GitHub GraphQL response');
    }

    return json.data;
  }

  public async rest<T>(path: string): Promise<T> {
    await this.rateLimiter.throttleIfNeeded();

    const headers: Record<string, string> = {
      'User-Agent': 'InstrumentStats/1.0',
      Accept: 'application/vnd.github.v3+json',
    };

    if (this.token) {
      headers.Authorization = `token ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      headers,
    });

    // Check REST rate limit headers
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    if (remaining && reset) {
      this.rateLimiter.update({
        remaining: parseInt(remaining, 10),
        resetAt: new Date(parseInt(reset, 10) * 1000).toISOString(),
        cost: 1,
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`GitHub REST HTTP error ${response.status}: ${errText}`);
    }

    return (await response.json()) as T;
  }
}
