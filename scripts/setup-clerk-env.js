#!/usr/bin/env node
/**
 * This script sets up mock Clerk environment variables for the build process
 * This prevents build failures when Clerk tries to initialize during static generation
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Setting up Clerk environment for Vercel build...');

// Check if we're in a CI/Vercel environment
const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';

if (!isCI) {
  console.log('ℹ️ Not in a CI environment, skipping mock Clerk setup');
  process.exit(0);
}

// Create or update .env file with mock Clerk keys
// These are only used during build and won't affect runtime
const envFilePath = path.join(process.cwd(), '.env.local');

// Default placeholder values for build time only
const mockClerkEnv = `
# These are placeholder values for build time only
# They won't be used in production runtime
NEXT_PUBLIC_CLERK_PUBLISHABLE_=pk_test_mock_publishable_key
CLERK_SECRET_KEY=sk_test_mock_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://mock-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=mock-anon-key

# API Keys
OPENAI_API_KEY=sk-mock-openai-key
GEMINI_API_KEY=AIzaSyMockGeminiKey

# Upstash/KV Configuration
Upstash_KV_REST_API_URL=https://mock-url.upstash.io
Upstash_KV_REST_API_TOKEN=mock-token
Upstash_KV_REST_API_READ_=mock-read-token
Upstash_KV_URL=https://mock-kv-url.upstash.io
`;

try {
  // Check if .env.local exists and read it
  let currentEnv = '';
  if (fs.existsSync(envFilePath)) {
    currentEnv = fs.readFileSync(envFilePath, 'utf8');
  }

  // Parse existing environment variables
  const existingEnv = {};
  currentEnv.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.trim().startsWith('#')) {
      existingEnv[key.trim()] = valueParts.join('=').trim();
    }
  });

  // Merge with process.env, preferring process.env values
  const finalEnv = Object.entries(process.env).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  // Create final .env content
  const envContent = Object.entries(finalEnv)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Write the file
  fs.writeFileSync(envFilePath, mockClerkEnv + '\n' + envContent);
  console.log('✅ Added mock environment variables for build process');
} catch (error) {
  console.error('❌ Error setting up environment:', error);
  process.exit(1);
}
