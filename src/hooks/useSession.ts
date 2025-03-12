'use client';

import { useState, useEffect } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

/**
 * Hook to manage authentication session with Supabase
 * @returns Session data, authentication status and loading state
 */
export function useSession() {
  const { supabase, loading: clientLoading } = useSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      try {
        if (!supabase || clientLoading) {
          return;
        }

        setIsLoading(true);
        
        // Get the current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          
          logger.info('User authenticated', { 
            userId: currentSession.user.id,
            email: currentSession.user.email
          });
        } else {
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        logger.error('Error getting session', {
          error: error instanceof Error ? error.message : String(error)
        });
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    getSession();

    // Set up auth state listener
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [supabase, clientLoading]);

  return {
    session,
    user,
    isAuthenticated,
    isLoading: isLoading || clientLoading,
  };
}
