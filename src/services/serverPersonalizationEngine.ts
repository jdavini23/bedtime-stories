import { clerkClient } from '@clerk/nextjs/server';
import { StoryPersonalizationEngine, DEFAULT_PREFERENCES } from './personalizationEngine';
import { Story, StoryInput } from '@/types/story';
import { generateStory } from '@/lib/storyGenerator';

export class ServerStoryPersonalizationEngine extends StoryPersonalizationEngine {
  // Method to set user ID
  setUserId(userId: string | null) {
    this.userId = userId;
  }

  // Server-side method to get user preferences
  async getUserPreferences() {
    if (!this.userId) {
      return DEFAULT_PREFERENCES;
    }

    try {
      const user = await clerkClient.users.getUser(this.userId);
      
      // Extract preferences from Clerk's publicMetadata
      const preferences = user.publicMetadata?.preferences || DEFAULT_PREFERENCES;
      
      return {
        themes: preferences.themes || DEFAULT_PREFERENCES.themes,
        interests: preferences.interests || [],
        generatedStories: preferences.generatedStories || 0
      };
    } catch (error) {
      console.error('Failed to fetch user preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  // Server-side method to update user preferences
  async updateUserPreferences(newPreferences: any) {
    if (!this.userId) {
      return false;
    }

    try {
      await clerkClient.users.updateUser(this.userId, {
        publicMetadata: { 
          preferences: {
            ...newPreferences,
            generatedStories: newPreferences.generatedStories || 0
          }
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      return false;
    }
  }

  // Server-side method to increment generated stories
  async incrementGeneratedStories() {
    if (!this.userId) {
      return;
    }

    try {
      const currentPreferences = await this.getUserPreferences();
      const updatedPreferences = {
        ...currentPreferences,
        generatedStories: (currentPreferences.generatedStories || 0) + 1
      };
      
      await this.updateUserPreferences(updatedPreferences);
    } catch (error) {
      console.error('Failed to increment generated stories:', error);
    }
  }

  // Server-side method to generate a personalized story
  async generatePersonalizedStory(input: StoryInput): Promise<Story | null> {
    try {
      const preferences = await this.getUserPreferences();
      
      // Combine user preferences with input to enhance story
      const enhancedInput = {
        ...input,
        interests: [...input.interests, ...preferences.interests],
        themes: [...(input.themes || []), ...preferences.themes]
      };

      // For now, use the basic story generator as a fallback
      const story = await generateStory(enhancedInput, this.userId || undefined);
      
      // Update story generation count in user metadata
      if (this.userId) {
        await this.updateGenerationCount();
      }

      return story;
    } catch (error) {
      console.error('Failed to generate personalized story:', error);
      return null;
    }
  }

  // Helper method to update story generation count
  private async updateGenerationCount() {
    try {
      const user = await clerkClient.users.getUser(this.userId!);
      const currentCount = (user.publicMetadata?.generatedStories as number) || 0;
      
      await clerkClient.users.updateUser(this.userId!, {
        publicMetadata: {
          ...user.publicMetadata,
          generatedStories: currentCount + 1
        }
      });
    } catch (error) {
      console.error('Failed to update story generation count:', error);
    }
  }
}

// Singleton instance of the server-side personalization engine
export const serverStoryPersonalizationEngine = new ServerStoryPersonalizationEngine(null);
