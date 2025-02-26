/**
 * Type-safe environment configuration
 *
 * This module provides a centralized, type-safe way to access environment variables
 * throughout the application. It includes validation and default values.
 */

// Valid environment types
type NodeEnv = 'development' | 'production' | 'test';

// Environment variable schema with types and defaults
interface EnvSchema {
  // Core environment
  NODE_ENV: NodeEnv;

  // API keys and external services
  OPENAI_API_KEY: string;
  NEXT_PUBLIC_OPENAI_API_KEY: string;

  // Vercel KV (Redis) configuration
  KV_REST_API_URL: string;
  KV_REST_API_TOKEN: string;

  // Monitoring and error tracking
  SENTRY_DSN: string;

  // Feature flags
  ENABLE_MOCK_STORIES: boolean;
  ENABLE_CACHING: boolean;

  // Performance and limits
  STORY_CACHE_TTL_SECONDS: number;
  API_TIMEOUT_MS: number;
}

// Helper to get environment variable with type conversion
const getEnvVar = <T>(key: string, defaultValue?: T, transform?: (value: string) => T): T => {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }

  if (transform) {
    return transform(value);
  }

  return value as unknown as T;
};

// Boolean conversion helper
const toBoolean = (value: string): boolean => {
  return value.toLowerCase() === 'true' || value === '1';
};

// Number conversion helper
const toNumber = (value: string): number => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Invalid number: ${value}`);
  }
  return num;
};

// Environment configuration with type safety and defaults
export const env: EnvSchema = {
  // Core environment
  NODE_ENV: getEnvVar<NodeEnv>('NODE_ENV', 'development', (value) => {
    if (['development', 'production', 'test'].includes(value)) {
      return value as NodeEnv;
    }
    return 'development';
  }),

  // API keys and external services
  OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY', ''),
  NEXT_PUBLIC_OPENAI_API_KEY: getEnvVar('NEXT_PUBLIC_OPENAI_API_KEY', ''),

  // Vercel KV (Redis) configuration
  KV_REST_API_URL: getEnvVar('KV_REST_API_URL', ''),
  KV_REST_API_TOKEN: getEnvVar('KV_REST_API_TOKEN', ''),

  // Monitoring and error tracking
  SENTRY_DSN: getEnvVar('SENTRY_DSN', ''),

  // Feature flags
  ENABLE_MOCK_STORIES: getEnvVar('ENABLE_MOCK_STORIES', false, toBoolean),
  ENABLE_CACHING: getEnvVar('ENABLE_CACHING', true, toBoolean),

  // Performance and limits
  STORY_CACHE_TTL_SECONDS: getEnvVar('STORY_CACHE_TTL_SECONDS', 24 * 60 * 60, toNumber),
  API_TIMEOUT_MS: getEnvVar('API_TIMEOUT_MS', 25000, toNumber),
};

// Environment helper functions
export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test';
}

// Validate required environment variables in production
if (isProduction()) {
  const requiredVars = ['OPENAI_API_KEY', 'KV_REST_API_URL', 'KV_REST_API_TOKEN'];

  const missing = requiredVars.filter((key) => !env[key as keyof EnvSchema]);

  if (missing.length > 0) {
    console.warn(`Missing required environment variables in production: ${missing.join(', ')}`);
  }
}
