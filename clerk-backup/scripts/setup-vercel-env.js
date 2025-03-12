/**
 * Vercel Environment Variables Setup Script
 *
 * This script helps set up environment variables in Vercel.
 * It reads from .env.local and provides commands to set them in Vercel.
 */

const fs = require('fs');
const dotenv = require('dotenv');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Load environment variables from .env.local
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}Error: ${filePath} does not exist${colors.reset}`);
    return {};
  }

  try {
    const envConfig = dotenv.parse(fs.readFileSync(filePath));
    return envConfig;
  } catch (error) {
    console.error(`${colors.red}Error loading ${filePath}:${colors.reset}`, error.message);
    return {};
  }
}

// Main function
function setupVercelEnv() {
  console.log(`${colors.cyan}${colors.bold}Vercel Environment Variables Setup${colors.reset}\n`);

  // Load environment variables from .env.local
  const localEnv = loadEnvFile('.env.local');

  if (Object.keys(localEnv).length === 0) {
    console.error(
      `${colors.red}Error: No environment variables found in .env.local${colors.reset}`
    );
    return;
  }

  // Define required variables for Vercel
  const requiredVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'OPENAI_API_KEY',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'NEXT_PUBLIC_SENTRY_DSN',
  ];

  // Additional variables needed for production
  const additionalVars = ['SENTRY_AUTH_TOKEN', 'SENTRY_ORG', 'SENTRY_PROJECT'];

  console.log(`${colors.blue}Checking for required environment variables...${colors.reset}`);

  const missingVars = requiredVars.filter((varName) => !localEnv[varName]);

  if (missingVars.length > 0) {
    console.error(
      `${colors.red}Error: Missing required environment variables in .env.local:${colors.reset}`
    );
    missingVars.forEach((varName) => {
      console.log(`  - ${varName}`);
    });
    return;
  }

  console.log(
    `${colors.green}All required environment variables found in .env.local${colors.reset}\n`
  );

  // Generate Vercel CLI commands
  console.log(`${colors.cyan}${colors.bold}Vercel CLI Commands${colors.reset}`);
  console.log(
    `${colors.yellow}Run these commands to set up your environment variables in Vercel:${colors.reset}\n`
  );

  // Commands for required variables
  requiredVars.forEach((varName) => {
    const value = localEnv[varName];
    const maskedValue = value
      ? `${value.substring(0, 3)}${'*'.repeat(Math.max(0, value.length - 6))}${value.substring(value.length - 3)}`
      : '';
    console.log(
      `${colors.green}vercel env add ${varName}${colors.reset} # Current value: ${maskedValue}`
    );
  });

  // Commands for additional variables
  console.log(`\n${colors.yellow}Additional variables needed for production:${colors.reset}\n`);
  additionalVars.forEach((varName) => {
    const value = localEnv[varName] || '';
    const maskedValue = value
      ? `${value.substring(0, 3)}${'*'.repeat(Math.max(0, value.length - 6))}${value.substring(value.length - 3)}`
      : 'Not set';
    console.log(
      `${colors.green}vercel env add ${varName}${colors.reset} # Current value: ${maskedValue}`
    );
  });

  // Special case for NEXT_PUBLIC_APP_URL
  console.log(
    `\n${colors.green}vercel env add NEXT_PUBLIC_APP_URL${colors.reset} # Set to your Vercel deployment URL`
  );

  console.log(`\n${colors.cyan}${colors.bold}Next Steps${colors.reset}`);
  console.log(`1. Run the commands above to set up your environment variables in Vercel`);
  console.log(`2. Run ${colors.green}vercel deploy${colors.reset} to deploy your application`);
  console.log(
    `3. Run ${colors.green}npm run verify:deployment${colors.reset} again to verify your deployment`
  );
}

// Run the setup
setupVercelEnv();
