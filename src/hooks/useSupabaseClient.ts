'use client';

import { useSupabase } from '@/providers/SupabaseAuthProvider';

/**
 * Hook to get the Supabase client from the auth provider
 * @returns Supabase client and loading state
 */
export function useSupabaseClient() {
  const { supabase, loading, error } = useSupabase();
  return { supabase, loading, error };
}
