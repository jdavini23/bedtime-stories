import { logger } from '../src/utils/loggerInstance';

const requiredEnvVars = {
  // Always required in all environments
  required: [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  // Only required in production
  production: [
    'OPENAI_API_KEY',
    'GEMINI_API_KEY',
    'Upstash_KV_REST_API_URL',
    'Upstash_KV_REST_API_TOKEN',
    'Upstash_KV_REST_API_READ_',
    'Upstash_KV_URL',
  ],
};

export function validateEnv(): void {
  const isProd = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';

  // In Vercel preview deployments, we'll use mock values
  if (isVercel && process.env.VERCEL_ENV !== 'production') {
    logger.info('Vercel preview deployment detected, using mock values');
    return;
  }

  const varsToCheck = [...requiredEnvVars.required];
  if (isProd) {
    varsToCheck.push(...requiredEnvVars.production);
  }

  // Special handling for Clerk publishable key variations
  const hasClerkPublishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_ ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE;

  const missingVars = varsToCheck.filter((envVar) => {
    if (envVar === 'NEXT_PUBLIC_CLERK_PUBLISHABLE_') {
      return !hasClerkPublishableKey;
    }
    return !process.env[envVar];
  });

  if (missingVars.length > 0) {
    const message = isProd
      ? 'Missing required environment variables in production:'
      : 'Missing environment variables:';

    logger.warn(message, {
      missingVars,
      environment: process.env.NODE_ENV,
      isVercel: isVercel,
      vercelEnv: process.env.VERCEL_ENV,
    });

    if (isProd) {
      console.error(message, missingVars.join(', '));
    }
  }

  // Validate API key formats when they exist
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    const message = 'Invalid OpenAI API key format';
    logger.warn(message);
    if (isProd) console.error(message);
  }

  if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('AI')) {
    const message = 'Invalid Gemini API key format';
    logger.warn(message);
    if (isProd) console.error(message);
  }

  // Log initialization status (with redacted values)
  logger.info('Environment validation complete', {
    environment: process.env.NODE_ENV || 'development',
    vercelEnv: process.env.VERCEL_ENV,
    openAiKeyFormat: process.env.OPENAI_API_KEY ? 'sk-...' : 'missing',
    geminiKeyFormat: process.env.GEMINI_API_KEY ? 'AI...' : 'missing',
    missingVarsCount: missingVars.length,
  });

  // Only fail the build in production environment
  if (isProd && process.env.VERCEL_ENV === 'production' && missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missingVars.join(', ')}`
    );
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateEnv();
}
