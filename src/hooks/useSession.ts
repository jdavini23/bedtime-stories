import { useAuth } from './useClerkAuth';

export const useSession = () => {
  const { user, isAuthenticated: isSignedIn } = useAuth();

  return {
    data: {
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        : null,
      session: isSignedIn,
    },
    isAuthenticated: isSignedIn,
    session: isSignedIn,
    status: isSignedIn ? 'authenticated' : 'unauthenticated',
  };
};
