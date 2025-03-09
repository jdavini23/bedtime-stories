import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CacheManager } from '@/services/personalization/cache';
import { Story } from '@/services/personalization/types';

// Mock Redis
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  keys: vi.fn(),
};

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => mockRedis),
}));

describe('Cache Module', () => {
  let cacheManager: CacheManager;
  const mockStory: Story = {
    id: 'test-story-1',
    title: 'Test Story',
    content: 'Once upon a time...',
    theme: 'adventure',
    createdAt: new Date().toISOString(),
    input: {
      childName: 'Test Child',
      theme: 'adventure',
      childAge: 5,
      characters: ['dragon', 'knight'],
      setting: 'castle',
      length: 'medium',
      readingLevel: 'beginner',
    },
    metadata: {
      pronouns: 'they/them',
      possessivePronouns: 'their',
      generatedAt: new Date().toISOString(),
    },
    pronouns: 'they/them',
    possessivePronouns: 'their',
    generatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cacheManager = new CacheManager();
  });

  describe('generateStoryKey', () => {
    it('should generate a valid cache key', () => {
      const params = {
        childName: 'John',
        interests: ['space', 'animals'],
        theme: 'adventure',
        gender: 'male',
      };

      const key = cacheManager.generateStoryKey(params);
      expect(key).toBe('story:John:animals,space:adventure:male');
    });

    it('should handle empty interests array', () => {
      const params = {
        childName: 'John',
        interests: [],
        theme: 'adventure',
        gender: 'male',
      };

      const key = cacheManager.generateStoryKey(params);
      expect(key).toBe('story:John::adventure:male');
    });
  });

  describe('getStory', () => {
    it('should return story from cache if exists', async () => {
      mockRedis.get.mockResolvedValue(mockStory);
      const story = await cacheManager.getStory('test-key');
      expect(story).toEqual(mockStory);
      expect(mockRedis.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null if story not found', async () => {
      mockRedis.get.mockResolvedValue(null);
      const story = await cacheManager.getStory('test-key');
      expect(story).toBeNull();
    });

    it('should return null on error', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis error'));
      const story = await cacheManager.getStory('test-key');
      expect(story).toBeNull();
    });
  });

  describe('setStory', () => {
    it('should store story in cache successfully', async () => {
      mockRedis.set.mockResolvedValue('OK');
      const result = await cacheManager.setStory('test-key', mockStory);
      expect(result).toBe(true);
      expect(mockRedis.set).toHaveBeenCalledWith('test-key', mockStory, { ex: 24 * 60 * 60 });
    });

    it('should store story with custom TTL', async () => {
      mockRedis.set.mockResolvedValue('OK');
      const customTTL = 3600;
      const result = await cacheManager.setStory('test-key', mockStory, customTTL);
      expect(result).toBe(true);
      expect(mockRedis.set).toHaveBeenCalledWith('test-key', mockStory, { ex: customTTL });
    });

    it('should return false on error', async () => {
      mockRedis.set.mockRejectedValue(new Error('Redis error'));
      const result = await cacheManager.setStory('test-key', mockStory);
      expect(result).toBe(false);
    });
  });

  describe('deleteStory', () => {
    it('should delete story from cache successfully', async () => {
      mockRedis.del.mockResolvedValue(1);
      const result = await cacheManager.deleteStory('test-key');
      expect(result).toBe(true);
      expect(mockRedis.del).toHaveBeenCalledWith('test-key');
    });

    it('should return false on error', async () => {
      mockRedis.del.mockRejectedValue(new Error('Redis error'));
      const result = await cacheManager.deleteStory('test-key');
      expect(result).toBe(false);
    });
  });

  describe('clearAllStories', () => {
    it('should clear all stories from cache successfully', async () => {
      mockRedis.keys.mockResolvedValue(['key1', 'key2']);
      mockRedis.del.mockResolvedValue(2);
      const result = await cacheManager.clearAllStories();
      expect(result).toBe(true);
      expect(mockRedis.keys).toHaveBeenCalledWith('story:*');
      expect(mockRedis.del).toHaveBeenCalledWith('key1', 'key2');
    });

    it('should handle empty cache', async () => {
      mockRedis.keys.mockResolvedValue([]);
      const result = await cacheManager.clearAllStories();
      expect(result).toBe(true);
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it('should return false on error', async () => {
      mockRedis.keys.mockRejectedValue(new Error('Redis error'));
      const result = await cacheManager.clearAllStories();
      expect(result).toBe(false);
    });
  });

  describe('getStories', () => {
    it('should get multiple stories from cache', async () => {
      const mockStory2 = { ...mockStory, id: 'test-story-2' };
      mockRedis.get.mockImplementation((key: string) => {
        return key === 'key1' ? mockStory : mockStory2;
      });

      const stories = await cacheManager.getStories(['key1', 'key2']);
      expect(stories).toEqual([mockStory, mockStory2]);
      expect(mockRedis.get).toHaveBeenCalledTimes(2);
    });

    it('should handle missing stories', async () => {
      mockRedis.get.mockImplementation((key: string) => {
        return key === 'key1' ? mockStory : null;
      });

      const stories = await cacheManager.getStories(['key1', 'key2']);
      expect(stories).toEqual([mockStory, null]);
    });
  });

  describe('setStories', () => {
    it('should store multiple stories in cache', async () => {
      mockRedis.set.mockResolvedValue('OK');
      const entries = [
        { key: 'key1', story: mockStory },
        { key: 'key2', story: { ...mockStory, id: 'test-story-2' } },
      ];

      const results = await cacheManager.setStories(entries);
      expect(results).toEqual([true, true]);
      expect(mockRedis.set).toHaveBeenCalledTimes(2);
    });

    it('should handle partial failures', async () => {
      mockRedis.set.mockImplementation((key: string) => {
        return key === 'key1' ? Promise.resolve('OK') : Promise.reject(new Error('Redis error'));
      });

      const entries = [
        { key: 'key1', story: mockStory },
        { key: 'key2', story: { ...mockStory, id: 'test-story-2' } },
      ];

      const results = await cacheManager.setStories(entries);
      expect(results).toEqual([true, false]);
    });
  });
});
