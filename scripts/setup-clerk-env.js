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
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuc3RlcGludG9zdG9yeXRpbWUuY29tJA
CLERK_SECRET_KEY=sk_test_Y2xlcmstYnVpbGQtdGltZS1tb2NrLWtleQ
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
`;

try {
  // Check if .env.local exists and read it
  let currentEnv = '';
  if (fs.existsSync(envFilePath)) {
    currentEnv = fs.readFileSync(envFilePath, 'utf8');
  }

  // Only add variables that don't already exist
  const envLines = currentEnv.split('\n');
  const mockEnvLines = mockClerkEnv.split('\n');
  
  for (const mockLine of mockEnvLines) {
    const [key] = mockLine.split('=');
    if (key && key.trim() && !key.trim().startsWith('#')) {
      const keyExists = envLines.some(line => 
        line.startsWith(key.trim() + '=') || line.startsWith(key.trim() + ' =')
      );
      
      if (!keyExists) {
        envLines.push(mockLine);
      }
    } else {
      // Keep comments and empty lines
      if (mockLine.trim() && !envLines.includes(mockLine)) {
        envLines.push(mockLine);
      }
    }
  }

  // Write updated env file
  fs.writeFileSync(envFilePath, envLines.join('\n'));
  console.log('✅ Added mock Clerk environment variables for build process');

} catch (error) {
  console.error('❌ Error setting up Clerk environment:', error);
  process.exit(1);
}