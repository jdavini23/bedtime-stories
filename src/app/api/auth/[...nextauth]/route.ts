import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Only validate on server side
const isServer = typeof window === 'undefined';

if (isServer) {
  // Validate required environment variables on server side only
  const requiredVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  };

  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`${key} is not set`);
    }
  });
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          scope: 'openid profile email'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('Sign In Callback:', {
        user: { email: user.email },
        provider: account?.provider,
        hasProfile: !!profile
      });
      return true;
    },
    async jwt({ token, user, account }) {
      console.log('JWT Callback:', {
        hasToken: !!token,
        hasUser: !!user,
        hasAccount: !!account
      });

      if (account && user) {
        token.accessToken = account.access_token;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback:', {
        hasSession: !!session,
        hasToken: !!token
      });

      if (session.user) {
        session.user.id = token.sub as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect Callback:', { url, baseUrl });
      
      // Always allow callback URLs
      if (url.startsWith('/api/auth/callback')) {
        return url;
      }
      
      // Handle relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Handle subdomains
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/onboarding'
  },
  debug: true
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
