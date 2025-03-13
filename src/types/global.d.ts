declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Application
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_URL: string;

      // Supabase
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;

      // OpenAI
      OPENAI_API_KEY: string;
      OPENAI_ORGANIZATION_ID?: string;

      // Google AI (Gemini)
      GOOGLE_AI_API_KEY: string;

      // Redis/KV
      REDIS_URL?: string;
      KV_URL?: string;
      KV_REST_API_URL: string;
      KV_REST_API_TOKEN: string;
      KV_REST_API_READ_ONLY_TOKEN?: string;

      // Sentry
      NEXT_PUBLIC_SENTRY_DSN?: string;
      SENTRY_AUTH_TOKEN?: string;

      // Analytics
      NEXT_PUBLIC_VERCEL_ANALYTICS_ID?: string;

      // Feature Flags
      NEXT_PUBLIC_FEATURE_FLAG_GEMINI?: string;
      NEXT_PUBLIC_FEATURE_FLAG_OPENAI?: string;
    }
  }
}

export {};
