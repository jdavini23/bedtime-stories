import { NextRequest, NextResponse } from 'next/server';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/stories',
  '/profile',
  '/generate'
];

// Routes that should redirect authenticated users
const AUTH_ROUTES = [
  '/auth/signin',
  '/auth/signup'
];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get('firebaseToken')?.value;

  // Check if the current route is an authentication route
  const isAuthRoute = AUTH_ROUTES.some(route => path.startsWith(route));
  
  // Check if the current route is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route));

  // If no token exists and trying to access a protected route, redirect to signin
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // If authenticated user tries to access auth routes, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/stories/:path*', 
    '/profile/:path*', 
    '/generate/:path*',
    '/auth/signin', 
    '/auth/signup'
  ]
};
