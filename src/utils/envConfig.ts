import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_SIGN_IN_URL: z.string().default('/sign-in'),
  NEXT_PUBLIC_SIGN_UP_URL: z.string().default('/sign-up'),
  NEXT_PUBLIC_AFTER_SIGN_IN_URL: z.string().default('/dashboard'),
  NEXT_PUBLIC_AFTER_SIGN_UP_URL: z.string().default('/onboarding'),
  NEXT_PUBLIC_DEV_USER_ID: z.string().optional(),
});

const env = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SIGN_IN_URL: process.env.NEXT_PUBLIC_SIGN_IN_URL,
  NEXT_PUBLIC_SIGN_UP_URL: process.env.NEXT_PUBLIC_SIGN_UP_URL,
  NEXT_PUBLIC_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_AFTER_SIGN_IN_URL,
  NEXT_PUBLIC_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_AFTER_SIGN_UP_URL,
  NEXT_PUBLIC_DEV_USER_ID: process.env.NEXT_PUBLIC_DEV_USER_ID,
};

try {
  envSchema.parse(env);
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:', error.errors);
  } else {
    console.error('❌ An unexpected error occurred while validating environment variables');
  }
  throw new Error('Invalid environment variables');
}

export default env;

export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test';
}
