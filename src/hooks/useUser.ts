'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Our application's User type
export interface User {
  createdAt: number;
  lastSignInAt: number;
  emailAddresses: any;
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  isAdmin?: boolean;
}

/**
 * Custom hook that provides user authentication state and methods
 */
export function useUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    isLoading,
    signOut,
  };
}
