#!/usr/bin/env node

/**
 * Cross-platform prepare script
 * This replaces the bash script in package.json for Windows compatibility
 */

const { execSync } = require('child_process');

// Check if running in Vercel environment
const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  try {
    // Only install husky if not in Vercel environment
    console.log('Installing husky hooks during prepare...');
    execSync('npx husky install', { stdio: 'inherit' });
    console.log('Husky hooks installed successfully');
  } catch (error) {
    console.warn('Failed to install husky hooks, but continuing anyway:', error.message);
    // Don't exit with error to allow installation to complete
  }
} else {
  console.log('Skipping husky installation in Vercel environment');
}
