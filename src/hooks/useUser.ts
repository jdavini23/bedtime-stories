import { useUser as useClerkUser } from '@clerk/nextjs';
import type { User as ClerkUser } from '@clerk/nextjs/server';
import { isAdmin } from '../utils/auth';

interface User extends ClerkUser {
  isAdmin?: boolean;
}

export const useUser = () => {
  const { isLoaded, isSignedIn, user } = useClerkUser();

  const extendedUser: User | null = user
    ? {
        ...user,
        isAdmin: isAdmin(user),
      }
    : null;

  return {
    isLoaded,
    isSignedIn,
    user: extendedUser,
  };
};
