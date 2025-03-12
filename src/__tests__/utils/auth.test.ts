import { createClient } from '@supabase/supabase-js';
import { vi } from 'vitest';
import { describe, it, expect } from 'vitest';
import { User } from '@supabase/supabase-js';
import {
  isAdmin,
  getUserDisplayName,
  hasVerifiedEmail,
  getUserEmail,
  hasCompletedOnboarding,
} from '@/utils/auth';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  })),
}));

export { createClient };

describe('Auth Utilities', () => {
  const mockUser: User = {
    id: 'test-user-123',
    email: 'test@example.com',
    email_confirmed_at: '2024-03-12T00:00:00.000Z',
    phone: '',
    created_at: '2024-03-12T00:00:00.000Z',
    user_metadata: {
      full_name: 'Test User',
      role: 'admin',
      onboarding_completed: true,
    },
    app_metadata: {},
    aud: 'authenticated',
    role: '',
  };

  describe('isAdmin', () => {
    it('should return true for admin users', () => {
      expect(isAdmin(mockUser)).toBe(true);
    });

    it('should return false for non-admin users', () => {
      const nonAdminUser = {
        ...mockUser,
        user_metadata: { ...mockUser.user_metadata, role: 'user' },
      };
      expect(isAdmin(nonAdminUser)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(isAdmin(null)).toBe(false);
    });

    it('should return false when metadata is missing', () => {
      const userWithoutMetadata = { ...mockUser, user_metadata: {} };
      expect(isAdmin(userWithoutMetadata)).toBe(false);
    });
  });

  describe('getUserDisplayName', () => {
    it('should return full name from metadata when available', () => {
      expect(getUserDisplayName(mockUser)).toBe('Test User');
    });

    it('should return email username when no name is available', () => {
      const userWithoutName = {
        ...mockUser,
        user_metadata: {},
      };
      expect(getUserDisplayName(userWithoutName)).toBe('test');
    });

    it('should return "Guest" for null user', () => {
      expect(getUserDisplayName(null)).toBe('Guest');
    });

    it('should return "User" when no identifiable information is available', () => {
      const userWithoutInfo = {
        ...mockUser,
        email: undefined,
        user_metadata: {},
      };
      expect(getUserDisplayName(userWithoutInfo)).toBe('User');
    });
  });

  describe('hasVerifiedEmail', () => {
    it('should return true when email is confirmed', () => {
      expect(hasVerifiedEmail(mockUser)).toBe(true);
    });

    it('should return false when email is not confirmed', () => {
      const unverifiedUser = {
        ...mockUser,
        email_confirmed_at: undefined,
      };
      expect(hasVerifiedEmail(unverifiedUser)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(hasVerifiedEmail(null)).toBe(false);
    });
  });

  describe('getUserEmail', () => {
    it('should return email when available', () => {
      expect(getUserEmail(mockUser)).toBe('test@example.com');
    });

    it('should return null when email is not available', () => {
      const userWithoutEmail = {
        ...mockUser,
        email: undefined,
      };
      expect(getUserEmail(userWithoutEmail)).toBe(null);
    });

    it('should return null for null user', () => {
      expect(getUserEmail(null)).toBe(null);
    });
  });

  describe('hasCompletedOnboarding', () => {
    it('should return true when onboarding is completed', () => {
      expect(hasCompletedOnboarding(mockUser)).toBe(true);
    });

    it('should return false when onboarding is not completed', () => {
      const userWithoutOnboarding = {
        ...mockUser,
        user_metadata: { ...mockUser.user_metadata, onboarding_completed: false },
      };
      expect(hasCompletedOnboarding(userWithoutOnboarding)).toBe(false);
    });

    it('should return false when onboarding status is missing', () => {
      const userWithoutOnboardingStatus = {
        ...mockUser,
        user_metadata: {},
      };
      expect(hasCompletedOnboarding(userWithoutOnboardingStatus)).toBe(false);
    });

    it('should return false for null user', () => {
      expect(hasCompletedOnboarding(null)).toBe(false);
    });
  });
});
