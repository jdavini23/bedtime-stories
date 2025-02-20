import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/lib/env';

type Route = {
  path: string;
  exact?: boolean;
};

// Public routes that don't require authentication
const publicRoutes: Route[] = [
  { path: '/', exact: true },
  { path: '/auth/signin', exact: true },
  { path: '/auth/signup', exact: true },
  { path: '/api/webhook/clerk', exact: true },
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
  const signInUrl = new URL('/auth/signin', request.url);
  signInUrl.searchParams.set('redirect_url', request.url);
  return signInUrl;
};

export default withClerkMiddleware((request: NextRequest) => {
  // Development authentication override
  if (env.NODE_ENV === 'development') {
    const testUserId = request.headers.get('x-test-user-id') || 'dev-default-user';

    // Simulate Clerk authentication for development
    request.headers.set('x-clerk-auth-user-id', testUserId);
    request.headers.set('x-clerk-auth-session-id', `dev-session-${testUserId}`);
  }

  const { userId } = getAuth(request);
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
    return NextResponse.redirect(createSignInUrl(request));
  }

  return NextResponse.next();
});

// See: https://clerk.com/docs/references/nextjs/auth-middleware
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
