'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { createClient, User, Session, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { logger } from '@/utils/logger';

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

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Create the context with default values
const SupabaseContext = createContext<SupabaseContextType>({
  supabase,
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
  logger.info('useSupabase hook called', {
    hasContext: !!context,
    loading: context.loading,
    hasUser: !!context.user,
  });
  return context;
};

// Provider component
export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  logger.info('SupabaseAuthProvider initializing');

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  // Setup auth state listener
  useEffect(() => {
    try {
      logger.info('Setting up auth state listener');

      // Setup auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        logger.info('Auth state changed', { event, hasSession: !!session });
        setUser(session?.user || null);
        setLoading(false);
        router.refresh();
      });

      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        logger.info('Initial session retrieved', { hasSession: !!session });
        setUser(session?.user || null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error initializing Supabase');
      logger.error('Error initializing Supabase client', {
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
      setError(error);
      setLoading(false);
    }
  }, [router]);

  // Authentication methods
  async function signIn(email: string, password: string) {
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return {
        user: data?.user || null,
        session: data?.session || null,
        error: authError ? new Error(authError.message) : null,
      };
    } catch (err) {
      logger.error('Sign in error', { error: err });
      return {
        user: null,
        session: null,
        error: err instanceof Error ? err : new Error('Unknown error during sign in'),
      };
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      return {
        user: data?.user || null,
        session: data?.session || null,
        error: authError ? new Error(authError.message) : null,
      };
    } catch (err) {
      logger.error('Sign up error', { error: err });
      return {
        user: null,
        session: null,
        error: err instanceof Error ? err : new Error('Unknown error during sign up'),
      };
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      logger.error('Sign out error', { error: err });
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
