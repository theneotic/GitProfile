/**
 * GitHub API Rate Limiter (Section 18.4)
 * Token-bucket and adaptive backoff manager informed directly by GitHub's
 * upstream `rateLimit { remaining resetAt cost }` telemetry.
 */

export interface GitHubRateLimitState {
  remaining: number;
  resetAt: string;
  cost: number;
}

export class GitHubRateLimiter {
  private remaining = 5000;
  private resetAt = new Date(Date.now() + 3600 * 1000).toISOString();
  private readonly thresholdFloor = 100;
  private isThrottled = false;

  public update(state: GitHubRateLimitState): void {
    this.remaining = state.remaining;
    this.resetAt = state.resetAt;
    this.isThrottled = this.remaining < this.thresholdFloor;
  }

  public getState(): { remaining: number; resetAt: string; isThrottled: boolean } {
    return {
      remaining: this.remaining,
      resetAt: this.resetAt,
      isThrottled: this.isThrottled,
    };
  }

  /**
   * Pre-emptively waits if the token bucket is low before firing upstream.
   */
  public async throttleIfNeeded(): Promise<void> {
    if (!this.isThrottled) return;

    const resetMs = new Date(this.resetAt).getTime() - Date.now();
    if (resetMs <= 0) {
      this.isThrottled = false;
      return;
    }

    // Space out requests proportionally to remaining quota vs reset window
    const delayMs = Math.min(5000, Math.max(250, Math.floor(resetMs / (this.remaining + 1))));
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

export const defaultRateLimiter = new GitHubRateLimiter();
