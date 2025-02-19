import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const isAuthPage = path === '/auth/signin';
    const isCallbackPage = path.startsWith('/api/auth/callback');

    // Allow callback URLs to pass through
    if (isCallbackPage) {
      return NextResponse.next();
    }

    // If user is authenticated and tries to access login page,
    // redirect them to dashboard
    if (isAuthPage && req.nextauth.token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Always allow access to auth-related paths
        if (
          path === '/auth/signin' ||
          path.startsWith('/api/auth/')
        ) {
          return true;
        }

        // Require authentication for all other protected routes
        return !!token;
      }
    }
  }
);

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/stories/:path*',
    '/profile/:path*',
    '/generate/:path*',
    '/auth/signin',
    '/api/auth/callback/:path*'
  ]
};
