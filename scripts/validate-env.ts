import { logger } from '../src/utils/loggerInstance';

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

function validateEnvVars(): boolean {
  let isValid = true;

  // Check for missing environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Missing required environment variable: ${envVar}`);
      isValid = false;
    }
  }

  // Check for valid URLs
  const urlVars = ['NEXT_PUBLIC_SUPABASE_URL', 'UPSTASH_REDIS_REST_URL'];

  for (const urlVar of urlVars) {
    const url = process.env[urlVar];
    if (url && !isValidUrl(url)) {
      console.error(`❌ Invalid URL for ${urlVar}: ${url}`);
      isValid = false;
    }
  }

  // Check for valid API keys
  const keyVars = [
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'UPSTASH_REDIS_REST_TOKEN',
  ];

  for (const keyVar of keyVars) {
    const key = process.env[keyVar];
    if (key && !isValidApiKey(key)) {
      console.error(`❌ Invalid API key for ${keyVar}`);
      isValid = false;
    }
  }

  return isValid;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidApiKey(key: string): boolean {
  // Basic validation: non-empty string without whitespace
  return typeof key === 'string' && key.trim() === key && key.length > 0;
}

// Run validation
const isValid = validateEnvVars();

if (!isValid) {
  console.error('❌ Environment validation failed');
  process.exit(1);
}

console.log('✅ Environment validation passed');
process.exit(0);
