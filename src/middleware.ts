import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/api/webhook/clerk",
];

// Routes that can be accessed while signed in or not
const ignoredRoutes = [
  "/about",
  "/contact",
  "/_next/static",
  "/favicon.ico",
];

export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request);
  const path = request.nextUrl.pathname;

  // Check if the route is public or ignored
  if (publicRoutes.includes(path) || ignoredRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }

  // If the user is not signed in and the route is protected, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
