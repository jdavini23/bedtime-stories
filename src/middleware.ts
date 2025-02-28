// Middleware for Clerk authentication
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
export default clerkMiddleware((auth, req) => {
  console.log(`Middleware running for path: ${req.nextUrl.pathname}`);
  
  if (isProtected(req)) {
    console.log(`Protected route "${req.nextUrl.pathname}" detected - checking auth`);
    return auth.protect();
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
