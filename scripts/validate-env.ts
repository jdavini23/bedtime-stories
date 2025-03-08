import { logger } from '../src/utils/loggerInstance';

const requiredEnvVars = {
  // Always required in all environments
  required: ['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'] as const,
  // Only required in production deployment (not preview)
  production: [
    'OPENAI_API_KEY',
    'GEMINI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    // Support all naming conventions for Upstash/KV, prioritizing Upstash_KV_ prefix
    ['Upstash_KV_REST_API_URL', 'Upstash_KV_URL', 'UPSTASH_REDIS_REST_URL', 'KV_REST_API_URL'],
    ['Upstash_KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_TOKEN'],
  ] as const,
};

type EnvVar = string | readonly string[];

export function validateEnv(): void {
  const isProd = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';
  const isVercelProd = process.env.VERCEL_ENV === 'production';

  // Log environment context
  logger.info('Environment context:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    isProd,
    isVercel,
    isVercelProd,
  });

  // In Vercel preview deployments, we'll use mock values
  if (isVercel && !isVercelProd) {
    logger.info('Vercel preview deployment detected, using mock values');
    return;
  }

  const varsToCheck: EnvVar[] = [...requiredEnvVars.required];

  // Only check production vars in Vercel production deployment
  if (isVercelProd) {
    logger.info('Vercel production deployment detected, checking all required variables');
    varsToCheck.push(...requiredEnvVars.production);
  }

  // Special handling for Clerk publishable key
  const hasClerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const missingVars = varsToCheck.filter((envVar) => {
    if (envVar === 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY') {
      return !hasClerkPublishableKey;
    }
    // Handle array of alternative variable names
    if (Array.isArray(envVar)) {
      const hasAnyVar = envVar.some((v) => process.env[v as string]);
      if (!hasAnyVar) {
        logger.warn(`Missing all alternative variables: ${envVar.join(' or ')}`);
      }
      return !hasAnyVar;
    }
    const hasVar = !!process.env[envVar as string];
    if (!hasVar) {
      logger.warn(`Missing environment variable: ${envVar}`);
    }
    return !hasVar;
  });

  if (missingVars.length > 0) {
    const message = isVercelProd
      ? 'Missing required environment variables in production:'
      : 'Missing environment variables:';

    const formattedMissingVars = missingVars.map((v) => (Array.isArray(v) ? v.join(' or ') : v));

    logger.warn(message, {
      missingVars: formattedMissingVars,
      environment: process.env.NODE_ENV,
      isVercel: isVercel,
      vercelEnv: process.env.VERCEL_ENV,
    });

    if (isVercelProd) {
      console.error(message, formattedMissingVars.join(', '));
    }
  }

  // Validate API key formats when they exist
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    const message = 'Invalid OpenAI API key format';
    logger.warn(message);
    if (isVercelProd) console.error(message);
  }

  if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('AI')) {
    const message = 'Invalid Gemini API key format';
    logger.warn(message);
    if (isVercelProd) console.error(message);
  }

  // Log initialization status (with redacted values)
  logger.info('Environment validation complete', {
    environment: process.env.NODE_ENV || 'development',
    vercelEnv: process.env.VERCEL_ENV,
    openAiKeyFormat: process.env.OPENAI_API_KEY ? 'sk-...' : 'missing',
    geminiKeyFormat: process.env.GEMINI_API_KEY ? 'AI...' : 'missing',
    missingVarsCount: missingVars.length,
  });

  // Only fail the build in Vercel production deployment
  if (isVercelProd && missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missingVars.join(', ')}`
    );
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateEnv();
}
