import { logger } from '@/utils/loggerInstance';

const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
  'GEMINI_API_KEY',
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
];

export function validateEnv(): void {
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    logger.warn('Missing required environment variables:', {
      missingVars,
    });
  }

  // Validate API key formats
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    logger.warn('Invalid OpenAI API key format');
  }

  if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('AI')) {
    logger.warn('Invalid Gemini API key format');
  }

  // Log initialization status (with redacted values)
  logger.info('Environment validation complete', {
    openAiKeyFormat: process.env.OPENAI_API_KEY ? 'sk-...' : 'missing',
    geminiKeyFormat: process.env.GEMINI_API_KEY ? 'AI...' : 'missing',
    missingVarsCount: missingVars.length,
  });
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateEnv();
}
