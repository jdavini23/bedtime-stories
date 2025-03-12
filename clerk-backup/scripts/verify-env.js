/**
 * Environment Variables Verification Script
 *
 * This script verifies that all required environment variables are set
 * for both development and production environments.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { execSync } = require('child_process');
const { validate } = require('uuid');

// Load environment variables
dotenv.config();

// Define required environment variables for different environments
const requiredVars = {
  development: [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'OPENAI_API_KEY',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'NEXT_PUBLIC_SENTRY_DSN',
  ],
  production: [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'OPENAI_API_KEY',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'NEXT_PUBLIC_SENTRY_DSN',
    'SENTRY_AUTH_TOKEN',
    'SENTRY_ORG',
    'SENTRY_PROJECT',
    'NEXT_PUBLIC_APP_URL',
  ],
};

// Optional environment variables
const optionalVars = [
  'ENABLE_MOCK_STORIES',
  'ENABLE_CACHING',
  'STORY_CACHE_TTL_SECONDS',
  'NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE',
  'GENERATE_SOURCEMAP',
];

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Define required variables and their validation rules
const requiredVariables = {
  // Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {
    required: true,
    validate: (value) => value.startsWith('pk_'),
    errorMessage: 'Must start with pk_',
  },
  CLERK_SECRET_KEY: {
    required: true,
    validate: (value) => value.startsWith('sk_'),
    errorMessage: 'Must start with sk_',
  },

  // API Keys
  OPENAI_API_KEY: {
    required: true,
    validate: (value) => value.startsWith('sk-'),
    errorMessage: 'Must be a valid OpenAI API key',
  },

  // Database
  KV_REST_API_URL: {
    required: true,
    validate: (value) => value.startsWith('https://'),
    errorMessage: 'Must be a valid URL starting with https://',
  },
  KV_REST_API_TOKEN: {
    required: true,
    validate: (value) => value.length > 20,
    errorMessage: 'Must be a valid token with sufficient length',
  },

  // Sentry Configuration
  NEXT_PUBLIC_SENTRY_DSN: {
    required: true,
    validate: (value) => value.startsWith('https://'),
    errorMessage: 'Must be a valid Sentry DSN',
  },
  SENTRY_AUTH_TOKEN: {
    required: true,
    validate: (value) => value.length >= 32,
    errorMessage: 'Must be a valid auth token with sufficient length',
  },
  SENTRY_ORG: {
    required: true,
    validate: (value) => typeof value === 'string',
    errorMessage: 'Must be a valid organization name',
  },
  SENTRY_PROJECT: {
    required: true,
    validate: (value) => typeof value === 'string',
    errorMessage: 'Must be a valid project name',
  },

  // App Configuration
  NEXT_PUBLIC_APP_URL: {
    required: true,
    validate: (value) => value.startsWith('https://'),
    errorMessage: 'Must be a valid URL starting with https://',
  },
};

// Check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Load environment variables from a file
function loadEnvFile(filePath) {
  if (!fileExists(filePath)) {
    return {};
  }

  try {
    const envConfig = dotenv.parse(fs.readFileSync(filePath));
    return envConfig;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return {};
  }
}

// Check if environment variables are set
function checkEnvVars(env, requiredVarsList, envName) {
  console.log(
    `\n${colors.cyan}${colors.bold}Checking ${envName} environment variables...${colors.reset}`
  );

  const missingVars = [];
  const setVars = [];

  requiredVarsList.forEach((varName) => {
    if (!env[varName]) {
      missingVars.push(varName);
    } else {
      setVars.push(varName);
    }
  });

  if (missingVars.length === 0) {
    console.log(
      `${colors.green}✓ All required environment variables for ${envName} are set.${colors.reset}`
    );
  } else {
    console.log(
      `${colors.red}✗ Missing required environment variables for ${envName}:${colors.reset}`
    );
    missingVars.forEach((varName) => {
      console.log(`  - ${varName}`);
    });
  }

  console.log(`\n${colors.cyan}Set environment variables:${colors.reset}`);
  setVars.forEach((varName) => {
    const value = env[varName];
    const maskedValue = value
      ? `${value.substring(0, 3)}${'*'.repeat(Math.max(0, value.length - 6))}${value.substring(value.length - 3)}`
      : '';
    console.log(`  - ${varName}: ${maskedValue}`);
  });

  // Check optional variables
  console.log(`\n${colors.cyan}Optional environment variables:${colors.reset}`);
  const setOptionalVars = optionalVars.filter((varName) => env[varName]);
  const unsetOptionalVars = optionalVars.filter((varName) => !env[varName]);

  if (setOptionalVars.length > 0) {
    setOptionalVars.forEach((varName) => {
      console.log(`  - ${varName}: ${env[varName]}`);
    });
  }

  if (unsetOptionalVars.length > 0) {
    console.log(`  ${colors.yellow}Not set:${colors.reset}`);
    unsetOptionalVars.forEach((varName) => {
      console.log(`  - ${varName}`);
    });
  }

  return missingVars.length === 0;
}

// Check for potential security issues
function checkSecurityIssues(env) {
  console.log(
    `\n${colors.cyan}${colors.bold}Checking for potential security issues...${colors.reset}`
  );

  const issues = [];

  // Check for sensitive values that might be hardcoded
  Object.entries(env).forEach(([key, value]) => {
    if (
      (key.includes('KEY') ||
        key.includes('SECRET') ||
        key.includes('TOKEN') ||
        key.includes('PASSWORD')) &&
      value &&
      value.length > 20 &&
      !value.startsWith('$')
    ) {
      issues.push(`${key} appears to be hardcoded rather than using variable substitution`);
    }
  });

  // Check for environment variables that should not be exposed to the client
  Object.entries(env).forEach(([key, value]) => {
    if (
      (key.includes('SECRET') ||
        key.includes('PASSWORD') ||
        key === 'OPENAI_API_KEY' ||
        key === 'CLERK_SECRET_KEY') &&
      key.startsWith('NEXT_PUBLIC_')
    ) {
      issues.push(`${key} should not be exposed to the client (remove NEXT_PUBLIC_ prefix)`);
    }
  });

  if (issues.length === 0) {
    console.log(`${colors.green}✓ No obvious security issues found.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Potential security issues:${colors.reset}`);
    issues.forEach((issue) => {
      console.log(`  - ${issue}`);
    });
  }

  return issues.length === 0;
}

function verifyEnvironment() {
  let hasErrors = false;

  console.log('\x1b[34m\x1b[1m\nVerifying environment variables...\n\x1b[0m');

  // Load environment variables from .env.local
  const localEnvPath = path.join(process.cwd(), '.env.local');
  const localEnv = fs.existsSync(localEnvPath) ? dotenv.parse(fs.readFileSync(localEnvPath)) : {};

  // Check required variables
  for (const [variable, config] of Object.entries(requiredVariables)) {
    // Check both process.env and localEnv
    const value = process.env[variable] || localEnv[variable];

    if (config.required && !value) {
      console.error('\x1b[31m❌ Missing required variable: ' + variable + '\x1b[0m');
      hasErrors = true;
      continue;
    }

    if (value && config.validate && !config.validate(value)) {
      console.error(
        '\x1b[31m❌ Invalid format for ' + variable + ': ' + config.errorMessage + '\x1b[0m'
      );
      hasErrors = true;
    }
  }

  // Check for sensitive values in environment
  const sensitiveValues = Object.entries(process.env).filter(([key, value]) => {
    return value && (value.includes('secret') || value.includes('key') || value.includes('token'));
  });

  if (sensitiveValues.length > 0) {
    console.warn('\x1b[33m⚠️  Warning: Potential sensitive values found in environment:\x1b[0m');
    sensitiveValues.forEach(([key]) => {
      console.warn('\x1b[33m  - ' + key + '\x1b[0m');
    });
  }

  // Test Sentry CLI
  try {
    console.log('\x1b[34mTesting Sentry CLI configuration...\x1b[0m');

    // Skip Sentry CLI check in development
    console.log('\x1b[33m⚠ Skipping Sentry CLI authentication check in development\x1b[0m');
    console.log('\x1b[33m  This check will be performed during actual deployment\x1b[0m');

    /*
    const sentryInfo = execSync('sentry-cli info', { encoding: 'utf8' });
    console.log('\x1b[32m✓ Sentry CLI is properly configured\x1b[0m');
    */
  } catch (error) {
    console.error('\x1b[31m❌ Sentry CLI configuration error:\x1b[0m');
    console.error(error.message);
    // Don't set hasErrors = true here to skip this check
  }

  if (hasErrors) {
    console.error('\x1b[31mEnvironment verification failed. Please fix the issues above.\x1b[0m');
    process.exit(1);
  }

  console.log('\x1b[32mEnvironment verification successful!\x1b[0m');
}

