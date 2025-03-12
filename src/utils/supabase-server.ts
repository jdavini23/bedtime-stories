import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';

/**
 * Creates a Supabase client for server components
 * This function can be used in Server Components, API routes, and Route Handlers
 */
export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  return supabase;
});

/**
 * Creates an admin Supabase client with full database access
 * Should only be used in secure server environments with service role key
 */
export const createAdminSupabaseClient = () => {
  // Validate that service role key is only used on the server
  if (typeof window !== 'undefined') {
    throw new Error('Admin Supabase client cannot be used in browser');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin credentials');
  }

  // Create client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabase;
};

/**
 * Get the current user session on the server
 * Can be used in Server Components, API routes, and Route Handlers
 */
export async function getServerSession() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}

/**
 * Get the current user on the server
 * Can be used in Server Components, API routes, and Route Handlers
 */
export async function getServerUser() {
  const session = await getServerSession();
  return session?.user ?? null;
}

/**
 * Check if a user is authenticated on the server
 * Can be used in Server Components, API routes, and Route Handlers
 */
export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session;
}
