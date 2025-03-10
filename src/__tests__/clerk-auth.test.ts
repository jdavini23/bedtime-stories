import { describe, it, expect } from 'vitest';
import { StoryGenerator } from '@/services/personalization/storyGeneration';
import { PreferencesManager } from '@/services/personalization/preferences';
import { TEST_USER_ID, TEST_PREFERENCES } from '@/utils/test-constants';
import { UserPreferences } from '@/types/user';

describe('Clerk Auth Tests', () => {
  it('should get user preferences', async () => {
    const preferencesManager = new PreferencesManager(TEST_USER_ID);
    const preferences = await preferencesManager.getUserPreferences();
    expect(preferences).toBeDefined();
  });

  it('should update user preferences', async () => {
    const preferencesManager = new PreferencesManager(TEST_USER_ID);
    const updateResult = await preferencesManager.updateUserPreferences(TEST_PREFERENCES);
    expect(updateResult).toBe(true);

    const updatedPreferences = await preferencesManager.getUserPreferences();
    expect(updatedPreferences).toEqual(TEST_PREFERENCES);
  });

  it('should increment generated stories count', async () => {
    const preferencesManager = new PreferencesManager(TEST_USER_ID);
    const initialPreferences = await preferencesManager.getUserPreferences();
    const initialCount = initialPreferences.generatedStories || 0;

    await preferencesManager.updateUserPreferences({
      ...initialPreferences,
      generatedStories: initialCount + 1,
    });

    const updatedPreferences = await preferencesManager.getUserPreferences();
    expect(updatedPreferences.generatedStories).toBe(initialCount + 1);
  });

  it('should handle undefined user ID', async () => {
    const preferencesManager = new PreferencesManager(undefined);
    const preferences = await preferencesManager.getUserPreferences();
    expect(preferences).toBeDefined();
  });
});
