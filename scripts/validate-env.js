const fs = require('fs');
const path = require('path');

// Required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

// Path to .env.local file
const envPath = path.join(process.cwd(), '.env.local');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found');
  process.exit(1);
}

// Read existing .env.local file
const existingEnv = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse existing environment variables
existingEnv.split('\n').forEach((line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Check for missing environment variables
const missingVars = requiredEnvVars.filter((key) => !envVars[key]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:');
  missingVars.forEach((key) => {
    console.error(`- ${key}`);
  });
  process.exit(1);
}

// Validate Supabase URL format
const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error(
    'Invalid Supabase URL format. It should be in the format: https://<project>.supabase.co'
  );
  process.exit(1);
}

// Validate Supabase anon key format
const anonKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
if (!anonKey.startsWith('eyJ') || anonKey.length < 100) {
  console.error('Invalid Supabase anon key format. Please check your key.');
  process.exit(1);
}

// Validate Supabase service role key format
const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];
if (!serviceRoleKey.startsWith('eyJ') || serviceRoleKey.length < 100) {
  console.error('Invalid Supabase service role key format. Please check your key.');
  process.exit(1);
}

// Validate OpenAI API key format
const openaiKey = envVars['OPENAI_API_KEY'];
if (!openaiKey.startsWith('sk-') && openaiKey !== 'mock') {
  console.error(
    'Invalid OpenAI API key format. It should start with "sk-" or be set to "mock" for testing.'
  );
  process.exit(1);
}

// Validate Upstash Redis URL format
const redisUrl = envVars['UPSTASH_REDIS_REST_URL'];
if (!redisUrl.startsWith('https://') || !redisUrl.includes('.upstash.io')) {
  console.error(
    'Invalid Upstash Redis URL format. It should be in the format: https://<database>.upstash.io'
  );
  process.exit(1);
}

// Validate Upstash Redis token format
const redisToken = envVars['UPSTASH_REDIS_REST_TOKEN'];
if (!redisToken || redisToken.length < 50) {
  console.error('Invalid Upstash Redis token format. Please check your token.');
  process.exit(1);
}

console.log('Environment variables validation successful.');
process.exit(0);
