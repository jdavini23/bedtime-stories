'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Our application's User type aligned with Supabase
export interface User extends SupabaseUser {
  metadata: {
    firstName?: string;
    lastName?: string;
    isAdmin?: boolean;
  };
}

/**
 * Custom hook that provides user authentication state and methods
 * @returns Authentication state and methods
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error);
          if (mounted) {
            setUser(null);
            setIsLoaded(true);
          }
          return;
        }

        if (mounted) {
          setUser((session?.user as User) ?? null);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Unexpected error during session fetch:', error);
        if (mounted) {
          setUser(null);
          setIsLoaded(true);
        }
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setUser((session?.user as User) ?? null);
        setIsLoaded(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      throw error;
    }
  };

  return {
    user,
    isLoaded,
    isSignedIn: !!user,
    signOut,
  };
}
