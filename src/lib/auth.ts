import { clerkClient } from '@clerk/nextjs/server';
import { logger } from '@/utils/loggerInstance';

// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/api/story',
  '/api/webhook/clerk',
];

export const ignoredRoutes = ['/about', '/contact', '/_next/static', '/favicon.ico'];

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

// Helper functions for Clerk authentication
export const getUser = async (userId: string | null) => {
  try {
    if (!userId) return null;
    const user = await clerkClient.users.getUser(userId);
    return user;
  } catch (error) {
    logger.error('Error fetching user:', { error });
    return null;
  }
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
