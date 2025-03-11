// src/middleware.ts
import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/sign-in', '/sign-up', '/api/webhook', '/api/gemini'],

  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ['/api/public(.*)'],

  // Debug mode
  debug: process.env.NODE_ENV === 'development',

  // Custom authentication for API routes
  async afterAuth(auth, req) {
    console.log('🔍 Middleware - Starting authentication check');
    console.log('🔍 Auth object:', {
      hasUserId: !!auth?.userId,
      hasSessionId: !!auth?.sessionId,
      hasSession: !!auth?.session,
      sessionClaims: auth?.sessionClaims,
    });

    // Get the pathname of the request
    const path = new URL(req.url).pathname;
    console.log('🔍 Request path:', path);

    // For API routes, check both clerk auth and API key
    if (path.startsWith('/api/')) {
      console.log('🔍 Processing API route');
      const authHeader = req.headers.get('authorization');
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      // Log authentication details in development
      console.log('🔍 API Authentication:', {
        path,
        hasAuthHeader: !!authHeader,
        authHeaderType: authHeader?.split(' ')[0],
        isValidAuthHeader: authHeader?.startsWith('Bearer '),
        isValidApiKey: authHeader?.split(' ')[1] === apiKey,
        hasUserId: !!auth.userId,
        hasSession: !!auth.sessionId,
        headers: Object.fromEntries(req.headers.entries()),
      });

      // Allow access if either clerk auth or valid API key is present
      if (
        auth.userId ||
        (authHeader?.startsWith('Bearer ') && authHeader.split(' ')[1] === apiKey)
      ) {
        console.log('🔍 Authentication successful:', {
          method: auth.userId ? 'clerk' : 'api_key',
          userId: auth.userId,
        });
        return NextResponse.next();
      }

      console.log('🔍 Authentication failed - returning 401');
      // If no valid authentication, return 401
      return new NextResponse(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Valid authentication required',
          debug: {
            hasAuthHeader: !!authHeader,
            hasUserId: !!auth.userId,
            hasValidApiKey: authHeader?.split(' ')[1] === apiKey,
          },
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    }

    // For non-API routes that aren't public, require Clerk authentication
    if (!auth.userId && !path.startsWith('/api/')) {
      const isPublicRoute = ['/'].some((publicPath) => path.startsWith(publicPath));
      if (!isPublicRoute) {
        console.log('🔍 Non-API route requires authentication');
        return new NextResponse(
          JSON.stringify({
            error: 'Unauthorized',
            message: 'Authentication required',
          }),
          {
            status: 401,
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      }
    }

    console.log('🔍 Middleware - Authentication check complete');
    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    // Protect all routes including api/trpc
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
