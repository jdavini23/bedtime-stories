import { User } from '@supabase/supabase-js';
import { logger } from './logger';

// Our application's User type with comprehensive metadata
type AppMetadata = {
  role?: string;
  isAdmin?: boolean;
  full_name?: string;
  name?: string;
  onboarding_completed?: boolean;
};

type AppUser = User & {
  user_metadata: AppMetadata;
};

/**
 * Check if a user has admin privileges
 * @param user The user object from Supabase
 * @returns boolean indicating if the user is an admin
 */
export const isAdmin = (user: AppUser | null): boolean => {
  try {
    if (!user?.user_metadata) return false;
    return user.user_metadata.isAdmin === true || user.user_metadata.role === 'admin';
  } catch (error) {
    logger.error('Error checking admin status', { error });
    return false;
  }
};

/**
 * Get the display name for a user
 * @param user The user object from Supabase
 * @returns The user's display name or a default value
 */
export const getUserDisplayName = (user: AppUser | null): string => {
  try {
    if (!user) return 'Guest';

    const metadata = user.user_metadata;
    if (!metadata) return user.email?.split('@')[0] || 'User';

    // Try each possible name field in order of preference
    return (
      metadata.full_name ||
      metadata.name ||
      user.email?.split('@')[0] ||
      'User'
    );
  } catch (error) {
    logger.error('Error getting user display name', { error, userId: user?.id });
    return 'User';
  }
};

/**
 * Check if a user has a verified email
 * @param user The user object from Supabase
 * @returns boolean indicating if the user's email is verified
 */
export const hasVerifiedEmail = (user: AppUser | null): boolean => {
  try {
    if (!user) return false;
    return user.email_confirmed_at !== null;
  } catch (error) {
    logger.error('Error checking email verification', { error, userId: user?.id });
    return false;
  }
};

/**
 * Get the user's email address
 * @param user The user object from Supabase
 * @returns string The user's email address or null
 */
export const getUserEmail = (user: AppUser | null): string | null => {
  try {
    if (!user) return null;
    return user.email || null;
  } catch (error) {
    logger.error('Error getting user email', { error, userId: user?.id });
    return null;
  }
};

/**
 * Check if the user has completed onboarding
 * @param user The user object from Supabase
 * @returns boolean indicating if the user has completed onboarding
 */
export const hasCompletedOnboarding = (user: AppUser | null): boolean => {
  try {
    if (!user?.user_metadata) return false;
    return user.user_metadata.onboarding_completed === true;
  } catch (error) {
    logger.error('Error checking onboarding status', { error, userId: user?.id });
    return false;
  }
};
