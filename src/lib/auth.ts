import { clerkClient } from "@clerk/nextjs/server";

// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/api/story",
  "/api/webhook/clerk",
];

export const ignoredRoutes = [
  "/about",
  "/contact",
  "/_next/static",
  "/favicon.ico",
];

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// Helper functions for Clerk authentication
export const getUser = async (userId: string) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getUserList = async () => {
  try {
    const users = await clerkClient.users.getUserList();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
