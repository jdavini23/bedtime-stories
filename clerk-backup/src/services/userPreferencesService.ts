import { clerkClient } from '@clerk/nextjs';
// PreferencesError is now defined locally in this file, so we don't need to import it

export type AgeGroup = '3-5' | '6-8' | '9-12';
export type Theme = 'light' | 'dark';
export type NotificationFrequency = 'daily' | 'weekly' | 'monthly';

export interface StoryGenerationPreferences {
  maxLength: number;
  educationalFocus: boolean;
  moralEmphasis: boolean;
  readingLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  frequency: NotificationFrequency;
}

export interface UserPreferences {
  id?: string;
  userId: string | null | null | null | null | null | null;
  preferredThemes: string[];
  generatedStoryCount: number;
  lastStoryGeneratedAt?: Date;
  learningInterests: string[];
  ageGroup: AgeGroup;
  storyGenerationPreferences: StoryGenerationPreferences;
  theme: Theme;
  language: string;
  notifications: NotificationPreferences;
  createdAt?: Date;
  updatedAt?: Date;
}

class PreferencesError extends Error {
  public code: string;
  public userId?: string;
  public context?: Record<string, unknown>;

  constructor(message: string, code: string, userId?: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'PreferencesError';
    this.code = code;
    this.userId = userId;
    this.context = context;
  }
}

export { PreferencesError };

class UserPreferencesService {
  private static instance: UserPreferencesService;
  private cache: Map<string, UserPreferences>;
  private readonly retryAttempts: number = 3;
  private readonly retryDelay: number = 1000;
  private readonly cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  private async retry<T>(operation: () => Promise<T>, attempt: number = 1): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= this.retryAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, this.retryDelay * attempt));
      return this.retry(operation, attempt + 1);
    }
  }

  getDefaultPreferences(userId: string): UserPreferences {
    return {
      userId,
      theme: 'light',
      preferredThemes: ['adventure', 'educational'],
      generatedStoryCount: 0,
      learningInterests: [],
      ageGroup: '6-8',
      language: 'en',
      storyGenerationPreferences: {
        maxLength: 1000,
        educationalFocus: true,
        moralEmphasis: true,
        readingLevel: 'intermediate',
      },
      notifications: {
        email: true,
        push: false,
        frequency: 'weekly',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private validatePreferences(preferences: Partial<UserPreferences>): void {
    if (preferences.ageGroup && !['3-5', '6-8', '9-12'].includes(preferences.ageGroup)) {
      throw new PreferencesError(
        'Invalid age group',
        'INVALID_AGE_GROUP',
        preferences.userId ?? undefined
      );
    }

    if (preferences.theme && !['light', 'dark'].includes(preferences.theme)) {
      throw new PreferencesError('Invalid theme', 'INVALID_THEME', preferences.userId ?? undefined);
    }
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      if (!userId) return null;

      const cached = this.cache.get(userId);
      if (cached) {
        return cached;
      }

      const user = await this.retry(() => clerkClient.users.getUser(userId));
      const preferences = user.publicMetadata.preferences as UserPreferences | undefined;

      if (!preferences) {
        return null;
      }

      this.cache.set(userId, preferences);
      setTimeout(() => this.cache.delete(userId), this.cacheTimeout);

      return preferences;
    } catch (error) {
      throw new PreferencesError('Failed to fetch user preferences', 'FETCH_ERROR', userId);
    }
  }

  async updateUserPreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    try {
      this.validatePreferences(updates);

      const user = await this.retry(() => clerkClient.users.getUser(userId));
      const currentPreferences =
        (user.publicMetadata.preferences as UserPreferences) || this.getDefaultPreferences(userId);

      const updatedPreferences: UserPreferences = {
        ...currentPreferences,
        ...updates,
        userId,
        updatedAt: new Date(),
      };

      await this.retry(() =>
        clerkClient.users.updateUser(userId, {
          publicMetadata: {
            ...user.publicMetadata,
            preferences: updatedPreferences,
          },
        })
      );

      this.cache.set(userId, updatedPreferences);
      setTimeout(() => this.cache.delete(userId), this.cacheTimeout);

      return updatedPreferences;
    } catch (error) {
      if (error instanceof PreferencesError) {
        throw error;
      }
      throw new PreferencesError('Failed to update user preferences', 'UPDATE_ERROR', userId);
    }
  }

  async incrementStoryCount(userId: string): Promise<void> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) {
        throw new PreferencesError('User preferences not found', 'NOT_FOUND', userId);
      }

      await this.updateUserPreferences(userId, {
        generatedStoryCount: preferences.generatedStoryCount + 1,
        lastStoryGeneratedAt: new Date(),
      });
    } catch (error) {
      if (error instanceof PreferencesError) {
        throw error;
      }
      throw new PreferencesError('Failed to increment story count', 'INCREMENT_ERROR', userId);
    }
  }

  async deleteUserPreferences(userId: string): Promise<void> {
    try {
      const user = await this.retry(() => clerkClient.users.getUser(userId));
      await this.retry(() =>
        clerkClient.users.updateUser(userId, {
          publicMetadata: {
            ...user.publicMetadata,
            preferences: undefined,
          },
        })
      );
      this.cache.delete(userId);
    } catch (error) {
      throw new PreferencesError('Failed to delete user preferences', 'DELETE_ERROR', userId);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default UserPreferencesService.getInstance();
