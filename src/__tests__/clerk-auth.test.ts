import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StoryGenerator } from '@/services/personalization/storyGeneration';
import { PreferencesManager } from '@/services/personalization/preferences';
import { TEST_USER_ID, TEST_PREFERENCES } from '@/utils/test-constants';
import { UserPreferencesLocal } from '@/services/personalization/types';

describe('Clerk Auth Tests', () => {
  let preferencesManager: PreferencesManager;

  beforeEach(() => {
    preferencesManager = new PreferencesManager(TEST_USER_ID);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('User Preferences', () => {
    it('should get user preferences', async () => {
      const preferences = await preferencesManager.getUserPreferences();
      expect(preferences).toBeDefined();
      expect(preferences).toHaveProperty('theme');
      expect(preferences).toHaveProperty('generatedStories');
    });

    it('should update user preferences', async () => {
      const updateResult = await preferencesManager.updateUserPreferences(TEST_PREFERENCES);
      expect(updateResult).toBe(true);

      const updatedPreferences = await preferencesManager.getUserPreferences();
      expect(updatedPreferences).toEqual(TEST_PREFERENCES);
    });

    it('should merge existing preferences with updates', async () => {
      const initialPreferences = await preferencesManager.getUserPreferences();
      const partialUpdate: Partial<UserPreferencesLocal> = { theme: 'dark' };

      await preferencesManager.updateUserPreferences(partialUpdate);

      const updatedPreferences = await preferencesManager.getUserPreferences();
      expect(updatedPreferences).toEqual({
        ...initialPreferences,
        ...partialUpdate,
      });
    });

    it('should handle empty preference updates', async () => {
      const initialPreferences = await preferencesManager.getUserPreferences();
      const updateResult = await preferencesManager.updateUserPreferences({});

      expect(updateResult).toBe(true);
      const updatedPreferences = await preferencesManager.getUserPreferences();
      expect(updatedPreferences).toEqual(initialPreferences);
    });
  });

  describe('Story Generation Tracking', () => {
    it('should increment generated stories count', async () => {
      const initialPreferences = await preferencesManager.getUserPreferences();
      const initialCount = initialPreferences.generatedStories || 0;

      await preferencesManager.updateUserPreferences({
        ...initialPreferences,
        generatedStories: initialCount + 1,
      });

      const updatedPreferences = await preferencesManager.getUserPreferences();
      expect(updatedPreferences.generatedStories).toBe(initialCount + 1);
    });

    it('should handle multiple story generation increments', async () => {
      const initialPreferences = await preferencesManager.getUserPreferences();
      const initialCount = initialPreferences.generatedStories || 0;

      // Increment multiple times
      for (let i = 0; i < 3; i++) {
        await preferencesManager.updateUserPreferences({
          ...initialPreferences,
          generatedStories: initialCount + i + 1,
        });
      }

      const finalPreferences = await preferencesManager.getUserPreferences();
      expect(finalPreferences.generatedStories).toBe(initialCount + 3);
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined user ID', async () => {
      const undefinedManager = new PreferencesManager(undefined);
      const preferences = await undefinedManager.getUserPreferences();
      expect(preferences).toBeDefined();
      expect(preferences).toEqual(
        expect.objectContaining({
          theme: expect.any(String),
          generatedStories: expect.any(Number),
        })
      );
    });

    it('should handle invalid preference updates', async () => {
      const invalidUpdate = { invalidKey: 'value' } as any;
      await expect(preferencesManager.updateUserPreferences(invalidUpdate)).rejects.toThrow();
    });

    it('should handle network errors gracefully', async () => {
      // Mock a network error
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      await expect(preferencesManager.getUserPreferences()).rejects.toThrow('Network error');
    });
  });
});
