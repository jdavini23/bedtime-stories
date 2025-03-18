'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import {
  User,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { clearCookiesByPrefix } from '@/utils/cookies';
import {
  safeSignInWithPassword, 
  safeSignUp, 
  safeSignOut
} from '@/utils/supabaseAuth';
import { useRouter } from 'next/navigation';

// Define the context types
type SupabaseContextType = {
  supabase: SupabaseClient;
  user: User | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; session: Session | null; error: Error | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; session: Session | null; error: Error | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: Error | null;
};

// Create the context with default values
const SupabaseContext = createContext<SupabaseContextType>({
  supabase: createClientComponentClient(),
  user: null,
  signIn: async () => ({ user: null, session: null, error: null }),
  signUp: async () => ({ user: null, session: null, error: null }),
  signOut: async () => {},
  loading: true,
  error: null,
});

// Hook to use the Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseAuthProvider');
  }
  return context;
};

// Provider component
export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use our enhanced Supabase client with robust cookie handling
  const [supabase, setSupabase] = useState(createClientComponentClient());
  const router = useRouter();

  // Clear legacy auth cookies on mount (only once)
  useEffect(() => {
    // Clear any Clerk cookies that might be causing conflicts
    console.log('[Auth] Clearing legacy Clerk cookies on mount');
    clearCookiesByPrefix('__clerk');
    clearCookiesByPrefix('__session');
    
    // Log all cookies for debugging
    if (typeof document !== 'undefined') {
      console.log('[Auth] Current cookies:', document.cookie);
    }
  }, []);

  // Auth setup - only runs once
  useEffect(() => {
    let mounted = true;
    

    // Function to initialize auth
    const initializeAuth = async () => {
      if (!mounted) return;

      try {
        // Get initial session
        console.log('[Auth] Fetching initial session');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth] Session error:', error.message);
        }

        console.log('[Auth] Initial session data:', session);

        if (mounted) {
          if (session) {
            console.log('[Auth] Session exists, User ID:', session.user?.id);
            setUser(session.user);
          } else {
            console.log('[Auth] No valid session found');
            setUser(null);
          }
          setLoading(false);
        }

        // Setup auth state change listener (only if mounted)
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          console.log('[Auth] Auth state changed:', {
            event,
            hasSession: !!session,
            userId: session?.user?.id || 'none',
            timestamp: new Date().toISOString(),
          });

          console.log('[Auth] Auth state session data:', session);

          setUser(session?.user || null);
          setLoading(false);
        });
      } catch (err) {
        console.error('[Auth] Error initializing auth:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error initializing auth'));
          setLoading(false);
        }
      }
    };

    // Initialize auth
    initializeAuth();

    // Cleanup function
    return () => {
      console.log('[Auth] Cleaning up auth listener');
      mounted = false;
    };
  }, [supabase.auth]);

  // Authentication methods
  async function signIn(email: string, password: string) {
    console.log('[Auth] Attempting sign in:', { email });
    try {
      // Clear any legacy cookies before sign in
      console.log('[Auth] Clearing legacy cookies before sign in');
      clearCookiesByPrefix('__clerk');
      clearCookiesByPrefix('__session');

      const { user: authUser, session, error: authError } =
        await safeSignInWithPassword(supabase, email, password);

      console.log('[Auth] Sign in result:', {
        success: !authError,
        hasUser: !!authUser,
        hasSession: !!session,
        timestamp: new Date().toISOString(),
      });

      if (authError) throw authError;

      const result = {
        user: authUser,
        session,
        error: null,
      };

      router.push('/dashboard');
      return result;
    } catch (err) {
      console.error('[Auth] Sign in error:', err instanceof Error ? err.message : 'Unknown error');
      return {
        user: null,
        session: null,
        error: err instanceof Error ? err : new Error('Unknown error during sign in'),
      };
    }
  }

  async function signUp(email: string, password: string) {
    console.log('[Auth] Attempting sign up:', { email });
    try {
      // Clear any legacy cookies before sign up
      console.log('[Auth] Clearing legacy cookies before sign up');
      clearCookiesByPrefix('__clerk');
      clearCookiesByPrefix('__session');
      
      const { user: authUser, session, error: authError } =
        await safeSignUp(supabase, email, password);

      console.log('[Auth] Sign up result:', {
        success: !authError,
        hasUser: !!authUser,
        hasSession: !!session,
        timestamp: new Date().toISOString(),
      });

      if (authError) throw authError;

      router.push('/auth/verify-email');

      return {
        user: authUser,
        session,
        error: null,
      };
    } catch (err) {
      console.error('[Auth] Sign up error:', err instanceof Error ? err.message : 'Unknown error');
      return {
        user: null,
        session: null,
        error: err instanceof Error ? err : new Error('Unknown error during sign up'),
      };
    }
  }

  async function signOut() {
    console.log('[Auth] Attempting sign out');
    try {
      // Clear any legacy cookies during sign out
      console.log('[Auth] Clearing legacy cookies during sign out');
      clearCookiesByPrefix('__clerk');
      clearCookiesByPrefix('__session');
      
      const { error: signOutError } = await safeSignOut(supabase);
      
      if (signOutError) {
        throw signOutError;
      }
      
      console.log('[Auth] Sign out successful');
      // No navigation - let middleware handle redirects
    } catch (err) {
      console.error('[Auth] Sign out error:', err instanceof Error ? err.message : 'Unknown error');
      throw err instanceof Error ? err : new Error('Unknown error during sign out');
    }
  }

  const value = {
    supabase,
    user,
    signIn,
    signUp,
    signOut,
    loading,
    error,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}