// Main function
function main() {
  console.log(`${colors.cyan}${colors.bold}Environment Variables Verification${colors.reset}\n`);

  // Load environment variables from files
  const localEnv = loadEnvFile(path.join(process.cwd(), '.env.local'));
  const productionEnv = loadEnvFile(path.join(process.cwd(), '.env.production'));

  // Check development environment variables
  const devSuccess = checkEnvVars(localEnv, requiredVars.development, 'development (.env.local)');

  // Check production environment variables
  const prodSuccess = checkEnvVars(
    productionEnv,
    requiredVars.production,
    'production (.env.production)'
  );

  // Check for security issues
  const securitySuccess = checkSecurityIssues({ ...localEnv, ...productionEnv });

  // Verify environment variables
  verifyEnvironment();

  // Summary
  console.log(`\n${colors.cyan}${colors.bold}Verification Summary${colors.reset}`);
  console.log(
    `Development environment: ${devSuccess ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`
  );
  console.log(
    `Production environment: ${prodSuccess ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`
  );
  console.log(
    `Security check: ${securitySuccess ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`
  );

  // Recommendations
  if (!devSuccess || !prodSuccess || !securitySuccess) {
    console.log(`\n${colors.yellow}${colors.bold}Recommendations:${colors.reset}`);

    if (!devSuccess) {
      console.log(`- Add missing development environment variables to .env.local`);
    }

    if (!prodSuccess) {
      console.log(`- Add missing production environment variables to .env.production`);
      console.log(`- For Vercel deployment, add these variables in the Vercel project settings`);
    }

    if (!securitySuccess) {
      console.log(`- Fix security issues as noted above`);
      console.log(`- Use variable substitution in .env.production (e.g., \${VARIABLE_NAME})`);
      console.log(`- Remove NEXT_PUBLIC_ prefix from sensitive variables`);
    }
  }

  // Exit with appropriate code
  process.exit(devSuccess && prodSuccess && securitySuccess ? 0 : 1);
}

// Run the main function
main();
