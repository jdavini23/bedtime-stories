import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

// Default values for development - ONLY used if environment variables are missing
const FALLBACK_SUPABASE_URL = 'https://your-project.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // This is a placeholder and won't work

/**
 * Get Supabase URL from environment variables with fallback
 * @returns The Supabase URL
 */
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    logger.warn('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables');

    if (process.env.NODE_ENV === 'development') {
      return FALLBACK_SUPABASE_URL;
    }

    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required but not defined');
  }
  return url;
}

/**
 * Get Supabase anonymous key from environment variables with fallback
 * @returns The Supabase anonymous key
 */
function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    logger.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables');

    if (process.env.NODE_ENV === 'development') {
      return FALLBACK_SUPABASE_ANON_KEY;
    }

    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required but not defined');
  }
  return key;
}

/**
 * Create a Supabase client for client-side usage
 * @returns Supabase client
 */
export const createSupabaseClient = () => {
  try {
    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    logger.error('Failed to create Supabase client', { error });

    // In development, return a mock client that won't throw errors but will log them
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Using mock Supabase client for development');
      return createClient(FALLBACK_SUPABASE_URL, FALLBACK_SUPABASE_ANON_KEY);
    }

    throw error;
  }
};

/**
 * Create a Supabase client for server-side usage
 * @returns Supabase client
 */
export const createServerSupabaseClient = () => {
  try {
    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    logger.error('Failed to create server Supabase client', { error });
    throw error;
  }
};
