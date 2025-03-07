import { logger } from '@/utils/loggerInstance';

interface Config {
  nextauth: {
    url: string;
  };
  google: {
    clientId: string | undefined;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
}

// Client-side public configuration
export const publicConfig = {
  nextauth: {
    url: process.env.NEXT_PUBLIC_NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3003}`,
  },
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3003}/api`,
    timeout: 30000, // 30 seconds
  },
} as const;

// Export config for easy access throughout the app
export const config: Config = {
  ...publicConfig,
  api: {
    ...publicConfig.api,
  },
};

// Helper function to check if we're on the server
const isServer = typeof window === 'undefined';

// Server-side configuration
export function getServerConfig() {
  if (!isServer) {
    logger.error('getServerConfig should only be called on the server side');
  }

  // Log environment variables for debugging
  logger.info('Server Environment Variables:', {
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  });

  // Check required environment variables
  const requiredVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };

  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      logger.error(`${key} is not set`);
    }
  });

  return {
    nextauth: {
      secret: process.env.NEXTAUTH_SECRET,
      url: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    api: {
      ...config.api,
      internalUrl: process.env.API_INTERNAL_URL || config.api.baseUrl,
    },
  };
}

// Validation function for server-side configuration
export function validateServerConfig(config: ReturnType<typeof getServerConfig>) {
  const { nextauth, google } = config;

  if (!nextauth.secret) {
    throw new Error('NEXTAUTH_SECRET is required');
  }

  if (!google.clientId || !google.clientSecret) {
    throw new Error('Google OAuth credentials are required');
  }

  return config;
}
