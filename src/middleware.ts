import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes
const protectedPaths = ['/dashboard', '/admin', '/api/story'];
// Auth routes
const authPaths = ['/sign-in', '/sign-up'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));
  // Auth routes
  const isAuthPath = authPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  // Redirect if accessing auth routes while logged in
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect if accessing protected routes while logged out
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
