/**
 * Local Environment Setup Script
 *
 * This script helps set up local environment variables for testing.
 * It reads from .env.local and sets them in the current process environment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
  console.log('Creating .env.local file...');
  fs.writeFileSync(envPath, '');
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
  console.log('Missing required environment variables:');
  missingVars.forEach((key) => {
    console.log(`- ${key}`);
  });
  console.log('\nPlease add these variables to your .env.local file.');
  process.exit(1);
}

console.log('All required environment variables are set.');

// Verify environment variables
try {
  execSync('node scripts/validate-env.js');
  console.log('Environment variables validated successfully.');
} catch (error) {
  console.error('Error validating environment variables:', error.message);
  process.exit(1);
}
