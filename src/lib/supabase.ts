import { createClient } from '@supabase/supabase-js';

// For client-side usage
export const createSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Note: Server-side implementation will be added later
// This is a placeholder for future implementation
export const createServerSupabaseClient = () => {
  console.warn('Server-side Supabase client not fully implemented yet');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
