'use client';

import { useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

/**
 * Hook to create and manage an authenticated Supabase client
 * @returns Authenticated Supabase client and loading state
 */
export function useSupabaseClient() {
  const { getToken, userId } = useAuth();
  const [supabase, setSupabase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initializeSupabase() {
      try {
        if (!userId) {
          setSupabase(null);
          setError(new Error('No authenticated user'));
          setLoading(false);
          return;
        }

        // Validate environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase environment variables');
        }

        // Get the Supabase JWT from Clerk
        let supabaseAccessToken: string | null = null;
        try {
          supabaseAccessToken = await getToken({
            template: 'supabase-auth',
            skipCache: true, // Force fresh token
          });

          logger.info('Debug: Clerk token generation', {
            hasToken: !!supabaseAccessToken,
            tokenLength: supabaseAccessToken?.length || 0,
          });
        } catch (tokenError) {
          logger.error('Error getting Supabase token', {
            error: tokenError instanceof Error ? tokenError.message : String(tokenError),
          });
          throw new Error('Failed to get Supabase access token');
        }

        if (!supabaseAccessToken) {
          throw new Error('No Supabase access token available');
        }

        // Create authenticated client
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
          global: {
            headers: {
              Authorization: `Bearer ${supabaseAccessToken}`,
            },
          },
        });

        setSupabase(client);
        setError(null);
      } catch (err) {
        logger.error('Error creating authenticated Supabase client', {
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
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    initializeSupabase();
  }, [getToken, userId]);

  return { supabase, loading, error };
}
