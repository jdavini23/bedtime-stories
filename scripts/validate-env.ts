import { logger } from '../src/utils/loggerInstance';

const requiredEnvVars = {
  // Always required in all environments
  required: [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  // Only required in production
  production: [
    'OPENAI_API_KEY',
    'GEMINI_API_KEY',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
  ],
};

export function validateEnv(): void {
  const isProd = process.env.NODE_ENV === 'production';
  const varsToCheck = [...requiredEnvVars.required];

  if (isProd) {
    varsToCheck.push(...requiredEnvVars.production);
  }

  const missingVars = varsToCheck.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    const message = isProd
      ? 'Missing required environment variables in production:'
      : 'Missing environment variables:';

    logger.warn(message, {
      missingVars,
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
    openAiKeyFormat: process.env.OPENAI_API_KEY ? 'sk-...' : 'missing',
    geminiKeyFormat: process.env.GEMINI_API_KEY ? 'AI...' : 'missing',
    missingVarsCount: missingVars.length,
  });

  // In production, fail the build if required variables are missing
  if (isProd && missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missingVars.join(', ')}`
    );
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateEnv();
}
