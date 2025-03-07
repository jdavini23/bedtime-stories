import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/nextjs/server';
import { logger } from '@/utils/logger';

/**
 * Creates an authenticated Supabase client using the current user's session
 * @returns Authenticated Supabase client
 */
export async function createAuthenticatedSupabaseClient(request = null) {
  try {
    // Get auth session
    const session = getAuth(request);

    if (!session?.userId) {
      throw new Error('No authenticated session available');
    }

    logger.info('Debug: auth session', {
      hasSession: !!session,
      hasUserId: !!session.userId,
      sessionType: typeof session,
      sessionKeys: Object.keys(session),
    });

    // Get the Supabase JWT from Clerk
    let supabaseAccessToken: string | null = null;
    try {
      // Try getting token with debug info
      logger.info('Debug: attempting to get token', {
        hasGetToken: typeof session.getToken === 'function',
        sessionMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(session)),
      });

      supabaseAccessToken = await session.getToken({
        template: 'supabase-auth',
      });

      logger.info('Debug: token result', {
        hasToken: !!supabaseAccessToken,
        tokenLength: supabaseAccessToken?.length || 0,
      });
    } catch (tokenError) {
      logger.error('Error getting Supabase token', {
        error:
          tokenError instanceof Error
            ? {
                message: tokenError.message,
                name: tokenError.name,
                stack: tokenError.stack,
              }
            : tokenError,
        hint: 'Verify JWT template exists and is named exactly "supabase-auth"',
      });
      throw new Error(
        `Failed to get Supabase access token: ${tokenError instanceof Error ? tokenError.message : String(tokenError)}`
      );
    }

    if (!supabaseAccessToken) {
      throw new Error('No Supabase access token available');
    }

    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Create authenticated client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

    return supabase;
  } catch (error) {
    logger.error('Error creating authenticated Supabase client', {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              type: error.constructor.name,
            }
          : error,
    });
    throw error;
  }
}
