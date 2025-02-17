import { StoryInput, StoryTheme, Story, StoryInterest } from '@/types/story';
import { storyApi } from './api';
import { firestoreService, UserStoryPreference } from './firestoreService';
import { getCurrentUser } from '@/lib/firebaseAuth';
import { logger } from '@/utils/logger';  

// Custom error classes for more specific error handling
export class PersonalizationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'PersonalizationError';
  }
}

export class StoryPersonalizationEngine {
  // Require user ID for story generation
  async generatePersonalizedStory(
    input: StoryInput,
    userId?: string
  ): Promise<Story> {
    try {
      logger.info('Starting personalized story generation', { input, userId });

      // Validate input parameters
      if (!input) {
        throw new PersonalizationError(
          'Invalid story input: Input cannot be null or undefined', 
          'INVALID_INPUT'
        );
      }

      // Get current user if userId not provided
      const currentUser = userId ? { uid: userId } : getCurrentUser();
      
      if (!currentUser?.uid) {
        throw new PersonalizationError(
          'Authentication required for story generation', 
          'AUTH_REQUIRED'
        );
      }

      const resolvedUserId = userId || currentUser.uid;

      // Fetch user preferences from Firestore with error handling
      const userPreferences = await this.fetchUserPreferences(resolvedUserId);

      // Validate user preferences
      if (!userPreferences) {
        throw new PersonalizationError(
          'Failed to retrieve or create user preferences', 
          'PREFERENCES_RETRIEVAL_FAILED'
        );
      }

      // Theme and interest optimization logic
      const optimizedTheme = this.selectOptimalTheme(
        input.theme, 
        userPreferences
      );

      const enhancedInterests = this.optimizeInterests(
        input.interests, 
        userPreferences
      );

      const personalizedInput: StoryInput = {
        ...input,
        theme: optimizedTheme,
        interests: enhancedInterests
      };

      // Generate story with performance tracking
      const startTime = Date.now();
      const generatedStory = await storyApi.generateStory(personalizedInput);
      const generationTime = Date.now() - startTime;

      if (!generatedStory) {
        throw new PersonalizationError(
          'Story generation returned null or undefined', 
          'GENERATION_FAILED'
        );
      }

      logger.info('Story generated successfully', { 
        userId: resolvedUserId, 
        theme: optimizedTheme, 
        generationTime 
      });

      // Update user preferences and record story
      await this.updateUserPreferences(resolvedUserId, generatedStory);

      return generatedStory;
    } catch (error) {
      const errorContext = {
        userId,
        input,
        error: {
          name: error instanceof Error ? error.name : 'Unknown Error',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : 'No stack trace'
        }
      };

      logger.error('Story personalization failed', errorContext);

      if (error instanceof PersonalizationError) {
        throw error;
      }

      throw new PersonalizationError(
        error instanceof Error ? error.message : 'Failed to generate personalized story', 
        'GENERATION_FAILED'
      );
    }
  }

  private async fetchUserPreferences(userId: string): Promise<UserStoryPreference> {
    try {
      const userPreferences = await firestoreService.getUserPreferences(userId);
      return userPreferences || await this.createDefaultPreferences(userId);
    } catch (error) {
      logger.warn('Failed to fetch user preferences, creating defaults', { 
        userId, 
        error 
      });
      return this.createDefaultPreferences(userId);
    }
  }

  private async createDefaultPreferences(userId: string): Promise<UserStoryPreference> {
    const defaultPreferences: UserStoryPreference = {
      userId,
      preferredThemes: [], 
      avgStoryRating: 0,
      mostLikedCharacterTypes: [],
      learningInterests: [],
      generatedStoryCount: 0
    };

    try {
      await firestoreService.upsertUserPreferences(userId, defaultPreferences);
      logger.info('Default user preferences created', { userId });
      return defaultPreferences;
    } catch (error) {
      logger.error('Failed to create default preferences', { userId, error });
      throw new PersonalizationError(
        'Could not create default user preferences', 
        'DEFAULT_PREFERENCES_FAILED'
      );
    }
  }

