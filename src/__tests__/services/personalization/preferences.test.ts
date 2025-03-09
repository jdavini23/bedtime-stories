import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DEFAULT_PREFERENCES, PreferencesManager } from '@/services/personalization/preferences';
import { UserPreferencesLocal } from '@/services/personalization/types';

// Mock Redis
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    set: vi.fn(),
    hgetall: vi.fn(),
    hset: vi.fn(),
  })),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Preferences Module', () => {
  describe('DEFAULT_PREFERENCES', () => {
    it('should have all required fields', () => {
      expect(DEFAULT_PREFERENCES).toBeDefined();
      expect(DEFAULT_PREFERENCES.userId).toBeNull();
      expect(DEFAULT_PREFERENCES.preferredThemes).toEqual(['adventure', 'educational']);
      expect(DEFAULT_PREFERENCES.generatedStoryCount).toBe(0);
      expect(DEFAULT_PREFERENCES.learningInterests).toEqual([]);
      expect(DEFAULT_PREFERENCES.ageGroup).toBe('6-8');
      expect(DEFAULT_PREFERENCES.theme).toBe('light');
      expect(DEFAULT_PREFERENCES.language).toBe('en');
      expect(DEFAULT_PREFERENCES.notifications).toEqual({
        email: true,
        push: false,
        frequency: 'weekly',
      });
      expect(DEFAULT_PREFERENCES.createdAt).toBeInstanceOf(Date);
      expect(DEFAULT_PREFERENCES.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('PreferencesManager', () => {
    let preferencesManager: PreferencesManager;
    const testUserId = 'test-user-123';

    beforeEach(() => {
      localStorageMock.clear();
      preferencesManager = new PreferencesManager(testUserId);
    });

    describe('getUserPreferences', () => {
      it('should return DEFAULT_PREFERENCES when no userId is provided', async () => {
        const noUserManager = new PreferencesManager(undefined);
        const preferences = await noUserManager.getUserPreferences();
        expect(preferences).toEqual(DEFAULT_PREFERENCES);
      });

      it('should return preferences from localStorage if available', async () => {
        const testPreferences: UserPreferencesLocal = {
          ...DEFAULT_PREFERENCES,
          userId: testUserId,
          preferredThemes: ['fantasy', 'science'],
          ageGroup: '9-12',
        };

        localStorageMock.setItem(`preferences:${testUserId}`, JSON.stringify(testPreferences));

        const preferences = await preferencesManager.getUserPreferences();
        expect(preferences.preferredThemes).toEqual(['fantasy', 'science']);
        expect(preferences.ageGroup).toBe('9-12');
      });
    });

    describe('updateUserPreferences', () => {
      it('should return false when no userId is provided', async () => {
        const noUserManager = new PreferencesManager(undefined);
        const result = await noUserManager.updateUserPreferences({
          preferredThemes: ['fantasy'],
        });
        expect(result).toBe(false);
      });

      it('should update preferences in localStorage', async () => {
        const newPreferences: Partial<UserPreferencesLocal> = {
          preferredThemes: ['fantasy', 'science'],
          ageGroup: '9-12' as const,
        };

        const result = await preferencesManager.updateUserPreferences(newPreferences);
        expect(result).toBe(true);

        const storedPreferences = JSON.parse(
          localStorageMock.getItem(`preferences:${testUserId}`) || '{}'
        );
        expect(storedPreferences.preferredThemes).toEqual(['fantasy', 'science']);
        expect(storedPreferences.ageGroup).toBe('9-12');
      });
    });

    describe('incrementStoryCount', () => {
      it('should return false when no userId is provided', async () => {
        const noUserManager = new PreferencesManager(undefined);
        const result = await noUserManager.incrementStoryCount();
        expect(result).toBe(false);
      });

      it('should return false for default user', async () => {
        const defaultUserManager = new PreferencesManager('default-user');
        const result = await defaultUserManager.incrementStoryCount();
        expect(result).toBe(false);
      });
    });
  });
});
