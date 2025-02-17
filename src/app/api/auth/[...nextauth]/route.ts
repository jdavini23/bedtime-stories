import 'dotenv/config';
import NextAuth, { AuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
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
    })
  ],
  adapter: FirebaseAdapter(),
  callbacks: {
    async session({ session, user }) {
      // Add user ID and additional metadata to session
      session.user.id = user.id;
      session.user.role = user.role || 'user';
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect logic: always return to dashboard after authentication
      return url.startsWith(baseUrl) 
        ? Promise.resolve(url) 
        : Promise.resolve(baseUrl + '/dashboard');
    }
  },
  events: {
    async signIn(message) {
      // Log user sign-in events (optional)
      console.log('User signed in:', message.user.email);
    },
    async createUser(message) {
      // Optional: Perform actions on new user creation
      console.log('New user created:', message.user.email);
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/onboarding'
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  theme: {
    colorScheme: 'light',
    logo: '/logo.png',
    brandColor: '#6366F1'
  },
  debug: process.env.NODE_ENV !== 'production'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