  private async updateUserPreferences(
    userId: string, 
    story: Story
  ): Promise<void> {
    try {
      // Fetch current preferences
      const currentPreferences = await firestoreService.getUserPreferences(userId);

      // Prepare updates with type safety
      const updates: Partial<UserStoryPreference> = {
        preferredThemes: Array.from(new Set([
          ...(currentPreferences?.preferredThemes || []),
          story.input.theme
        ])),
        learningInterests: Array.from(new Set([
          ...(currentPreferences?.learningInterests || []),
          ...story.input.interests
        ])),
        generatedStoryCount: (currentPreferences?.generatedStoryCount || 0) + 1
      };

      // Update user preferences
      await firestoreService.upsertUserPreferences(userId, updates);

      // Record the generated story
      await firestoreService.recordStory(userId, {
        content: story.content,
        theme: story.input.theme,
        interests: story.input.interests
      });

      logger.info('User preferences and story updated', { 
        userId, 
        storyTheme: story.input.theme 
      });
    } catch (error) {
      logger.error('Failed to update user preferences', { 
        userId, 
        error 
      });
      throw new PersonalizationError(
        'Could not update user preferences', 
        'PREFERENCES_UPDATE_FAILED'
      );
    }
  }

  // Intelligent theme selection with more robust type handling
  private selectOptimalTheme(
    currentTheme: StoryTheme, 
    userPreferences: UserStoryPreference
  ): StoryTheme {
    const themeRelevanceScore: Record<StoryTheme, number> = {
      adventure: userPreferences.preferredThemes.includes('adventure') ? 1.2 : 1.0,
      fantasy: userPreferences.preferredThemes.includes('fantasy') ? 1.2 : 1.0,
      educational: userPreferences.learningInterests.length > 0 ? 1.3 : 1.0,
      friendship: userPreferences.preferredThemes.includes('friendship') ? 1.2 : 1.0,
      courage: 1.0,
      kindness: 1.0,
      curiosity: 1.1,
      creativity: 1.1,
      nature: userPreferences.learningInterests.includes('nature') ? 1.3 : 1.0,
      science: userPreferences.learningInterests.includes('science') ? 1.3 : 1.0
    };

    const sortedThemes = Object.entries(themeRelevanceScore)
      .sort((a, b) => b[1] - a[1]);

    return sortedThemes[0][0] as StoryTheme || currentTheme;
  }

  // Optimize interests with more intelligent selection
  private optimizeInterests(
    currentInterests: StoryInterest[], 
    userPreferences: UserStoryPreference
  ): StoryInterest[] {
    const enrichedInterests = new Set<StoryInterest>(currentInterests);
    
    // Add learning interests, prioritizing user's past interests
    userPreferences.learningInterests.forEach(interest => {
      if (!enrichedInterests.has(interest as StoryInterest)) {
        enrichedInterests.add(interest as StoryInterest);
      }
    });

    return Array.from(enrichedInterests).slice(0, 3); // Limit to 3 interests
  }

  // Method to manually update user preferences with validation
  async updatePreferencesManually(
    userId: string, 
    updates: Partial<UserStoryPreference>
  ): Promise<void> {
    try {
      const currentPreferences = await firestoreService.getUserPreferences(userId);
      
      // Validate updates to prevent unintended modifications
      const validatedUpdates: Partial<UserStoryPreference> = {
        preferredThemes: updates.preferredThemes || currentPreferences?.preferredThemes,
        learningInterests: updates.learningInterests || currentPreferences?.learningInterests,
        avgStoryRating: updates.avgStoryRating ?? currentPreferences?.avgStoryRating,
        generatedStoryCount: updates.generatedStoryCount ?? currentPreferences?.generatedStoryCount
      };

      await firestoreService.upsertUserPreferences(userId, validatedUpdates);
      
      logger.info('User preferences manually updated', { 
        userId, 
        updates: validatedUpdates 
      });
    } catch (error) {
      logger.error('Failed to manually update preferences', { 
        userId, 
        error 
      });
      throw new PersonalizationError(
        'Could not manually update user preferences', 
        'MANUAL_PREFERENCES_UPDATE_FAILED'
      );
    }
  }
}

// Singleton instance for easy import
export const storyPersonalizationEngine = new StoryPersonalizationEngine();


