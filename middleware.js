// Root middleware for Clerk authentication
import { clerkMiddleware } from '@clerk/nextjs/server';

// Export the middleware function
export default clerkMiddleware();

// Export the config for Next.js
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
