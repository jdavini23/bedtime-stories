import { Redis } from '@upstash/redis';
import { UserPreferencesLocal } from './types';
import { personalizationLogger } from '../../utils/logging/logUtils';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Default preferences for new users
export const DEFAULT_PREFERENCES: UserPreferencesLocal = {
  userId: null,
  preferredThemes: ['adventure', 'educational'],
  generatedStoryCount: 0,
  learningInterests: [],
  ageGroup: '6-8',
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: false,
    frequency: 'weekly',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export class PreferencesManager {
  private userId: string | undefined;
  private isServerSide: boolean = typeof window === 'undefined';

  constructor(userId: string | undefined) {
    this.userId = userId;
    personalizationLogger.info('PreferencesManager initialized', { userId });
  }

  private isValidPreferences(preferences: unknown): preferences is UserPreferencesLocal {
    if (!preferences || typeof preferences !== 'object') return false;
    const p = preferences as UserPreferencesLocal;
    return (
      Array.isArray(p.preferredThemes) &&
      typeof p.generatedStoryCount === 'number' &&
      Array.isArray(p.learningInterests) &&
      typeof p.theme === 'string' &&
      typeof p.language === 'string'
    );
  }

  async getUserPreferences(): Promise<UserPreferencesLocal> {
    if (!this.userId) return DEFAULT_PREFERENCES;

    try {
      // Try to get preferences from server-side KV store if available
      if (this.isServerSide && this.userId !== 'default-user') {
        try {
          const kvKey = `user:preferences:${this.userId}`;
          const storedPreferences = await redis.get(kvKey);

          if (storedPreferences && typeof storedPreferences === 'object') {
            personalizationLogger.info('Retrieved user preferences from KV store', {
              userId: this.userId,
            });
            return {
              ...DEFAULT_PREFERENCES,
              ...storedPreferences,
            };
          }
        } catch (kvError) {
          personalizationLogger.error('Error fetching user preferences from KV:', {
            error: kvError,
          });
          // Fall back to localStorage if KV fails
        }
      }

      // Client-side storage fallback
      if (typeof window !== 'undefined') {
        const storedPreferences = localStorage.getItem(`preferences:${this.userId}`);
        if (storedPreferences) {
          const parsed = JSON.parse(storedPreferences);
          if (!this.isValidPreferences(parsed)) {
            personalizationLogger.error('Invalid preferences format in localStorage');
            return DEFAULT_PREFERENCES;
          }

          return {
            ...DEFAULT_PREFERENCES,
            ...parsed,
          };
        }
      }

      return DEFAULT_PREFERENCES;
    } catch (error) {
      personalizationLogger.error('Error fetching user preferences:', { error });
      return DEFAULT_PREFERENCES;
    }
  }

  async updateUserPreferences(newPreferences: Partial<UserPreferencesLocal>): Promise<boolean> {
    if (!this.userId) return false;

    try {
      const currentPreferences = await this.getUserPreferences();
      const updatedPreferences = {
        ...currentPreferences,
        ...newPreferences,
        updatedAt: new Date(),
      };

      // Store in KV if server-side and user is authenticated
      if (this.isServerSide && this.userId !== 'default-user') {
        try {
          const kvKey = `user:preferences:${this.userId}`;
          await redis.set(kvKey, updatedPreferences);
          personalizationLogger.info('Updated user preferences in KV store', {
            userId: this.userId,
          });
          return true;
        } catch (kvError) {
          personalizationLogger.error('Error updating user preferences in KV:', { error: kvError });
          // Fall back to localStorage if KV fails
        }
      }

      // Client-side storage fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(`preferences:${this.userId}`, JSON.stringify(updatedPreferences));
        return true;
      }

      return false;
    } catch (error) {
      personalizationLogger.error('Error updating user preferences:', { error });
      return false;
    }
  }

  async incrementStoryCount(): Promise<boolean> {
    if (!this.userId || this.userId === 'default-user') return false;

    try {
      // Get current user data
      const userData = await redis.hgetall(`user:${this.userId}`);

      if (!userData) {
        personalizationLogger.warn('No user data found when incrementing story count', {
          userId: this.userId,
        });
        return false;
      }

      // Calculate new story count
      const currentStoryCount = parseInt((userData.storiesGenerated as string) || '0', 10);
      const newStoryCount = currentStoryCount + 1;

      // Update story count in database
      await redis.hset(`user:${this.userId}`, {
        storiesGenerated: newStoryCount,
        lastStoryGeneratedAt: new Date().toISOString(),
      });

      personalizationLogger.info('Successfully incremented story count', {
        userId: this.userId,
        previousCount: currentStoryCount,
        newCount: newStoryCount,
      });

      return true;
    } catch (error) {
      personalizationLogger.error('Error incrementing story count', { error });
      return false;
    }
  }
}
