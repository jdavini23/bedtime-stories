'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

/**
 * Hook to create and manage a Supabase client
 * @returns Supabase client and loading state
 */
export function useSupabaseClient() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient<any, "public", any>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initializeSupabase() {
      try {
        // Validate environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase environment variables');
        }

        // Create client with anon key
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
          }
        });

        setSupabase(client);
        setError(null);
      } catch (err) {
        logger.error('Error creating Supabase client', {
          error:
            err instanceof Error
              ? {
                  message: err.message,
                  stack: err.stack,
                  type: err.constructor.name,
                }
              : err,
        });
        setSupabase(null);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    initializeSupabase();
  }, []);

  return { supabase, loading, error };
}
