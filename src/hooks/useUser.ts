'use client';

import { useUser as useClerkUser, useAuth } from '@clerk/nextjs';
import { isAdmin } from '@/utils/auth';
import type { User as ClerkUser } from '@clerk/nextjs/server';

// Our application's User type
export interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
  email?: string;
  isAdmin: boolean;
}

/**
 * Custom hook that wraps Clerk's useUser and useAuth hooks
 * to provide a simplified user object with our application's needs
 */
export function useUser() {
  const { isLoaded: isUserLoaded, user: clerkUser } = useClerkUser();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();

  // Only consider loaded when both auth and user are loaded
  const isLoaded = isUserLoaded && isAuthLoaded;

  // Transform Clerk user to our application's User type
  const user: User | null =
    isLoaded && isSignedIn && clerkUser
      ? {
          id: clerkUser.id,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          // Get primary email if available
          email: clerkUser.emailAddresses[0]?.emailAddress,
          // Check if user is admin
          isAdmin: isAdmin(clerkUser as unknown as ClerkUser),
        }
      : null;

  return {
    isLoaded,
    isSignedIn: isLoaded ? !!isSignedIn : false,
    user,
  };
}
