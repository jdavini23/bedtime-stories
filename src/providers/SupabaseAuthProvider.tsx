'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { logger } from '@/utils/logger';

// Define the context types
type SupabaseContextType = {
  supabase: ReturnType<typeof createClient> | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: Error | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: Error | null;
};

// Create the context with default values
const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  user: null,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  loading: true,
  error: null,
});

// Hook to use the Supabase context
export const useSupabase = () => useContext(SupabaseContext);

// Provider component
export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  // Initialize Supabase client
  useEffect(() => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
      }

      const client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
      });

      setSupabase(client);

      // Setup auth state listener
      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user || null);
          setLoading(false);

          // Refresh page data when auth state changes
          router.refresh();
        }
      );

      // Get initial session
      client.auth.getSession().then(({ data: { session } }) => {
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
    if (!supabase) throw new Error('Supabase client not initialized');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('Sign in error', { error: err });
      throw err;
    }
  }

  async function signUp(email: string, password: string) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('Sign up error', { error: err });
      throw err;
    }
  }

  async function signOut() {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      logger.error('Sign out error', { error: err });
      throw err;
    }
  }

  // Create the context value
  const value = {
    supabase,
    user,
    signIn,
    signUp,
    signOut,
    loading,
    error,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}