import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedPaths = ['/dashboard', '/admin', '/api/story', '/settings', '/profile'];

// Auth routes that should NEVER be redirected
const authPaths = [
  '/auth/login', 
  '/auth/signup', 
  '/auth/forgot-password',
  '/auth/callback', // Critical: NEVER redirect the callback
  '/auth/reset-password',
];

// Legacy routes to redirect to new auth paths
const legacyAuthPaths: Record<string, string> = {
  '/login': '/auth/login',
  '/sign-in': '/auth/login',
  '/signin': '/auth/login',
  '/signup': '/auth/signup',
  '/sign-up': '/auth/signup',
};

// Paths that should bypass auth checks entirely
const bypassPaths = [
  '/_next',
  '/favicon.ico',
  '/api/auth',
  '/static',
  '/images',
  '/public',
  '/assets',
  '/debug', // Add a debug path for testing
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // DEBUG LOGGING
  console.log(`[Middleware] Processing request for: ${pathname}`);
  
  // Check for port mismatch in the request
  const host = request.headers.get('host') || '';
  const referer = request.headers.get('referer') || '';
  console.log(`[Middleware] Host: ${host}, Referer: ${referer}`);
  
  // Log cookies in a safe way (not showing values)
  const cookieHeader = request.headers.get('cookie') || '';
  const cookieNames = cookieHeader
    .split(';')
    .map(cookie => cookie.trim().split('=')[0])
    .filter(Boolean);
  console.log(`[Middleware] Cookie names present: ${JSON.stringify(cookieNames)}`);
  
  // STEP 1: Skip middleware entirely for bypassed paths
  if (bypassPaths.some(path => pathname.startsWith(path))) {
    console.log(`[Middleware] Bypassing auth check for: ${pathname}`);
    return NextResponse.next();
  }
  
  // STEP 2: Handle legacy route redirects
  const legacyRedirect = legacyAuthPaths[pathname];
  if (legacyRedirect) {
    console.log(`[Middleware] Redirecting legacy path: ${pathname} -> ${legacyRedirect}`);
    const url = new URL(legacyRedirect, request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }
  
  // STEP 3: CRITICAL - Never redirect auth paths
  if (authPaths.some(path => pathname.startsWith(path))) {
    console.log(`[Middleware] Auth path detected, skipping redirect: ${pathname}`);
    return NextResponse.next();
  }
  
  // STEP 4: Only check auth for protected paths
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  if (!isProtectedPath) {
    console.log(`[Middleware] Non-protected path, skipping auth check: ${pathname}`);
    return NextResponse.next();
  }
  
  // STEP 5: Initialize response and Supabase client
  const res = NextResponse.next();
  
  try {
    // Create Supabase client
    console.log(`[Middleware] Creating Supabase client for: ${pathname}`);
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Get session without refreshing to avoid potential redirect loops
    console.log(`[Middleware] Checking session for: ${pathname}`);
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error(`[Middleware] Session error: ${error.message}`);
    }
    
    // Log session status without exposing sensitive data
    console.log(`[Middleware] Session exists: ${!!session}, User ID: ${session?.user?.id ? 'present' : 'none'}`);
    
    // STEP 6: Only redirect if no session and on protected path
    if (!session && isProtectedPath) {
      // Redirect to login
      console.log(`[Middleware] No session for protected path, redirecting to login: ${pathname}`);
      const redirectUrl = new URL('/auth/login', request.url);
      
      // Store original URL for post-login redirect (but sanitize it)
      const sanitizedPath = pathname.replace(/[^\w\-/?=&%]/g, '');
      redirectUrl.searchParams.set('redirect_url', sanitizedPath);
      
      return NextResponse.redirect(redirectUrl);
    }
    
    console.log(`[Middleware] Request proceeding normally for: ${pathname}`);
    return res;
  } catch (err) {
    // On error, allow the request to proceed but log the error
    console.error(`[Middleware] Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return NextResponse.next();
  }
}

// Exclude static assets from middleware processing
export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets and files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|images|public|.*\\..*$).*)',
  ],
};
