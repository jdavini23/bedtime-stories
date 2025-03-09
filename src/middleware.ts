// src/middleware.ts
import { clerkMiddleware, getAuth } from '@clerk/nextjs/server';

// Export the middleware
const middleware = clerkMiddleware((auth, req) => {
  console.log('Middleware running for:', req.url);
  console.log('Auth state:', auth);
});
export default middleware;

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/api/openai(.*)',
    '/api/gemini(.*)',
  ],
};
