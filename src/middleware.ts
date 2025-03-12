import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/story', '/profile', '/admin', '/account'];
// Routes that should redirect to dashboard if user is authenticated
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check auth status
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  const isAuthenticated = !!session;
  const path = req.nextUrl.pathname;
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && AUTH_ROUTES.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && PROTECTED_ROUTES.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, manifest.json, robots.txt (public files)
     * - public files with extensions (static assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|webp)).*)',
  ],
};
