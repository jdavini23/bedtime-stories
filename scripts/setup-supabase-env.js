/**
 * Script to set up Supabase environment variables
 *
 * This script helps set up the necessary Supabase environment variables
 * for both local development and production deployment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

// Helper function to prompt for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Helper function to validate Supabase URL format
function isValidSupabaseUrl(url) {
  return url.startsWith('https://') && url.includes('.supabase.co');
}

// Helper function to validate Supabase key format
function isValidSupabaseKey(key) {
  return key.startsWith('eyJ') && key.length >= 100;
}

// Helper function to validate OpenAI API key format
function isValidOpenAIKey(key) {
  return key.startsWith('sk-') || key === 'mock';
}

// Helper function to validate Upstash Redis URL format
function isValidRedisUrl(url) {
  return url.startsWith('https://') && url.includes('.upstash.io');
}

// Helper function to validate Upstash Redis token format
function isValidRedisToken(token) {
  return token && token.length >= 50;
}

// Main setup function
async function setupSupabase() {
  console.log(`${colors.cyan}${colors.bold}Supabase Environment Setup${colors.reset}\n`);

  // Check if .env.local exists
  let envVars = {};
  if (fs.existsSync(envPath)) {
    console.log(`${colors.blue}Found existing .env.local file${colors.reset}`);
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
  }

  // Prompt for missing environment variables
  for (const varName of requiredEnvVars) {
    if (!envVars[varName]) {
      let value;
      let isValid = false;

      while (!isValid) {
        value = await prompt(`Enter ${varName}: `);

        switch (varName) {
          case 'NEXT_PUBLIC_SUPABASE_URL':
            isValid = isValidSupabaseUrl(value);
            if (!isValid) {
              console.log(
                `${colors.red}Invalid Supabase URL format. It should be in the format: https://<project>.supabase.co${colors.reset}`
              );
            }
            break;

          case 'NEXT_PUBLIC_SUPABASE_ANON_KEY':
          case 'SUPABASE_SERVICE_ROLE_KEY':
            isValid = isValidSupabaseKey(value);
            if (!isValid) {
              console.log(
                `${colors.red}Invalid Supabase key format. Please check your key.${colors.reset}`
              );
            }
            break;

          case 'OPENAI_API_KEY':
            isValid = isValidOpenAIKey(value);
            if (!isValid) {
              console.log(
                `${colors.red}Invalid OpenAI API key format. It should start with "sk-" or be set to "mock" for testing.${colors.reset}`
              );
            }
            break;

          case 'UPSTASH_REDIS_REST_URL':
            isValid = isValidRedisUrl(value);
            if (!isValid) {
              console.log(
                `${colors.red}Invalid Upstash Redis URL format. It should be in the format: https://<database>.upstash.io${colors.reset}`
              );
            }
            break;

          case 'UPSTASH_REDIS_REST_TOKEN':
            isValid = isValidRedisToken(value);
            if (!isValid) {
              console.log(
                `${colors.red}Invalid Upstash Redis token format. Please check your token.${colors.reset}`
              );
            }
            break;
        }
      }

      envVars[varName] = value;
    }
  }

  // Write environment variables to .env.local
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(envPath, envContent);

  console.log(
    `\n${colors.green}Environment variables have been saved to .env.local${colors.reset}`
  );

  // Run environment validation
  try {
    execSync('npm run verify:env', { stdio: 'inherit' });
    console.log(`\n${colors.green}Environment validation successful${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}Environment validation failed${colors.reset}`);
    process.exit(1);
  }

  rl.close();
}

// Run setup
setupSupabase().catch((error) => {
  console.error(`${colors.red}Error during setup:${colors.reset}`, error);
  process.exit(1);
});
