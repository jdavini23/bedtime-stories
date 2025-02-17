import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    stories?: Story[];
    userPreferences?: UserPreferences;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}


