import { useClerkAuth } from './useClerkAuth';

export const useSession = () => {
  const { user, isSignedIn } = useClerkAuth();

  return {
    data: {
      user: user ? {
        id: user.id,
        name: user.fullName,
        email: user.emailAddresses[0]?.emailAddress
      } : null,
      session: isSignedIn
    },
    status: isSignedIn ? 'authenticated' : 'unauthenticated'
  };
};
