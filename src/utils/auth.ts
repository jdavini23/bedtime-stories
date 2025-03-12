import { User } from '@supabase/supabase-js';

type AppMetadata = {
  role?: string;
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
  if (!user) return false;

  // Check user metadata for admin role
  const metadata = user.user_metadata;
  if (!metadata) return false;

  return metadata.role === 'admin';
};

/**
 * Get the display name for a user
 * @param user The user object from Supabase
 * @returns string The user's display name or a default value
 */
export const getUserDisplayName = (user: AppUser | null): string => {
  if (!user) return 'Guest';

  // Try to get the name from user metadata
  const metadata = user.user_metadata;
  if (metadata?.full_name) return metadata.full_name;
  if (metadata?.name) return metadata.name;

  // Fall back to email if available
  if (user.email) return user.email.split('@')[0];

  // Final fallback
  return 'User';
};

/**
 * Check if a user has a verified email
 * @param user The user object from Supabase
 * @returns boolean indicating if the user has a verified email
 */
export const hasVerifiedEmail = (user: AppUser | null): boolean => {
  if (!user) return false;
  return user.email_confirmed_at !== null;
};

/**
 * Get the user's email address
 * @param user The user object from Supabase
 * @returns string The user's email address or null
 */
export const getUserEmail = (user: AppUser | null): string | null => {
  if (!user) return null;
  return user.email || null;
};

/**
 * Check if the user has completed onboarding
 * @param user The user object from Supabase
 * @returns boolean indicating if the user has completed onboarding
 */
export const hasCompletedOnboarding = (user: AppUser | null): boolean => {
  if (!user) return false;
  return user.user_metadata?.onboarding_completed === true;
};
