import { clerkClient } from '@clerk/nextjs/server';
import { logger } from '@/utils/loggerInstance';

// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export const publicRoutes = ['/', '/sign-in', '/sign-up', '/api/story', '/api/webhook/clerk'];

export const ignoredRoutes = ['/about', '/contact', '/_next/static', '/favicon.ico'];

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

// Helper functions for Clerk authentication
interface UserMetadata {
  firstName?: string;
  lastName?: string;
  email?: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
  };
}

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

    const user = await clerkClient.users.getUser(userId);
    if (!user) {
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
    const users = await clerkClient.users.getUserList({});
    return users;
  } catch (error: unknown) {
    logger.error('Error fetching users:', { error });
    return [];
  }
};
