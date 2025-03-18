/**
 * Supabase Authentication Utilities
 * 
 * This file provides robust authentication utilities for Supabase,
 * implementing defensive programming strategies and security best practices.
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type SupabaseClient } from '@supabase/supabase-js';
import { clearCookiesByPrefix } from './cookies';

// Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Singleton instance tracking
let nextSupabaseClientInstance: SupabaseClient | null = null;
let instanceCount = 0;

/**
 * Creates a Supabase client using Next.js auth helpers
 * This is the preferred method for client components
 * Also implements singleton pattern
 */
export function createNextSupabaseClient(): SupabaseClient {
  // If we already have an instance, return it
  if (nextSupabaseClientInstance) {
    return nextSupabaseClientInstance;
  }
  
  instanceCount++;
  console.log(`[Auth] Creating Next.js Supabase client (instance #${instanceCount})`);
  
  try {
    // Create the client with Next.js auth helpers
    nextSupabaseClientInstance = createClientComponentClient();
    
    // Get the current host to ensure we're using the correct URL for auth redirects
    let authRedirectUrl2 = '';
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const host = window.location.host;
      authRedirectUrl2 = `${protocol}//${host}`;
      console.log(`[Auth] Setting redirect base URL to: ${authRedirectUrl2}`);
    }
    
    return nextSupabaseClientInstance;
  } catch (err) {
    console.error('[Auth] Error creating Next.js Supabase client:', err);
    throw err;
  }
}

/**
 * Safe method to get a user session with defensive error handling
 * Returns null instead of throwing errors
 */
export async function safeGetSession(supabase: SupabaseClient) {
  try {
    console.log('[Auth] Getting session');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[Auth] Session error:', error.message);
      return { user: null, session: null, error };
    }

    console.log('[Auth] safeGetSession data:', data);
    
    if (!data.session) {
      console.log('[Auth] No session found');
      return { user: null, session: null, error: null };
    }
    
    if (!data.session.user) {
      console.log('[Auth] Session exists but no user');
      return { user: null, session: data.session, error: null };
    }
    
    console.log('[Auth] Session found for user:', data.session.user.id);
    return { user: data.session.user, session: data.session, error: null };
  } catch (err) {
    console.error('[Auth] Unexpected error getting session:', err);
    return { user: null, session: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Safe method to sign in with password
 * Implements defensive error handling
 */
export async function safeSignInWithPassword(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  try {
    console.log('[Auth] Signing in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('[Auth] Sign in error:', error.message);
      return { user: null, session: null, error };
    }
    
    if (!data.user || !data.session) {
      console.error('[Auth] Sign in succeeded but no user or session returned');
      return { 
        user: null, 
        session: null, 
        error: new Error('Sign in succeeded but no user or session returned') 
      };
    }
    
    console.log('[Auth] User signed in successfully:', data.user.id);
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    console.error('[Auth] Unexpected error during sign in:', err);
    return { user: null, session: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Safe method to sign up with password
 * Implements defensive error handling
 */
export async function safeSignUp(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  try {
    console.log('[Auth] Signing up user:', email);
    
    // Get the current host to ensure we're using the correct URL for auth redirects
    let authRedirectUrl = '';
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const host = window.location.host;
      authRedirectUrl = `${protocol}//${host}/auth/callback`;
      console.log(`[Auth] Setting redirect URL to: ${authRedirectUrl}`);
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('[Auth] Sign up error:', error.message);
      return { user: null, session: null, error };
    }
    
    if (!data.user) {
      console.error('[Auth] Sign up succeeded but no user returned');
      return { 
        user: null, 
        session: null, 
        error: new Error('Sign up succeeded but no user returned') 
      };
    }
    
    console.log('[Auth] User signed up successfully:', data.user.id);
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    console.error('[Auth] Unexpected error during sign up:', err);
    return { user: null, session: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Safe method to sign out
 * Implements defensive error handling
 */
export async function safeSignOut(supabase: SupabaseClient) {
  try {
    console.log('[Auth] Signing out user');
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[Auth] Sign out error:', error.message);
      return { error };
    }
    
    // Clear any Supabase cookies
    if (typeof document !== 'undefined') {
      console.log('[Auth] Clearing Supabase cookies');
      clearCookiesByPrefix('sb-');
    }
    
    // Clear any Supabase items from localStorage
    if (typeof localStorage !== 'undefined') {
      console.log('[Auth] Clearing Supabase localStorage items');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }
    }
    
    console.log('[Auth] User signed out successfully');
    return { error: null };
  } catch (err) {
    console.error('[Auth] Unexpected error during sign out:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}
