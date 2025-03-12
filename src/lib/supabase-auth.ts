import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logger } from '@/utils/logger';

/**
 * Creates an authenticated Supabase client using the current user's session
 * @returns Authenticated Supabase client
 */
export async function createAuthenticatedSupabaseClient(request = null) {
  try {
    // Get auth session
    const session = await getServerSession();

    if (!session?.userId) {
      throw new Error('No authenticated session available');
    }

    logger.info('Debug: auth session', {
      hasSession: !!session,
      hasUserId: !!session.userId,
      sessionType: typeof session,
      sessionKeys: Object.keys(session),
    });

    // Get the Supabase JWT from the session
    let supabaseAccessToken: string | null = null;
    try {
      // Try getting token with debug info
      logger.info('Debug: attempting to get token', {
        hasGetToken: typeof session.getToken === 'function',
        sessionMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(session)),
      });

      supabaseAccessToken = await session.getAccessToken({
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
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
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

export async function getServerSession() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    logger.error('Error getting session:', error as Record<string, unknown>);
    return null;
  }

  return session;
}

export async function getServerUser() {
  const session = await getServerSession();
  return session?.user || null;
}

export async function isUserAdmin() {
  const user = await getServerUser();
  return user?.user_metadata?.role === 'admin';
}

export async function getSupabaseClient(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      logger.warn('No authenticated user found');
      throw new Error('Not authenticated');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      logger.error('Missing Supabase environment variables');
      throw new Error('Missing required environment variables');
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
      },
    });

    return supabase;
  } catch (error) {
    logger.error('Error creating Supabase client:', error as Record<string, unknown>);
    throw error;
  }
}
