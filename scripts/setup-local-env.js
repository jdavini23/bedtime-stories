/**
 * Local Environment Setup Script
 *
 * This script helps set up local environment variables for testing.
 * It reads from .env.local and sets them in the current process environment.
 */

const fs = require('fs');
const path = require('path');
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

// Set environment variables for the current process
function setEnvironmentVariables(envVars) {
  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

// Generate PowerShell commands to set environment variables
function generatePowerShellCommands(envVars) {
  const commands = Object.entries(envVars).map(([key, value]) => {
    // Escape single quotes in the value
    const escapedValue = value.replace(/'/g, "''");
    return `$env:${key} = '${escapedValue}'`;
  });

  return commands.join('\n');
}

// Generate batch commands to set environment variables
function generateBatchCommands(envVars) {
  const commands = Object.entries(envVars).map(([key, value]) => {
    // Escape special characters in the value
    const escapedValue = value.replace(/%/g, '%%').replace(/[&|<>^]/g, '^$&');
    return `set "${key}=${escapedValue}"`;
  });

  return commands.join('\n');
}

// Mask sensitive values for display
function maskSensitiveValue(value) {
  if (!value) return '';
  if (value.length <= 8) return '********';
  return value.substring(0, 4) + '****' + value.substring(value.length - 4);
}

// Main function
function setupLocalEnv() {
  console.log(`${colors.cyan}${colors.bold}Local Environment Setup${colors.reset}\n`);

  // Load environment variables from .env.local
  const localEnv = loadEnvFile('.env.local');

  if (Object.keys(localEnv).length === 0) {
    console.error(
      `${colors.red}Error: No environment variables found in .env.local${colors.reset}`
    );
    return;
  }

  // Define required variables
  const requiredVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'OPENAI_API_KEY',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'NEXT_PUBLIC_SENTRY_DSN',
  ];

  // Additional variables needed for production
  const additionalVars = [
    'SENTRY_AUTH_TOKEN',
    'SENTRY_ORG',
    'SENTRY_PROJECT',
    'NEXT_PUBLIC_APP_URL',
  ];

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

  // Set environment variables for the current process
  setEnvironmentVariables(localEnv);

  console.log(`${colors.green}✓ Environment variables set for the current process${colors.reset}`);

  // Generate commands for different shells
  console.log(`\n${colors.cyan}${colors.bold}Shell Commands${colors.reset}`);
  console.log(
    `${colors.yellow}Run these commands in your terminal to set the environment variables:${colors.reset}\n`
  );

  // Display masked values for sensitive environment variables
  console.log(`${colors.cyan}Environment Variables (masked for security):${colors.reset}`);
  Object.entries(localEnv).forEach(([key, value]) => {
    console.log(`  ${key}: ${maskSensitiveValue(value)}`);
  });

  console.log(`\n${colors.cyan}PowerShell:${colors.reset}`);
  console.log('Run the following command to generate a PowerShell script:');
  console.log(`${colors.green}npm run generate:env-script -- --type=powershell${colors.reset}`);

  console.log(`\n${colors.cyan}Command Prompt (CMD):${colors.reset}`);
  console.log('Run the following command to generate a CMD script:');
  console.log(`${colors.green}npm run generate:env-script -- --type=cmd${colors.reset}`);

  console.log(`\n${colors.cyan}${colors.bold}Next Steps${colors.reset}`);
  console.log(
    `1. Run ${colors.green}npm run verify:deployment${colors.reset} to verify your deployment`
  );
  console.log(
    `\n${colors.yellow}Note: The environment variables will only be set for the current process.${colors.reset}`
  );
}

// Run the setup
setupLocalEnv();
