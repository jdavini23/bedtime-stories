import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsManager } from '@/services/personalization/analytics';
import { Story, UserPreferencesLocal } from '@/services/personalization/types';
import { StoryInput, StoryTheme } from '@/types/story';

// Mock Redis
const mockRedis = {
  lpush: vi.fn(),
  hincrby: vi.fn(),
  hgetall: vi.fn(),
  lrange: vi.fn(),
};

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => mockRedis),
}));

describe('Analytics Module', () => {
  let analyticsManager: AnalyticsManager;
  const mockUserId = 'test-user-123';
  const mockStory: Story = {
    id: 'test-story-1',
    title: 'Test Story',
    content: 'Once upon a time...',
    theme: 'adventure',
    createdAt: new Date().toISOString(),
    input: {
      childName: 'Test Child',
      theme: 'adventure',
      gender: 'neutral',
      interests: [],
    },
    metadata: {
      pronouns: 'they/them',
      possessivePronouns: 'their',
      generatedAt: new Date().toISOString(),
      wordCount: 100,
      readingTime: 5,
    },
    pronouns: 'they/them',
    possessivePronouns: 'their',
    generatedAt: new Date().toISOString(),
  };

  const mockInput: StoryInput = {
    childName: 'Test Child',
    theme: 'adventure',
    gender: 'neutral',
    interests: ['space', 'animals'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    analyticsManager = new AnalyticsManager();
  });

  describe('trackStoryGeneration', () => {
    it('should track story generation event', async () => {
      mockRedis.lpush.mockResolvedValue(1);

      await analyticsManager.trackStoryGeneration(mockUserId, mockStory, mockInput, 1000, false);

      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'analytics:story_generations',
        expect.stringContaining('"eventType":"story_generation"')
      );
      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'analytics:story_generations',
        expect.stringContaining('"userId":"test-user-123"')
      );
    });

    it('should handle anonymous users', async () => {
      mockRedis.lpush.mockResolvedValue(1);

      await analyticsManager.trackStoryGeneration(undefined, mockStory, mockInput, 1000, false);

      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'analytics:story_generations',
        expect.stringContaining('"userId":"anonymous"')
      );
    });
  });

  describe('trackThemeUsage', () => {
    it('should track theme usage', async () => {
      mockRedis.hincrby.mockResolvedValue(1);

      await analyticsManager.trackThemeUsage('adventure', mockUserId);

      expect(mockRedis.hincrby).toHaveBeenCalledWith(
        'analytics:theme_usage:adventure',
        mockUserId,
        1
      );
    });

    it('should handle anonymous users', async () => {
      mockRedis.hincrby.mockResolvedValue(1);

      await analyticsManager.trackThemeUsage('adventure', undefined);

      expect(mockRedis.hincrby).toHaveBeenCalledWith(
        'analytics:theme_usage:adventure',
        'anonymous',
        1
      );
    });
  });

  describe('trackPreferencesUpdate', () => {
    it('should track preferences update', async () => {
      mockRedis.lpush.mockResolvedValue(1);

      const preferences: UserPreferencesLocal = {
        userId: mockUserId,
        preferredThemes: ['fantasy', 'science'],
        generatedStoryCount: 0,
        learningInterests: [],
        ageGroup: '6-8',
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          frequency: 'weekly',
        },
      };

      await analyticsManager.trackPreferencesUpdate(mockUserId, preferences, [
        'preferredThemes',
        'ageGroup',
      ]);

      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'analytics:preferences_updates',
        expect.stringContaining('"eventType":"preferences_update"')
      );
      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'analytics:preferences_updates',
        expect.stringContaining('"changedFields":["preferredThemes","ageGroup"]')
      );
    });
  });

  describe('trackGenerationError', () => {
    it('should track generation error with Error object', async () => {
      mockRedis.lpush.mockResolvedValue(1);

      const error = new Error('Test error');
      await analyticsManager.trackGenerationError(mockUserId, error, mockInput);

      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'analytics:generation_errors',
        expect.stringContaining('"eventType":"generation_error"')
      );
      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'analytics:generation_errors',
        expect.stringContaining('"error":"Test error"')
      );
    });

    it('should track generation error with string message', async () => {
      mockRedis.lpush.mockResolvedValue(1);

      await analyticsManager.trackGenerationError(mockUserId, 'Test error', mockInput);

      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'analytics:generation_errors',
        expect.stringContaining('"error":"Test error"')
      );
    });
  });

  describe('getThemeUsageStats', () => {
    it('should return theme usage statistics', async () => {
      mockRedis.hgetall.mockImplementation((key: string) => {
        if (key === 'analytics:theme_usage:adventure') {
          return { 'user-1': '2', 'user-2': '3' };
        }
        return null;
      });

      const stats = await analyticsManager.getThemeUsageStats();

      expect(stats.adventure).toBe(5);
      expect(stats.fantasy).toBe(0);
    });

    it('should handle Redis errors', async () => {
      mockRedis.hgetall.mockRejectedValue(new Error('Redis error'));

      const stats = await analyticsManager.getThemeUsageStats();

      expect(stats).toEqual({});
    });
  });

  describe('getErrorStats', () => {
    it('should return error statistics within timeframe', async () => {
      const mockErrors = [
        { eventType: 'generation_error', timestamp: new Date().toISOString() },
        { eventType: 'generation_error', timestamp: new Date().toISOString() },
      ];

      mockRedis.lrange.mockResolvedValue(mockErrors.map((e) => JSON.stringify(e)));

      const errors = await analyticsManager.getErrorStats(24);

      expect(errors).toHaveLength(2);
      expect(errors[0].eventType).toBe('generation_error');
    });

    it('should handle Redis errors', async () => {
      mockRedis.lrange.mockRejectedValue(new Error('Redis error'));

      const errors = await analyticsManager.getErrorStats(24);

      expect(errors).toEqual([]);
    });
  });

  describe('getGenerationStats', () => {
    it('should return generation statistics within timeframe', async () => {
      const mockGenerations = [
        {
          eventType: 'story_generation',
          timestamp: new Date().toISOString(),
          duration: 1000,
          wordCount: 100,
          isFallback: false,
        },
        {
          eventType: 'story_generation',
          timestamp: new Date().toISOString(),
          duration: 2000,
          wordCount: 200,
          isFallback: true,
        },
      ];

      mockRedis.lrange.mockResolvedValue(mockGenerations.map((g) => JSON.stringify(g)));

      const stats = await analyticsManager.getGenerationStats(24);

      expect(stats.total).toBe(2);
      expect(stats.fallbackCount).toBe(1);
      expect(stats.averageDuration).toBe(1500);
      expect(stats.averageWordCount).toBe(150);
    });

    it('should handle Redis errors', async () => {
      mockRedis.lrange.mockRejectedValue(new Error('Redis error'));

      const stats = await analyticsManager.getGenerationStats(24);

      expect(stats).toEqual({
        total: 0,
        fallbackCount: 0,
        averageDuration: 0,
        averageWordCount: 0,
      });
    });
  });
});
