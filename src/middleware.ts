// src/middleware.ts
import { authMiddleware as clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Export the middleware
export default clerkMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/sign-in', '/sign-up', '/api/webhook', '/stories', '/about', '/contact'],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    '/api/health',
    '/_next/static/(.*)',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ],

  // Handle authentication logic
  async afterAuth(auth, req) {
    // Get the pathname from the URL
    const path = req.nextUrl.pathname;

    // Handle unauthenticated users trying to access protected routes
    if (!auth.userId && !auth.isPublicRoute) {
      // Create sign-in URL with redirect back to the requested page
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);

      // Redirect to sign-in page
      return NextResponse.redirect(signInUrl);
    }

    // Handle admin route protection
    if (path.startsWith('/admin') && auth.userId) {
      try {
        // Check if user has admin role (assuming role is stored in publicMetadata)
        const isAdmin = auth.user?.publicMetadata?.isAdmin === true;

        // If not admin, redirect to dashboard
        if (!isAdmin) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        // Handle authentication errors gracefully
        return NextResponse.redirect(new URL('/sign-in?error=auth_error', req.url));
      }
    }

    // For authenticated routes that might need Supabase access
    if (auth.userId && !auth.isPublicRoute) {
      // Get the response
      const response = NextResponse.next();

      try {
        // Get the session token for Supabase
        const { getToken } = auth;
        const supabaseAccessToken = await getToken({ template: 'supabase-auth' });

        if (supabaseAccessToken) {
          // Add the token to a header that our application can access
          // This will be used to initialize Supabase with authentication
          response.headers.set('x-supabase-auth', supabaseAccessToken);
        }
      } catch (error) {
        console.error('Error getting Supabase token:', error);
        // Continue without the token if there's an error
      }

      return response;
    }

    // Allow the request to proceed
    return NextResponse.next();
  },
});

// Configure middleware matcher
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
