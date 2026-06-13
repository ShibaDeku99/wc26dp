// ============================================
// World Cup 2026 - Cache Service
// In-memory cache with Redis-ready architecture
// To enable Redis: npm install ioredis, then
// uncomment the Redis sections below
// ============================================

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

// In-memory cache store
const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Get cached value by key
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Set cache value with TTL in seconds
 */
export async function setCache<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Get from cache or fetch and cache the result
 * This is the main function to use for cache-aside pattern
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fetcher();
  await setCache(key, data, ttlSeconds);
  return data;
}

/**
 * Clear a specific cache key
 */
export async function clearCache(key: string): Promise<void> {
  memoryCache.delete(key);
}

/**
 * Get cache status for health check
 */
export function getCacheStatus(): string {
  return 'memory';
}

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  GROUPS: 24 * 60 * 60,        // 24 hours
  TEAMS: 24 * 60 * 60,         // 24 hours
  FIXTURES: 15 * 60,           // 15 minutes
  STANDINGS: 10 * 60,          // 10 minutes
  MATCH_DETAIL: 3 * 60,        // 3 minutes
  TODAY: 5 * 60,               // 5 minutes
} as const;
