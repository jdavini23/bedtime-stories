import { describe, it, expect } from 'vitest';
import { serializeError, handleOpenAIError, generateFallbackStory } from '@/utils/error-handlers';

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
  });

  describe('handleOpenAIError', () => {
    it('should handle authentication errors', () => {
      const error = { status: 401, message: 'Invalid API key' };
      const result = handleOpenAIError(error);

      expect(result).toHaveProperty('error', 'OpenAI API authentication error');
      expect(result).toHaveProperty('message', 'Invalid API key or unauthorized access');
      expect(result).toHaveProperty('status', 500); // We return 500 to avoid exposing auth details
    });

    it('should handle rate limit errors', () => {
      const error = { status: 429, message: 'Rate limit exceeded' };
      const result = handleOpenAIError(error);

      expect(result).toHaveProperty('error', 'OpenAI API rate limit exceeded');
      expect(result).toHaveProperty('message', 'Too many requests, please try again later');
      expect(result).toHaveProperty('status', 429);
    });

    it('should handle server errors', () => {
      const error = { status: 500, message: 'Internal server error' };
      const result = handleOpenAIError(error);

      expect(result).toHaveProperty('error', 'OpenAI API server error');
      expect(result).toHaveProperty('message', 'The AI service is currently unavailable');
      expect(result).toHaveProperty('status', 503); // Service Unavailable
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
    it('should generate a fallback story with provided parameters', () => {
      const params = { childName: 'Alex', theme: 'adventure' };
      const story = generateFallbackStory(params);

      expect(story).toContain('Alex');
      expect(story).toContain('adventure');
      expect(story.length).toBeGreaterThan(100);
    });

    it('should handle missing parameters gracefully', () => {
      const params = {};
      const story = generateFallbackStory(params);

      expect(story).toContain('child'); // Default name
      expect(story).toContain('adventure'); // Default theme
      expect(story.length).toBeGreaterThan(100);
    });
  });
});
