import { kv } from '@vercel/kv';
import { logger } from '@/utils/logger';
import { env } from '@/lib/env';
import { CACHE_KEYS } from '@/constants';

/**
 * Check if caching is available
 */
export function isCachingEnabled(): boolean {
  return env.ENABLE_CACHING && !!env.KV_REST_API_URL && !!env.KV_REST_API_TOKEN;
}

/**
 * Generate a cache key from components
 */
export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}${parts.filter(Boolean).join(':')}`;
}

/**
 * Get a value from cache
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!isCachingEnabled()) return null;

  try {
    const cachedValue = await kv.get<T>(key);
    if (cachedValue) {
      logger.info('Cache hit for:', { key });
      return cachedValue;
    }
  } catch (error) {
    logger.warn('Cache read error:', { error, key });
  }

  return null;
}

/**
 * Store a value in cache
 */
export async function setInCache<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  if (!isCachingEnabled()) return;

  try {
    await kv.set(key, value, { ex: ttlSeconds || env.STORY_CACHE_TTL_SECONDS });
    logger.debug('Cached value for:', { key });
  } catch (error) {
    logger.warn('Cache write error:', { error, key });
  }
}

/**
 * Delete a value from cache
 */
export async function deleteFromCache(key: string): Promise<void> {
  if (!isCachingEnabled()) return;

  try {
    await kv.del(key);
    logger.debug('Deleted from cache:', { key });
  } catch (error) {
    logger.warn('Cache delete error:', { error, key });
  }
}

/**
 * Generate a story cache key
 */
export function generateStoryCacheKey(
  childName: string,
  theme: string,
  gender: string,
  interests: string[]
): string {
  const sortedInterests = interests ? [...interests].sort().join(',') : '';
  return generateCacheKey(CACHE_KEYS.STORY_PREFIX, childName, theme, gender, sortedInterests);
}
