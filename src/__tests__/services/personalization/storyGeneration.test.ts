import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StoryGenerator } from '@/services/personalization/storyGeneration';
import { StoryInput } from '@/types/story';
import { UserPreferencesLocal } from '@/services/personalization/types';

// Create mock Redis instance
const createMockRedis = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
}));

// Mock Redis
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => createMockRedis),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock logger
vi.mock('@/utils/logging/logUtils', () => ({
  storyLogger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock env
vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'test',
    ENABLE_MOCK_STORIES: true,
    ENABLE_CACHING: true,
  },
  isTest: () => true,
}));

// Mock PreferencesManager
vi.mock('@/services/personalization/preferences', () => ({
  PreferencesManager: vi.fn().mockImplementation(() => ({
    getUserPreferences: vi.fn().mockResolvedValue({
      ageGroup: '6-8',
      learningInterests: ['science', 'nature'],
    }),
    incrementStoryCount: vi.fn().mockResolvedValue(true),
  })),
}));

// Mock fallback generator
vi.mock('@/utils/fallback-generator', () => ({
  generateFallbackStory: vi.fn().mockReturnValue('# Fallback Story\nThis is a fallback story.'),
}));

// Mock circuit breaker
vi.mock('@/utils/error-handlers', () => ({
  geminiCircuitBreaker: {
    fire: vi.fn().mockImplementation((fn) => fn()),
  },
}));

describe('StoryGeneration Module', () => {
  let storyGenerator: StoryGenerator;
  const mockUserId = 'test-user-123';
  const mockInput: StoryInput = {
    childName: 'Test Child',
    theme: 'adventure',
    gender: 'neutral' as const,
    interests: ['space', 'animals'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    storyGenerator = new StoryGenerator(mockUserId);
  });

  describe('generatePersonalizedStory', () => {
    it('should return cached story if available', async () => {
      const cachedStory = `# Test Story Title\nOnce upon a time...`;
      createMockRedis.get.mockResolvedValue(cachedStory);

      const story = await storyGenerator.generatePersonalizedStory(mockInput);

      expect(story.title).toBe('Test Story Title');
      expect(story.content).toBe('Once upon a time...');
      expect(story.theme).toBe(mockInput.theme);
      expect(story.metadata.userId).toBe(mockUserId);
      expect(story.metadata.pronouns).toBe('they');
      expect(story.metadata.possessivePronouns).toBe('them');
    });

    it('should generate new story if no cache exists', async () => {
      createMockRedis.get.mockResolvedValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            content: '# New Story\nThis is a new story...',
            model: 'gemini',
          }),
      });

      const story = await storyGenerator.generatePersonalizedStory(mockInput);

      expect(story.title).toBe('New Story');
      expect(story.content).toBe('This is a new story...');
      expect(createMockRedis.set).toHaveBeenCalled();
    });

    it('should handle female gender pronouns', async () => {
      createMockRedis.get.mockResolvedValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            content: '# Story\nContent...',
            model: 'gemini',
          }),
      });

      const input = { ...mockInput, gender: 'female' as const };
      const story = await storyGenerator.generatePersonalizedStory(input);

      expect(story.pronouns).toBe('she');
      expect(story.possessivePronouns).toBe('her');
    });

    it('should handle male gender pronouns', async () => {
      createMockRedis.get.mockResolvedValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            content: '# Story\nContent...',
            model: 'gemini',
          }),
      });

      const input = { ...mockInput, gender: 'male' as const };
      const story = await storyGenerator.generatePersonalizedStory(input);

      expect(story.pronouns).toBe('he');
      expect(story.possessivePronouns).toBe('him');
    });

    it('should include user preferences in story generation', async () => {
      createMockRedis.get.mockResolvedValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            content: '# Story\nContent...',
            model: 'gemini',
          }),
      });

      const userPrefs: UserPreferencesLocal = {
        userId: mockUserId,
        preferredThemes: ['fantasy', 'science'],
        generatedStoryCount: 0,
        learningInterests: ['astronomy', 'biology'],
        ageGroup: '9-12',
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          frequency: 'weekly',
        },
      };

      await storyGenerator.generatePersonalizedStory(mockInput, userPrefs);

      expect(mockFetch).toHaveBeenCalledWith('/api/gemini', expect.any(Object));
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.prompt).toContain('astronomy');
      expect(requestBody.prompt).toContain('biology');
    });

    it('should handle API errors', async () => {
      createMockRedis.get.mockResolvedValue(null);
      mockFetch.mockRejectedValue(new Error('API Error'));

      await expect(storyGenerator.generatePersonalizedStory(mockInput)).rejects.toThrow(
        'API Error'
      );
    });

    it('should calculate word count and reading time', async () => {
      createMockRedis.get.mockResolvedValue(null);
      const content = '# Test Story\n' + 'word '.repeat(400);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            content,
            model: 'gemini',
          }),
      });

      const story = await storyGenerator.generatePersonalizedStory(mockInput);

      expect(story.content.split(' ').length).toBe(400);
      expect(Math.ceil(story.content.split(' ').length / 200)).toBe(2); // 400 words / 200 words per minute = 2 minutes
    });

    it('should handle missing title in generated content', async () => {
      createMockRedis.get.mockResolvedValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            content: 'Story without title\nContent...',
            model: 'gemini',
          }),
      });

      const story = await storyGenerator.generatePersonalizedStory(mockInput);

      expect(story.title).toBe('Untitled Story');
      expect(story.content).toBe('Story without title\nContent...');
    });
  });
});
