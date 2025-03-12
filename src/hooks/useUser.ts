'use client';

import { useEffect, useState } from 'react';
import {
  type User as SupabaseUser,
  type AuthChangeEvent,
  type Session,
} from '@supabase/supabase-js';
import { useSupabase } from '@/providers/SupabaseProvider';

// Our application's User type
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  isAdmin?: boolean;
}

/**
 * Custom hook that wraps Clerk's useUser and useAuth hooks
 * to provide a simplified user object with our application's needs
 */
export function useUser() {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user: supabaseUser },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error.message);
          setUser(null);
          setIsSignedIn(false);
        } else if (supabaseUser) {
          const userData: User = {
            id: supabaseUser.id,
            email: supabaseUser.email ?? undefined,
            // These fields would need to be populated from your user metadata or profiles table
            firstName: supabaseUser.user_metadata?.firstName,
            lastName: supabaseUser.user_metadata?.lastName,
            imageUrl: supabaseUser.user_metadata?.avatar_url,
            isAdmin: supabaseUser.user_metadata?.isAdmin ?? false,
          };
          setUser(userData);
          setIsSignedIn(true);
        }
      } catch (error) {
        console.error('Error in getUser:', error);
        setUser(null);
        setIsSignedIn(false);
      } finally {
        setIsLoaded(true);
      }
    };

    // Get initial user
    getUser();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email ?? undefined,
          firstName: session.user.user_metadata?.firstName,
          lastName: session.user.user_metadata?.lastName,
          imageUrl: session.user.user_metadata?.avatar_url,
          isAdmin: session.user.user_metadata?.isAdmin ?? false,
        };
        setUser(userData);
        setIsSignedIn(true);
      } else {
        setUser(null);
        setIsSignedIn(false);
      }
      setIsLoaded(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    user,
    isLoaded,
    isSignedIn,
  };
}
