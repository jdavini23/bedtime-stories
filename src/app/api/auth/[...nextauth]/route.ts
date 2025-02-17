import 'dotenv/config';
import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { FirebaseAdapter } from '@/lib/firebase/authAdapter';

// Type-safe environment variable validation
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnvVar('GOOGLE_CLIENT_ID'),
      clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          scope: 'openid profile email'
        }
      }
    }),
    GitHubProvider({
      clientId: getEnvVar('GITHUB_CLIENT_ID'),
      clientSecret: getEnvVar('GITHUB_CLIENT_SECRET')
    })
  ],
  adapter: FirebaseAdapter(),
  callbacks: {
    async session({ session, user }) {
      // Add user ID to the session
      session.user.id = user.id;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  theme: {
    colorScheme: 'light',
    logo: '/logo.png'
  },
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
