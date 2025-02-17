declare namespace NodeJS {
  interface ProcessEnv {
    // Firebase Web App Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;

    // Firebase Admin SDK Configuration
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_ID: string;
    FIREBASE_CLIENT_CERT_URL: string;

    // OAuth Provider Credentials
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;

    // NextAuth Configuration
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;

    // OpenAI API
    OPENAI_API_KEY?: string;

    // Database Connection
    DATABASE_URL?: string;

    // Environment
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

export {};
