declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      OPENAI_API_KEY: string;
      KV_REST_API_URL: string;
      KV_REST_API_TOKEN: string;
    }
  }
}

export {};
