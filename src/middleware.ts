import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const isAuthPage = path === '/login';

    // If user is authenticated and tries to access login page,
    // redirect them to dashboard
    if (isAuthPage && req.nextauth.token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
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
    '/login'
  ]
};
