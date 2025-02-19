'use client';

import { useAuth, useUser } from '@clerk/nextjs';

export const useClientAuth = () => {
  const { user } = useUser();
  const { getToken, userId } = useAuth();

  const currentUser = user ? {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: user.firstName ? `${user.firstName} ${user.lastName}` : undefined,
    image: user.imageUrl,
  } : null;

  return {
    currentUser,
    getToken,
    userId,
  };
};
