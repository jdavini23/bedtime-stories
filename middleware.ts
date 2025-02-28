// Middleware for Clerk authentication (root directory copy)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/admin(.*)",
  "/middleware-test(.*)",
  "/story(.*)",
]);

// Export the middleware function
export default clerkMiddleware(async (auth, req) => {
  console.log(`Middleware running for path: ${req.nextUrl.pathname}`);
  
  if (isProtected(req)) {
    console.log(`Protected route "${req.nextUrl.pathname}" detected - checking auth`);
    try {
      await auth.protect();
      console.log(`User authenticated - access allowed`);
    } catch (error) {
      console.error(`Authentication error: ${(error as Error).message}`);
      console.log(`Request URL: ${req.url}`);
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
  
  console.log(`Public route "${req.nextUrl.pathname}" detected - allowing access`);
  return NextResponse.next();
});

// Export the config for Next.js
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/dashboard(.*)",
    "/profile(.*)",
    "/settings(.*)",
    "/admin(.*)",
    "/middleware-test(.*)",
    "/story(.*)",
  ],
};