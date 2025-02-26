import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { securityHeaders } from '@/middleware/securityHeaders';
import { securityMonitoring } from '@/middleware/securityMonitoring';

type Route = {
  path: string;
  exact?: boolean;
};

// Public routes that don't require authentication
const publicRoutes: Route[] = [
  { path: '/', exact: true },
  { path: '/sign-in', exact: true },
  { path: '/sign-up', exact: true },
  { path: '/api/webhook/clerk', exact: true },
  { path: '/story', exact: true },
];

// Routes that can be accessed while signed in or not
const ignoredRoutes: Route[] = [
  { path: '/about', exact: true },
  { path: '/contact', exact: true },
  { path: '/_next/static' },
  { path: '/favicon.ico', exact: true },
];

const isRouteMatch = (route: Route, path: string): boolean => {
  if (route.exact) {
    return route.path === path;
  }
  return path.startsWith(route.path);
};

const isDevelopmentApiRoute = (path: string): boolean => {
  return env.NODE_ENV === 'development' && path.startsWith('/api/');
};

const createSignInUrl = (request: NextRequest): URL => {
  const signInUrl = new URL('/sign-in', request.url);
  signInUrl.searchParams.set('redirect_url', request.url);
  return signInUrl;
};

export default authMiddleware({
  publicRoutes: publicRoutes.map((route) => route.path),
  ignoredRoutes: ignoredRoutes.map((route) => route.path),
  debug: env.NODE_ENV === 'development',
  beforeAuth: (request) => {
    // Apply security monitoring first
    const monitoringResponse = securityMonitoring(request);

    // If monitoring blocked the request, return that response
    if (monitoringResponse.status !== 200) {
      return monitoringResponse;
    }

    // Apply security headers
    const securityResponse = securityHeaders(request);
    const headers = new Headers(securityResponse.headers);

    // Add CORS headers for API routes
    const path = request.nextUrl.pathname;
    if (path.startsWith('/api/')) {
      // Handle OPTIONS requests for CORS
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-clerk-auth-token',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      // Add CORS headers to non-OPTIONS requests
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, x-clerk-auth-token'
      );
    }

    if (env.NODE_ENV === 'development') {
      const testUserId = request.headers.get('x-test-user-id') || 'dev-default-user';
      headers.set('x-clerk-auth-user-id', testUserId);
      headers.set('x-clerk-auth-session-id', `dev-session-${testUserId}`);
      return NextResponse.next({
        request: {
          headers,
        },
      });
    }
    return NextResponse.next({
      request: {
        headers,
      },
    });
  },
  afterAuth: (auth, request) => {
    const { userId } = auth;
    const path = request.nextUrl.pathname;

    // Always allow API routes during development
    if (isDevelopmentApiRoute(path)) {
      return NextResponse.next();
    }

    // Check if the route is public or ignored
    if (
      publicRoutes.some((route) => isRouteMatch(route, path)) ||
      ignoredRoutes.some((route) => isRouteMatch(route, path))
    ) {
      return NextResponse.next();
    }

    // If the user is not signed in and the route is protected, redirect to sign-in
    if (!userId) {
      // For API routes, return 401 instead of redirecting
      if (path.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({
            error: 'Unauthorized',
            message: 'Authentication required',
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
      return NextResponse.redirect(createSignInUrl(request));
    }

    return NextResponse.next();
  },
});

// See: https://clerk.com/docs/references/nextjs/auth-middleware
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
