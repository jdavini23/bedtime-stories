import { describe, it, expect, vi } from 'vitest';
import { clerkClient } from '@clerk/nextjs/server';
import { StoryPersonalizationEngine } from '@/services/personalizationEngine';

describe('Clerk Authentication and Personalization', () => {
  // This is a mock user ID - replace with a real test user from your Clerk instance
  const TEST_USER_ID = 'user_123'; 

  it('should fetch user preferences', async () => {
    const personalizationEngine = new StoryPersonalizationEngine(TEST_USER_ID);
    const preferences = await personalizationEngine.getUserPreferences();
    
    expect(preferences).toBeDefined();
    expect(preferences).toHaveProperty('themes');
    expect(preferences).toHaveProperty('interests');
    expect(preferences).toHaveProperty('generatedStories');
  });

  it('should update user preferences', async () => {
    const personalizationEngine = new StoryPersonalizationEngine(TEST_USER_ID);
    const testPreferences = {
      themes: ['adventure', 'fantasy'],
      interests: ['space', 'dinosaurs'],
      generatedStories: 5
    };

    const updateResult = await personalizationEngine.updateUserPreferences(testPreferences);
    expect(updateResult).toBe(true);

    const updatedPreferences = await personalizationEngine.getUserPreferences();
    expect(updatedPreferences).toMatchObject(testPreferences);
  });

  it('should increment generated stories', async () => {
    const personalizationEngine = new StoryPersonalizationEngine(TEST_USER_ID);
    const initialPreferences = await personalizationEngine.getUserPreferences();
    const initialStoriesCount = initialPreferences.generatedStories || 0;

    await personalizationEngine.incrementGeneratedStories();

    const updatedPreferences = await personalizationEngine.getUserPreferences();
    expect(updatedPreferences.generatedStories).toBe(initialStoriesCount + 1);
  });

  it('should handle user without preferences', async () => {
    const personalizationEngine = new StoryPersonalizationEngine(null);
    const preferences = await personalizationEngine.getUserPreferences();
    
    expect(preferences).toBeDefined();
    expect(preferences).toHaveProperty('themes', []);
    expect(preferences).toHaveProperty('interests', []);
    expect(preferences).toHaveProperty('generatedStories', 0);
  });
});
