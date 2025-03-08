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
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_mock_publishable_key
CLERK_SECRET_KEY=sk_test_mock_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zwnnxqvfavkzupmucbhk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bm54cXZmYXZrenVwbXVjYmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzIwODcsImV4cCI6MjA1NjU0ODA4N30.F_kwlF4QV_zKoxbLK4wZjZhIfHSUJlob-mAYQk3FMP0

# API Keys
OPENAI_API_KEY=sk-mock-openai-key
GEMINI_API_KEY=AIzaSyMockGeminiKey

# Upstash/KV Configuration (Supporting both naming conventions)
UPSTASH_REDIS_REST_URL=https://mock-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=mock-token
Upstash_KV_REST_API_URL=https://mock-url.upstash.io
Upstash_KV_REST_API_TOKEN=mock-token
Upstash_KV_REST_API_READ_ONLY_TOKEN=mock-read-token
Upstash_KV_URL=rediss://default:mock-token@mock-url.upstash.io:6379
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

  // Function to convert Redis URL if needed
  function convertRedisUrl(url) {
    if (!url) return url;
    if (url.startsWith('rediss://')) {
      const match = url.match(/rediss:\/\/(.*):(.*)@(.*)/);
      if (match) {
        const [_, username, password, host] = match;
        return `https://${host}`;
      }
    }
    return url;
  }

  // Merge with process.env, preferring process.env values
  const finalEnv = Object.entries(process.env).reduce((acc, [key, value]) => {
    if (value) {
      // Convert Redis URL if needed
      if (key === 'Upstash_KV_URL' || key === 'UPSTASH_REDIS_REST_URL') {
        acc[key] = convertRedisUrl(value);
      } else {
        acc[key] = value;
      }
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
