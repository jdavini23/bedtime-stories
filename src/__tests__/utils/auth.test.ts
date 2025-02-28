import { isAdmin, getUserDisplayName, hasVerifiedEmail } from '@/utils/auth';
import type { User as ClerkUser } from '@clerk/nextjs/server';

// Mock our app's User type
interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  isAdmin?: boolean;
}

describe('Auth Utilities', () => {
  describe('isAdmin', () => {
    it('should return false for null user', () => {
      expect(isAdmin(null)).toBe(false);
    });

    it('should return true for app User with isAdmin=true', () => {
      const user: User = {
        id: 'user_123',
        isAdmin: true,
      };
      expect(isAdmin(user)).toBe(true);
    });

    it('should return false for app User with isAdmin=false', () => {
      const user: User = {
        id: 'user_123',
        isAdmin: false,
      };
      expect(isAdmin(user)).toBe(false);
    });

    it('should return true for Clerk User with isAdmin=true in publicMetadata', () => {
      const user = {
        id: 'user_123',
        publicMetadata: { isAdmin: true },
      } as unknown as ClerkUser;
      expect(isAdmin(user)).toBe(true);
    });

    it('should return false for Clerk User with isAdmin=false in publicMetadata', () => {
      const user = {
        id: 'user_123',
        publicMetadata: { isAdmin: false },
      } as unknown as ClerkUser;
      expect(isAdmin(user)).toBe(false);
    });

    it('should return false for Clerk User with no isAdmin in publicMetadata', () => {
      const user = {
        id: 'user_123',
        publicMetadata: {},
      } as unknown as ClerkUser;
      expect(isAdmin(user)).toBe(false);
    });
  });

  describe('getUserDisplayName', () => {
    it('should return "Guest" for null user', () => {
      expect(getUserDisplayName(null)).toBe('Guest');
    });

    it('should return full name when firstName and lastName are available', () => {
      const user: User = {
        id: 'user_123',
        firstName: 'John',
        lastName: 'Doe',
      };
      expect(getUserDisplayName(user)).toBe('John Doe');
    });

    it('should return firstName when only firstName is available', () => {
      const user: User = {
        id: 'user_123',
        firstName: 'John',
      };
      expect(getUserDisplayName(user)).toBe('John');
    });

    it('should return username when available for Clerk User', () => {
      const user = {
        id: 'user_123',
        username: 'johndoe',
        firstName: null,
        lastName: null,
      } as unknown as ClerkUser;
      expect(getUserDisplayName(user)).toBe('johndoe');
    });

    it('should return "User" when no identifying information is available', () => {
      const user: User = {
        id: 'user_123',
      };
      expect(getUserDisplayName(user)).toBe('User');
    });
  });

  describe('hasVerifiedEmail', () => {
    it('should return false for null user', () => {
      expect(hasVerifiedEmail(null)).toBe(false);
    });

    it('should return true when user has at least one verified email', () => {
      const user = {
        emailAddresses: [
          {
            emailAddress: 'test@example.com',
            verification: { status: 'verified' },
          },
        ],
      } as unknown as ClerkUser;
      expect(hasVerifiedEmail(user)).toBe(true);
    });

    it('should return false when user has no verified emails', () => {
      const user = {
        emailAddresses: [
          {
            emailAddress: 'test@example.com',
            verification: { status: 'unverified' },
          },
        ],
      } as unknown as ClerkUser;
      expect(hasVerifiedEmail(user)).toBe(false);
    });

    it('should return false when user has no emails', () => {
      const user = {
        emailAddresses: [],
      } as unknown as ClerkUser;
      expect(hasVerifiedEmail(user)).toBe(false);
    });
  });
});
