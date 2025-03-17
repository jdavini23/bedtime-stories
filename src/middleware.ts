import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedPaths = ['/dashboard', '/admin', '/api/story'];

// Auth routes that should redirect to dashboard if already logged in
const authPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password'];

// Legacy routes to redirect to new auth paths
const legacyAuthPaths = {
  '/login': '/auth/login',
  '/sign-in': '/auth/login',
  '/signin': '/auth/login',
  '/signup': '/auth/signup',
  '/sign-up': '/auth/signup',
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Handle legacy route redirects
  const pathname = request.nextUrl.pathname;
  const legacyRedirect = legacyAuthPaths[pathname as keyof typeof legacyAuthPaths];
  if (legacyRedirect) {
    const url = new URL(legacyRedirect, request.url);
    // Preserve any query parameters
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }

  // Check if Supabase environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not available, just continue without auth checks
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not available. Skipping auth checks.');
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    });

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    // Protected routes
    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );
    // Auth routes
    const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    // Redirect if accessing auth routes while logged in
    if (isAuthPath && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect if accessing protected routes while logged out
    if (isProtectedPath && !session) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect_url', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    // Continue without auth in case of errors
  }

  return response;
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
