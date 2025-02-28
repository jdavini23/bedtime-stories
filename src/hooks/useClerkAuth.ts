import { useUser, useAuth as useClerkAuth, useSessionList } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';

export { useClerkAuth };

interface AuthState {
  user: {
    id: string | null;
    name: string;
    email: string | null;
    image: string | null;
  };
  isAuthenticated: boolean;
  sessionId: string | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAuth(): AuthState {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, sessionId, userId, isLoaded: authLoaded } = useClerkAuth();
  const { sessions } = useSessionList();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userLoaded && authLoaded) {
      setIsLoading(false);
    }
  }, [userLoaded, authLoaded]);

  return {
    user: {
      id: userId,
      name: user?.fullName || user?.firstName || 'User',
      email: user?.primaryEmailAddress?.emailAddress || null,
      image: user?.imageUrl || null,
    },
    isAuthenticated: isSignedIn,
    sessionId,
    isLoading,
    error,
  };
}

export function useSignOut() {
  const { signOut } = useClerkAuth();

  return useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }, [signOut]);
}
