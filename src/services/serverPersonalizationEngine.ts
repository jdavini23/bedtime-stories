import { clerkClient } from '@clerk/nextjs/server';
import { UserPersonalizationEngine as BaseUserPersonalizationEngine, DEFAULT_PREFERENCES } from './personalizationEngine';
import { Story, StoryInput } from '@/types/story';
import { generateStory } from '@/lib/storyGenerator';
import { logger } from '@/utils/logger';

export class ServerUserPersonalizationEngine extends BaseUserPersonalizationEngine {
  // Method to set user ID
  protected setUserId(userId: string | null | null | null | null | null) {
    super.setUserId(userId);
  }

  // Server-side method to get user preferences
  async getUserPreferences() {
    const userId = this.getUserId();
    if (!userId) {
      return DEFAULT_PREFERENCES;
    }

    try {
      const user = await clerkClient.users.getUser(userId);

      // Extract preferences from Clerk's publicMetadata
      const preferences = user.publicMetadata?.preferences || DEFAULT_PREFERENCES;

      return {
        preferredThemes: preferences.preferredThemes || DEFAULT_PREFERENCES.preferredThemes,
        mostLikedCharacterTypes: preferences.mostLikedCharacterTypes || [],
        generatedStories: preferences.generatedStories || 0,
      };
    } catch (error) {
      logger.error('Failed to fetch user preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  // Server-side method to update user preferences
  async updateUserPreferences(newPreferences: Record<string, unknown>) {
    const userId = this.getUserId();
    if (!userId) {
      return false;
    }

    try {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          preferences: {
            ...newPreferences,
            generatedStories: newPreferences.generatedStories || 0,
          },
        },
      });
      return true;
    } catch (error) {
      logger.error('Failed to update user preferences:', error);
      return false;
    }
  }

  // Server-side method to increment generated stories
  async incrementGeneratedStories() {
    if (!this.getUserId()) {
      return;
    }

    try {
      const currentPreferences = await this.getUserPreferences();
      const updatedPreferences = {
        ...currentPreferences,
        generatedStories: (currentPreferences.generatedStories || 0) + 1,
      };

      await this.updateUserPreferences(updatedPreferences);
    } catch (error) {
      logger.error('Failed to increment generated stories:', error);
    }
  }

  // Server-side method to generate a personalized story
  async generatePersonalizedStory(input: StoryInput): Promise<Story | null> {
    try {
      const preferences = await this.getUserPreferences();

      // Combine user preferences with input to enhance story
      const enhancedInput = {
        ...input,
        interests: [...input.interests, ...preferences.mostLikedCharacterTypes],
        themes: [...(input.themes || []), ...preferences.preferredThemes],
      };

      // For now, use the basic story generator as a fallback
      const story = await generateStory(enhancedInput, this.getUserId() || undefined);

      // Update story generation count in user metadata
      if (this.getUserId()) {
        await this.updateGenerationCount();
      }

      return story;
    } catch (error) {
      logger.error('Failed to generate personalized story:', error);
      return null;
    }
  }

  // Helper method to update story generation count
  private async updateGenerationCount() {
    try {
      const user = await clerkClient.users.getUser(this.getUserId()!);
      const currentCount = (user.publicMetadata?.generatedStories as number) || 0;

      await clerkClient.users.updateUser(this.getUserId()!, {
        publicMetadata: {
          ...user.publicMetadata,
          generatedStories: currentCount + 1,
        },
      });
    } catch (error) {
      logger.error('Failed to update story generation count:', error);
    }
  }
}

// Singleton instance of the server-side personalization engine
export const serverUserPersonalizationEngine = new ServerUserPersonalizationEngine(null);
