export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class InMemoryCacheService implements ICacheService {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  public async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  public async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  public async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

export const defaultCacheService = new InMemoryCacheService();
