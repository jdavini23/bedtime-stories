import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: process.env.NODE_ENV === 'production' 
    ? z.string()
    : z.string().optional(),
  OPENAI_ORGANIZATION_ID: z.string().optional(),

  // Google AI (Gemini)
  GOOGLE_AI_API_KEY: process.env.NODE_ENV === 'production'
    ? z.string()
    : z.string().optional(),

  // Redis/KV
  REDIS_URL: z.string().url().optional(),
  KV_URL: z.string().url().optional(),
  KV_REST_API_URL: process.env.NODE_ENV === 'production'
    ? z.string().url()
    : z.string().url().optional(),
  KV_REST_API_TOKEN: process.env.NODE_ENV === 'production'
    ? z.string()
    : z.string().optional(),
  KV_REST_API_READ_ONLY_TOKEN: z.string().optional(),

  // Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_FEATURE_FLAG_GEMINI: z.boolean().default(false),
  NEXT_PUBLIC_FEATURE_FLAG_OPENAI: z.boolean().default(true),
});

export const env = envSchema.parse({
  // Application
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_ORGANIZATION_ID: process.env.OPENAI_ORGANIZATION_ID,

  // Google AI (Gemini)
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,

  // Redis/KV
  REDIS_URL: process.env.REDIS_URL,
  KV_URL: process.env.KV_URL,
  KV_REST_API_URL: process.env.KV_REST_API_URL,
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,

  // Sentry
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

  // Analytics
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,

  // Feature Flags
  NEXT_PUBLIC_FEATURE_FLAG_GEMINI: process.env.NEXT_PUBLIC_FEATURE_FLAG_GEMINI === 'true',
  NEXT_PUBLIC_FEATURE_FLAG_OPENAI: process.env.NEXT_PUBLIC_FEATURE_FLAG_OPENAI === 'true',
});

export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test';
}
