// Client-side public configuration
export const publicConfig = {
  nextauth: {
    url: process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3000',
  },
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  }
} as const;

// Helper function to check if we're on the server
const isServer = typeof window === 'undefined';

// Server-side configuration
export function getServerConfig() {
  if (!isServer) {
    throw new Error('getServerConfig should only be called on the server side');
  }

  // Log environment variables for debugging
  console.log('Server Environment Variables:', {
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
      throw new Error(`${key} is not set`);
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
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }
  };
}

// Validation function for server-side configuration
export function validateServerConfig(config: ReturnType<typeof getServerConfig>) {
  if (!isServer) {
    throw new Error('validateServerConfig should only be called on the server side');
  }

  const requiredFields = [
    { key: 'nextauth.secret', value: config.nextauth.secret },
    { key: 'google.clientId', value: config.google.clientId },
    { key: 'google.clientSecret', value: config.google.clientSecret },
  ];

  const missingFields = requiredFields
    .filter(field => !field.value)
    .map(field => field.key);

  if (missingFields.length > 0) {
    console.error('Configuration validation failed:', {
      secret: !!config.nextauth.secret,
      clientId: !!config.google.clientId,
      clientSecret: !!config.google.clientSecret,
      missingFields,
    });
    throw new Error(`Missing required environment variables: ${missingFields.join(', ')}`);
  }

  return config;
}
