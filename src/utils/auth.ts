import type { User as ClerkUser } from '@clerk/nextjs/server';

// Our application's User type
interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  isAdmin?: boolean;
}

/**
 * Check if a user has admin privileges
 * @param user The user object
 * @returns boolean indicating if the user is an admin
 */
export const isAdmin = (user: ClerkUser | User | null): boolean => {
  if (!user) return false;

  // Handle our app's User type
  if ('isAdmin' in user) {
    return user.isAdmin === true;
  }

  // Handle Clerk User type - check if publicMetadata exists
  if ('publicMetadata' in user) {
    return user.publicMetadata?.isAdmin === true;
  }

  return false;
};

/**
 * Get user's display name
 * @param user The user object
 * @returns The user's display name
 */
export const getUserDisplayName = (user: ClerkUser | User | null): string => {
  if (!user) return 'Guest';

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  if (user.firstName) {
    return user.firstName;
  }

  // Handle Clerk User type
  if ('username' in user && user.username) {
    return user.username;
  }

  return 'User';
};

/**
 * Check if the user has verified their email
 * @param user The Clerk user object
 * @returns boolean indicating if the user has a verified email
 */
export const hasVerifiedEmail = (user: ClerkUser | null): boolean => {
  if (!user) return false;

  return user.emailAddresses.some((email) => email.verification?.status === 'verified');
};
