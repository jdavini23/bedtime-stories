// Middleware for Clerk authentication
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtected = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/settings(.*)',
  '/admin(.*)',
  '/middleware-test(.*)',
  '/story(.*)',
]);

// Export the middleware function
export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    try {
      // Use auth.protect() to automatically handle authentication
      await auth.protect();
    } catch (error) {
      console.error(`Authentication error: ${(error as Error).message}`);
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  return NextResponse.next();
});

// Export the config for Next.js
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
