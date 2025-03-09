import { Redis } from '@upstash/redis';
import { Story } from './types';
import { storyLogger } from '../../utils/logging/logUtils';

export class CacheManager {
  private redis: Redis;
  private defaultTTL: number = 60 * 60 * 24; // 24 hours

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  /**
   * Generate a cache key for a story
   * @param params Parameters to generate the cache key from
   * @returns Cache key string
   */
  generateStoryKey(params: {
    childName: string;
    interests: string[];
    theme: string;
    gender: string;
  }): string {
    const { childName, interests = [], theme, gender } = params;
    const sortedInterests = [...interests].sort().join(',');
    return `story:${childName}:${sortedInterests}:${theme}:${gender}`;
  }

  /**
   * Get a story from cache
   * @param key Cache key
   * @returns Story object or null if not found
   */
  async getStory(key: string): Promise<Story | null> {
    try {
      const story = await this.redis.get<Story>(key);
      if (story) {
        storyLogger.info('Cache hit for story', { key });
        return story;
      }
      storyLogger.info('Cache miss for story', { key });
      return null;
    } catch (error) {
      storyLogger.error('Error getting story from cache', { error, key });
      return null;
    }
  }

  /**
   * Store a story in cache
   * @param key Cache key
   * @param story Story object
   * @param ttl Time to live in seconds (optional)
   * @returns Whether the operation was successful
   */
  async setStory(key: string, story: Story, ttl?: number): Promise<boolean> {
    try {
      await this.redis.set(key, story, { ex: ttl || this.defaultTTL });
      storyLogger.info('Successfully cached story', { key, ttl: ttl || this.defaultTTL });
      return true;
    } catch (error) {
      storyLogger.error('Error caching story', { error, key });
      return false;
    }
  }

  /**
   * Delete a story from cache
   * @param key Cache key
   * @returns Whether the operation was successful
   */
  async deleteStory(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      storyLogger.info('Successfully deleted story from cache', { key });
      return true;
    } catch (error) {
      storyLogger.error('Error deleting story from cache', { error, key });
      return false;
    }
  }

  /**
   * Clear all stories from cache
   * @returns Whether the operation was successful
   */
  async clearAllStories(): Promise<boolean> {
    try {
      const keys = await this.redis.keys('story:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
        storyLogger.info('Successfully cleared all stories from cache', { count: keys.length });
      }
      return true;
    } catch (error) {
      storyLogger.error('Error clearing stories from cache', { error });
      return false;
    }
  }

  /**
   * Get multiple stories from cache
   * @param keys Array of cache keys
   * @returns Array of stories (null for missing stories)
   */
  async getStories(keys: string[]): Promise<(Story | null)[]> {
    try {
      const stories = await Promise.all(keys.map((key) => this.getStory(key)));
      storyLogger.info('Successfully retrieved multiple stories from cache', {
        total: keys.length,
        found: stories.filter(Boolean).length,
      });
      return stories;
    } catch (error) {
      storyLogger.error('Error getting multiple stories from cache', { error });
      return keys.map(() => null);
    }
  }

  /**
   * Store multiple stories in cache
   * @param entries Array of key-story pairs
   * @param ttl Time to live in seconds (optional)
   * @returns Array of success/failure for each operation
   */
  async setStories(
    entries: Array<{ key: string; story: Story }>,
    ttl?: number
  ): Promise<boolean[]> {
    try {
      const results = await Promise.all(
        entries.map(({ key, story }) => this.setStory(key, story, ttl))
      );
      storyLogger.info('Successfully cached multiple stories', {
        total: entries.length,
        successful: results.filter(Boolean).length,
      });
      return results;
    } catch (error) {
      storyLogger.error('Error caching multiple stories', { error });
      return entries.map(() => false);
    }
  }

  /**
   * Delete multiple stories from cache
   * @param keys Array of cache keys
   * @returns Array of success/failure for each operation
   */
  async deleteStories(keys: string[]): Promise<boolean[]> {
    try {
      const results = await Promise.all(keys.map((key) => this.deleteStory(key)));
      storyLogger.info('Successfully deleted multiple stories from cache', {
        total: keys.length,
        successful: results.filter(Boolean).length,
      });
      return results;
    } catch (error) {
      storyLogger.error('Error deleting multiple stories from cache', { error });
      return keys.map(() => false);
    }
  }
}
