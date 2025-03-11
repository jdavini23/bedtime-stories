import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/api/story/generate', '/api/gemini'],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ['/api/webhook', '/_next/static/(.*)', '/favicon.ico', '/api/health'],
  debug: process.env.NODE_ENV === 'development',
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
