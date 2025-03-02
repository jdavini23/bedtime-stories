/**
 * Deployment Script
 *
 * This script runs the complete deployment process for the Bedtime Stories application.
 * It performs the following steps:
 * 1. Verify environment variables
 * 2. Run security checks
 * 3. Clean build directory
 * 4. Build the application
 * 5. Upload source maps to Sentry
 * 6. Deploy to Vercel
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Helper function to run a command and handle errors
function runCommand(command, description) {
  console.log(`\n${colors.blue}${colors.bold}${description}${colors.reset}`);
  console.log(`${colors.cyan}$ ${command}${colors.reset}`);

  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`\n${colors.red}${colors.bold}ERROR: ${description} failed${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    return false;
  }
}

// Main deployment function
async function deploy() {
  console.log(`\n${colors.cyan}${colors.bold}=== Bedtime Stories Deployment ====${colors.reset}\n`);
  console.log(
    `${colors.yellow}Starting deployment process at ${new Date().toLocaleString()}${colors.reset}`
  );

  // Step 1: Verify deployment readiness
  if (!runCommand('npm run verify:deployment', 'Verifying deployment readiness')) {
    console.error(
      `\n${colors.red}${colors.bold}Deployment verification failed. Please fix the issues before deploying.${colors.reset}`
    );
    process.exit(1);
  }

  // Ask for confirmation before proceeding
  console.log(`\n${colors.yellow}${colors.bold}Ready to deploy to production.${colors.reset}`);
  console.log(`${colors.yellow}This will deploy the application to Vercel.${colors.reset}`);
  console.log(
    `${colors.yellow}Press Ctrl+C to cancel or wait 5 seconds to continue...${colors.reset}`
  );

  // Wait for 5 seconds to allow cancellation
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Step 2: Clean build directory
  if (!runCommand('npm run build:clean', 'Cleaning build directory')) {
    console.error(`\n${colors.red}${colors.bold}Failed to clean build directory.${colors.reset}`);
    process.exit(1);
  }

  // Step 3: Build with Sentry source maps
  if (!runCommand('npm run build:sentry', 'Building application with Sentry source maps')) {
    console.error(`\n${colors.red}${colors.bold}Build failed.${colors.reset}`);
    process.exit(1);
  }

  // Step 4: Deploy to Vercel
  if (!runCommand('npm run deploy:vercel', 'Deploying to Vercel')) {
    console.error(`\n${colors.red}${colors.bold}Deployment to Vercel failed.${colors.reset}`);
    process.exit(1);
  }

  // Deployment complete
  console.log(`\n${colors.green}${colors.bold}=== Deployment Complete ====${colors.reset}`);
  console.log(
    `${colors.green}Deployment completed successfully at ${new Date().toLocaleString()}${colors.reset}`
  );
  console.log(`${colors.green}Your application is now live on Vercel!${colors.reset}`);

  // Post-deployment instructions
  console.log(`\n${colors.cyan}${colors.bold}Post-Deployment Steps:${colors.reset}`);
  console.log(
    `${colors.cyan}1. Verify the application is working correctly in production${colors.reset}`
  );
  console.log(`${colors.cyan}2. Check Sentry for any errors${colors.reset}`);
  console.log(`${colors.cyan}3. Monitor performance in Vercel Analytics${colors.reset}`);
}

// Run the deployment
deploy().catch((error) => {
  console.error(
    `\n${colors.red}${colors.bold}Deployment failed with an unexpected error:${colors.reset}`
  );
  console.error(error);
  process.exit(1);
});
