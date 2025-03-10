import { describe, it, expect, beforeEach } from 'vitest';
import { serializeError, handleOpenAIError } from '@/utils/error-handlers';
import { generateFallbackStory } from '@/utils/fallback-generator';
import { StoryInput, ReadingLevel } from '@/types/story';

// Extract these functions from the route.ts file for testing
// This is a simplified version for testing purposes

describe('Error Handling Utilities', () => {
  describe('serializeError', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error');
      const serialized = serializeError(error);

      expect(serialized).toHaveProperty('name', 'Error');
      expect(serialized).toHaveProperty('message', 'Test error');
      expect(serialized).toHaveProperty('stack');
    });

    it('should handle Error objects with custom properties', () => {
      const error = new Error('Test error');
      (error as any).code = 'CUSTOM_ERROR';
      (error as any).details = { foo: 'bar' };
      const serialized = serializeError(error);

      expect(serialized).toHaveProperty('name', 'Error');
      expect(serialized).toHaveProperty('message', 'Test error');
      expect(serialized).toHaveProperty('code', 'CUSTOM_ERROR');
      expect(serialized).toHaveProperty('details.foo', 'bar');
    });

    it('should handle plain objects', () => {
      const error = { status: 429, message: 'Rate limit exceeded' };
      const serialized = serializeError(error);

      expect(serialized).toHaveProperty('status', 429);
      expect(serialized).toHaveProperty('message', 'Rate limit exceeded');
    });

    it('should handle empty objects', () => {
      const error = {};
      const serialized = serializeError(error);

      expect(serialized).toEqual({});
    });

    it('should handle primitive values', () => {
      const error = 'String error';
      const serialized = serializeError(error);

      expect(serialized).toHaveProperty('error', 'String error');
    });

    it('should handle null and undefined', () => {
      expect(serializeError(null)).toHaveProperty('error', 'Unknown error');
      expect(serializeError(undefined)).toHaveProperty('error', 'Unknown error');
    });
  });

  describe('handleOpenAIError', () => {
    describe('Authentication Errors', () => {
      it('should handle invalid API key errors', () => {
        const error = { status: 401, message: 'Invalid API key' };
        const result = handleOpenAIError(error);

        expect(result).toHaveProperty('error', 'OpenAI API authentication error');
        expect(result).toHaveProperty('message', 'Invalid API key or unauthorized access');
        expect(result).toHaveProperty('status', 500); // We return 500 to avoid exposing auth details
      });

      it('should handle expired API key errors', () => {
        const error = { status: 401, message: 'API key expired' };
        const result = handleOpenAIError(error);

        expect(result).toHaveProperty('error', 'OpenAI API authentication error');
        expect(result).toHaveProperty('message', 'Invalid API key or unauthorized access');
        expect(result).toHaveProperty('status', 500);
      });
    });

    describe('Rate Limiting', () => {
      it('should handle rate limit errors', () => {
        const error = { status: 429, message: 'Rate limit exceeded' };
        const result = handleOpenAIError(error);

        expect(result).toHaveProperty('error', 'OpenAI API rate limit exceeded');
        expect(result).toHaveProperty('message', 'Too many requests, please try again later');
        expect(result).toHaveProperty('status', 429);
      });

      it('should handle quota exceeded errors', () => {
        const error = { status: 429, message: 'Quota exceeded' };
        const result = handleOpenAIError(error);

        expect(result).toHaveProperty('error', 'OpenAI API rate limit exceeded');
        expect(result).toHaveProperty('message', 'Too many requests, please try again later');
        expect(result).toHaveProperty('status', 429);
      });
    });

    describe('Server Errors', () => {
      it('should handle internal server errors', () => {
        const error = { status: 500, message: 'Internal server error' };
        const result = handleOpenAIError(error);

        expect(result).toHaveProperty('error', 'OpenAI API server error');
        expect(result).toHaveProperty('message', 'The AI service is currently unavailable');
        expect(result).toHaveProperty('status', 503); // Service Unavailable
      });

      it('should handle service unavailable errors', () => {
        const error = { status: 503, message: 'Service unavailable' };
        const result = handleOpenAIError(error);

        expect(result).toHaveProperty('error', 'OpenAI API server error');
        expect(result).toHaveProperty('message', 'The AI service is currently unavailable');
        expect(result).toHaveProperty('status', 503);
      });
    });

    it('should handle unknown errors', () => {
      const error = { status: 418, message: "I'm a teapot" };
      const result = handleOpenAIError(error);

      expect(result).toHaveProperty('error', 'OpenAI API error');
      expect(result).toHaveProperty('message', "I'm a teapot");
      expect(result).toHaveProperty('status', 500);
    });
  });

  describe('generateFallbackStory', () => {
    const baseStoryInput: StoryInput = {
      childName: 'Alex',
      childAge: 7,
      theme: 'adventure',
      characters: [],
      setting: 'magical forest',
      length: 'medium',
      readingLevel: 'easy' as ReadingLevel,
    };

    it('should generate a fallback story with provided parameters', () => {
      const story = generateFallbackStory(baseStoryInput);

      expect(story.content).toContain('Alex');
      expect(story.content).toContain('adventure');
      expect(typeof story.content).toBe('string');
      expect(story.content.split(' ').length).toBeGreaterThan(50); // At least 50 words
    });

    it('should handle missing parameters gracefully', () => {
      const minimalInput: StoryInput = {
        childName: 'child',
        childAge: 5,
        theme: 'adventure',
        characters: [],
        setting: 'default',
        length: 'short',
        readingLevel: 'easy' as ReadingLevel,
      };
      const story = generateFallbackStory(minimalInput);

      expect(story.content).toContain('child');
      expect(story.content).toContain('adventure');
      expect(typeof story.content).toBe('string');
      expect(story.content.split(' ').length).toBeGreaterThan(50);
    });

    it('should handle different themes', () => {
      const mysteryInput: StoryInput = {
        ...baseStoryInput,
        theme: 'mystery',
      };
      const fantasyInput: StoryInput = {
        ...baseStoryInput,
        theme: 'fantasy',
      };

      const mysteryStory = generateFallbackStory(mysteryInput);
      const fantasyStory = generateFallbackStory(fantasyInput);

      expect(mysteryStory.content).toContain('mystery');
      expect(fantasyStory.content).toContain('fantasy');
    });

    it('should sanitize input parameters', () => {
      const unsafeInput: StoryInput = {
        ...baseStoryInput,
        childName: '<script>alert("xss")</script>',
      };
      const story = generateFallbackStory(unsafeInput);

      expect(story.content).not.toContain('<script>');
      expect(story.content).toContain('adventure');
    });
  });
});
