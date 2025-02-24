import { clerkClient } from '@clerk/nextjs/server';
import {
  UserPersonalizationEngine as BaseUserPersonalizationEngine,
  DEFAULT_PREFERENCES,
} from './personalizationEngine';
import { Story, StoryInput, UserPreferences } from '@/types/story';
import { generateStory } from '@/lib/storyGenerator';
import { logger } from '@/utils/logger';

export class ServerUserPersonalizationEngine extends BaseUserPersonalizationEngine {
  // Public method to initialize user ID
  public init(userId: string | undefined) {
    this.setUserId(userId);
  }

  // Server-side method to get user preferences
  async getUserPreferences(): Promise<UserPreferences> {
    const userId = this.getUserId();
    if (!userId) {
      return DEFAULT_PREFERENCES;
    }

    try {
      const user = await clerkClient.users.getUser(userId);
      const preferences = (user.publicMetadata?.preferences || {}) as Partial<UserPreferences>;

      return {
        ...DEFAULT_PREFERENCES,
        ...preferences,
        preferredThemes: preferences.preferredThemes || DEFAULT_PREFERENCES.preferredThemes,
        generatedStoryCount: preferences.generatedStoryCount || 0,
      };
    } catch (error) {
      logger.error('Failed to fetch user preferences:', { error });
      return DEFAULT_PREFERENCES;
    }
  }

  async updateUserPreferences(newPreferences: Partial<UserPreferences>): Promise<boolean> {
    const userId = this.getUserId();
    if (!userId) {
      return false;
    }

    try {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          preferences: {
            ...newPreferences,
            generatedStoryCount: newPreferences.generatedStoryCount || 0,
          },
        },
      });
      return true;
    } catch (error) {
      logger.error('Failed to update user preferences:', { error });
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
        generatedStoryCount: (currentPreferences.generatedStoryCount || 0) + 1,
      };

      await this.updateUserPreferences(updatedPreferences);
    } catch (error) {
      logger.error('Failed to increment generated stories:', { error });
    }
  }

  // Server-side method to generate a personalized story
  async generatePersonalizedStory(input: StoryInput): Promise<Story> {
    try {
      const userId = this.getUserId();
      const story = await generateStory(input, userId || undefined);
      if (!story) throw new Error('Failed to generate story');

      await this.incrementGeneratedStories();
      return story;
    } catch (error) {
      logger.error('Failed to generate personalized story:', { error });
      throw error;
    }
  }
}

// Singleton instance of the server-side personalization engine
export const serverUserPersonalizationEngine = new ServerUserPersonalizationEngine(undefined);
