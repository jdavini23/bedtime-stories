import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Protected routes
const protectedPaths = ['/dashboard', '/admin', '/api/story'];
// Auth routes
const authPaths = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Protected routes
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  // Auth routes
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // Redirect if accessing auth routes while logged in
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect if accessing protected routes while logged out
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
