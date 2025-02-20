import { describe, it, expect } from 'vitest';
import { ServerUserPersonalizationEngine } from '@/services/serverPersonalizationEngine';

describe('Clerk Authentication and Personalization', () => {
  // This is a mock user ID - replace with a real test user from your Clerk instance
  const TEST_USER_ID = 'user_123';

  it('should fetch user preferences', async () => {
    const personalizationEngine = new ServerUserPersonalizationEngine(TEST_USER_ID);
    const preferences = await personalizationEngine.getUserPreferences();

    expect(preferences).toBeDefined();
    expect(preferences).toHaveProperty('preferredThemes');
    expect(preferences).toHaveProperty('mostLikedCharacterTypes');
    expect(preferences).toHaveProperty('generatedStories');
  });

  it('should update user preferences', async () => {
    const personalizationEngine = new ServerUserPersonalizationEngine(TEST_USER_ID);
    const testPreferences = {
      preferredThemes: ['adventure', 'fantasy'],
      mostLikedCharacterTypes: ['brave', 'curious'],
      generatedStories: 5,
    };

    const updateResult = await personalizationEngine.updateUserPreferences(testPreferences);
    expect(updateResult).toBe(true);

    const updatedPreferences = await personalizationEngine.getUserPreferences();
    expect(updatedPreferences).toMatchObject(testPreferences);
  });

  it('should increment generated stories', async () => {
    const personalizationEngine = new ServerUserPersonalizationEngine(TEST_USER_ID);
    const initialPreferences = await personalizationEngine.getUserPreferences();
    const initialStoriesCount = initialPreferences.generatedStories || 0;

    await personalizationEngine.incrementGeneratedStories();

    const updatedPreferences = await personalizationEngine.getUserPreferences();
    expect(updatedPreferences.generatedStories).toBe(initialStoriesCount + 1);
  });

  it('should handle user without preferences', async () => {
    const personalizationEngine = new ServerUserPersonalizationEngine(undefined);
    const preferences = await personalizationEngine.getUserPreferences();
    expect(preferences).toBeDefined();
    expect(preferences).toHaveProperty('preferredThemes');
    expect(preferences).toHaveProperty('mostLikedCharacterTypes');
    expect(preferences).toHaveProperty('generatedStories');
  });
});
