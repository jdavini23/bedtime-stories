// src/middleware.ts
import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// Export the middleware
export default authMiddleware({
  // Define public routes that don't require authentication
  publicRoutes: [
    "/", 
    "/sign-in(.*)", 
    "/sign-up(.*)", 
    "/api/(.*)?",
    "/middleware-test"
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
    
    // Allow the request to proceed
    return NextResponse.next();
  }
});

// Configure middleware matcher
export const config = {
  matcher: ['/((?!.+\\.[a-zA-Z0-9]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
