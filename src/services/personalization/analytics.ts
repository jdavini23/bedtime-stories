import { Redis } from '@upstash/redis';
import { StoryInput, StoryTheme } from '../../types/story';
import { Story, UserPreferencesLocal } from './types';
import { personalizationLogger } from '../../utils/logging/logUtils';

// Define available themes (should match StoryTheme enum)
const AVAILABLE_THEMES = [
  'adventure',
  'fantasy',
  'science',
  'nature',
  'friendship',
  'educational',
  'courage',
  'kindness',
  'curiosity',
  'creativity',
] as const;

export class AnalyticsManager {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  /**
   * Track story generation event
   * @param userId User ID
   * @param story Generated story
   * @param input Story input parameters
   * @param duration Generation duration in ms
   * @param isFallback Whether fallback generation was used
   */
  async trackStoryGeneration(
    userId: string | undefined,
    story: Story,
    input: StoryInput,
    duration: number,
    isFallback: boolean
  ): Promise<void> {
    try {
      const event = {
        eventType: 'story_generation',
        userId: userId || 'anonymous',
        storyId: story.id,
        theme: input.theme,
        childName: input.childName,
        // Remove gender and interests since they don't exist on StoryInput type
        wordCount: story.metadata.wordCount,
        readingTime: story.metadata.readingTime,
        isFallback,
        duration,
        timestamp: new Date().toISOString(),
      };

      await this.redis.lpush('analytics:story_generations', JSON.stringify(event));
      personalizationLogger.info('Tracked story generation event', { event });
    } catch (error) {
      personalizationLogger.error('Error tracking story generation', { error });
    }
  }

  /**
   * Track theme usage
   * @param theme Story theme
   * @param userId User ID
   */
  async trackThemeUsage(theme: StoryTheme, userId: string | undefined): Promise<void> {
    try {
      const key = `analytics:theme_usage:${theme}`;
      await this.redis.hincrby(key, userId || 'anonymous', 1);
      personalizationLogger.info('Tracked theme usage', { theme, userId });
    } catch (error) {
      personalizationLogger.error('Error tracking theme usage', { error });
    }
  }

  /**
   * Track user preferences update
   * @param userId User ID
   * @param preferences Updated preferences
   * @param changedFields Array of changed field names
   */
  async trackPreferencesUpdate(
    userId: string,
    preferences: UserPreferencesLocal,
    changedFields: string[]
  ): Promise<void> {
    try {
      const event = {
        eventType: 'preferences_update',
        userId,
        changedFields,
        timestamp: new Date().toISOString(),
      };

      await this.redis.lpush('analytics:preferences_updates', JSON.stringify(event));
      personalizationLogger.info('Tracked preferences update', { event });
    } catch (error) {
      personalizationLogger.error('Error tracking preferences update', { error });
    }
  }

  /**
   * Track story generation error
   * @param userId User ID
   * @param error Error object or message
   * @param input Story input parameters
   */
  async trackGenerationError(
    userId: string | undefined,
    error: Error | string,
    input: StoryInput
  ): Promise<void> {
    try {
      const event = {
        eventType: 'generation_error',
        userId: userId || 'anonymous',
        error: error instanceof Error ? error.message : error,
        theme: input.theme,
        timestamp: new Date().toISOString(),
      };

      await this.redis.lpush('analytics:generation_errors', JSON.stringify(event));
      personalizationLogger.error('Tracked generation error', { event });
    } catch (error) {
      personalizationLogger.error('Error tracking generation error', { error });
    }
  }

  /**
   * Get theme usage statistics
   * @returns Object with theme usage counts
   */
  async getThemeUsageStats(): Promise<Record<StoryTheme, number>> {
    try {
      const stats: Partial<Record<StoryTheme, number>> = {};

      await Promise.all(
        AVAILABLE_THEMES.map(async (theme) => {
          const key = `analytics:theme_usage:${theme}`;
          const usageData = await this.redis.hgetall<Record<string, string>>(key);
          if (usageData) {
            stats[theme] = Object.values(usageData).reduce(
              (sum, count) => sum + parseInt(count, 10),
              0
            );
          } else {
            stats[theme] = 0;
          }
        })
      );

      personalizationLogger.info('Retrieved theme usage stats', { stats });
      return stats as Record<StoryTheme, number>;
    } catch (error) {
      personalizationLogger.error('Error getting theme usage stats', { error });
      return {} as Record<StoryTheme, number>;
    }
  }

  /**
   * Get generation error statistics
   * @param timeframe Timeframe in hours (default: 24)
   * @returns Array of error events
   */
  async getErrorStats(timeframe: number = 24): Promise<any[]> {
    try {
      const errors = await this.redis.lrange('analytics:generation_errors', 0, -1);
      const cutoff = new Date(Date.now() - timeframe * 60 * 60 * 1000);

      const recentErrors = errors
        .map((error) => JSON.parse(error))
        .filter((event) => new Date(event.timestamp) > cutoff);

      personalizationLogger.info('Retrieved error stats', {
        total: recentErrors.length,
        timeframe,
      });
      return recentErrors;
    } catch (error) {
      personalizationLogger.error('Error getting error stats', { error });
      return [];
    }
  }

  /**
   * Get story generation statistics
   * @param timeframe Timeframe in hours (default: 24)
   * @returns Object with generation statistics
   */
  async getGenerationStats(timeframe: number = 24): Promise<{
    total: number;
    fallbackCount: number;
    averageDuration: number;
    averageWordCount: number;
  }> {
    try {
      const generations = await this.redis.lrange('analytics:story_generations', 0, -1);
      const cutoff = new Date(Date.now() - timeframe * 60 * 60 * 1000);

      const recentGenerations = generations
        .map((gen) => JSON.parse(gen))
        .filter((event) => new Date(event.timestamp) > cutoff);

      const stats = {
        total: recentGenerations.length,
        fallbackCount: recentGenerations.filter((event) => event.isFallback).length,
        averageDuration:
          recentGenerations.reduce((sum, event) => sum + event.duration, 0) /
          recentGenerations.length,
        averageWordCount:
          recentGenerations.reduce((sum, event) => sum + (event.wordCount || 0), 0) /
          recentGenerations.length,
      };

      personalizationLogger.info('Retrieved generation stats', { stats, timeframe });
      return stats;
    } catch (error) {
      personalizationLogger.error('Error getting generation stats', { error });
      return {
        total: 0,
        fallbackCount: 0,
        averageDuration: 0,
        averageWordCount: 0,
      };
    }
  }
}
