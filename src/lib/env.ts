// Environment configuration with type safety
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  // Add other environment variables as needed
} as const;

// Type guard to check if running in production
export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

// Type guard to check if running in development
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}


