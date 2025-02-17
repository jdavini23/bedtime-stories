'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';
import { Session } from 'next-auth';

export function useSession() {
  const { data: session, status, update } = useNextAuthSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  return {
    session,
    isLoading,
    isAuthenticated,
    update,
  } as const;
}
