import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logger } from '@/utils/loggerInstance';

// See https://supabase.com/docs/guides/auth/auth-helpers/nextjs for more information about configuring your middleware
export const publicRoutes = ['/', '/sign-in', '/sign-up', '/api/story'];

export const ignoredRoutes = ['/about', '/contact', '/_next/static', '/favicon.ico'];

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

// Helper functions for Supabase authentication
export interface AuthError extends Error {
  code?: string;
  statusCode?: number;
}

export const getUser = async (userId: string | null) => {
  try {
    if (!userId) {
      logger.warn('No user ID provided');
      return null;
    }

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
      data: { user },
      error,
    } = await supabase.auth.admin.getUserById(userId);
    if (error || !user) {
      logger.warn('User not found:', { userId });
      return null;
    }

    return user;
  } catch (error) {
    const authError = error as AuthError;
    logger.error('Error fetching user:', {
      error: authError,
      userId,
      code: authError.code,
      statusCode: authError.statusCode,
    });
    throw new Error('Failed to fetch user data');
  }
};

export const handleAuthError = (error: unknown): AuthError => {
  const authError = error as AuthError;
  logger.error('Authentication error:', {
    message: authError.message,
    code: authError.code,
    statusCode: authError.statusCode,
  });
  return authError;
};

export const getUserList = async () => {
  try {
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
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers();
    if (error) {
      throw error;
    }
    return users;
  } catch (error: unknown) {
    logger.error('Error fetching users:', { error });
    return [];
  }
};
