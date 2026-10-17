import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authGuard.js';

interface ClientBucket {
  tokens: number;
  lastRefill: number;
}

const ipBuckets: Map<string, ClientBucket> = new Map();
const userBuckets: Map<string, ClientBucket> = new Map();

/**
 * Layer 1: Edge Abuse Protection (Per-IP Token Bucket)
 * Limits requests per IP to 120 requests/minute to prevent volumetric flooding.
 */
export function ipRateLimiter(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const maxTokens = 120;
  const refillRateMs = 60000 / maxTokens; // 1 token every ~500ms

  let bucket = ipBuckets.get(ip);
  if (!bucket) {
    bucket = { tokens: maxTokens - 1, lastRefill: now };
    ipBuckets.set(ip, bucket);
    return next();
  }

  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(elapsed / refillRateMs);
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens--;
    next();
  } else {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Edge IP rate limit exceeded. Please wait 30 seconds.',
    });
  }
}

/**
 * Layer 2: Authenticated User Fairness Limiter
 * Ensures no single authenticated account exhausts the shared server capacity.
 */
export function userRateLimiter(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) return next();

  const userId = req.user.sub;
  const now = Date.now();
  const maxTokens = 60; // 60 requests/minute for heavy GitHub queries
  const refillRateMs = 60000 / maxTokens;

  let bucket = userBuckets.get(userId);
  if (!bucket) {
    bucket = { tokens: maxTokens - 1, lastRefill: now };
    userBuckets.set(userId, bucket);
    return next();
  }

  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(elapsed / refillRateMs);
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens--;
    next();
  } else {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Account rate limit exceeded. Please wait before refreshing stats.',
    });
  }
}
