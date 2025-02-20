import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';

export { useClerkAuth };

export function useAuth() {
  const { user } = useUser();
  const { isSignedIn, sessionId, userId } = useClerkAuth();

  return {
    user: {
      id: userId,
      name: user?.fullName || user?.firstName || 'User',
      email: user?.primaryEmailAddress?.emailAddress,
      image: user?.imageUrl,
    },
    isAuthenticated: isSignedIn,
    sessionId,
  };
}

export function useSignOut() {
  const { signOut } = useClerkAuth();

  return async () => {
    await signOut();
  };
}
