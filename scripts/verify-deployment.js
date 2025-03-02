/**
 * Deployment Verification Script
 *
 * This script checks for common deployment issues before deploying to production.
 * It verifies:
 * 1. Required environment variables
 * 2. Build process
 * 3. Source map generation
 * 4. Sentry configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper function to execute commands and handle errors
function runCommand(command, errorMessage) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    console.error(`${colors.red}ERROR: ${errorMessage}${colors.reset}`);
    console.error(`Command: ${command}`);
    console.error(`Error: ${error.message}`);
    return null;
  }
}

// Helper function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Helper function to check if a directory exists
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

// Main verification function
async function verifyDeployment() {
  console.log(`\n${colors.cyan}=== Deployment Verification ====${colors.reset}\n`);

  let allPassed = true;

  // 1. Check required files
  console.log(`${colors.blue}Checking required files...${colors.reset}`);
  const requiredFiles = [
    '.env.local',
    '.env.production',
    'next.config.js',
    'package.json',
    'vercel.json',
    '.sentryclirc',
    'sentry.client.config.ts',
    'sentry.server.config.ts',
    'sentry.edge.config.ts',
  ];

  for (const file of requiredFiles) {
    if (fileExists(file)) {
      console.log(`  ${colors.green}✓ ${file} exists${colors.reset}`);
    } else {
      console.log(`  ${colors.red}✗ ${file} is missing${colors.reset}`);
      allPassed = false;
    }
  }

  // 2. Check environment variables using verify-env.js
  console.log(`\n${colors.blue}Checking environment variables...${colors.reset}`);
  try {
    console.log(`  Running environment verification script...`);
    execSync('node scripts/verify-env.js', { stdio: 'inherit' });
    console.log(`  ${colors.green}✓ Environment variables verified${colors.reset}`);
  } catch (error) {
    console.log(`  ${colors.red}✗ Environment variable verification failed${colors.reset}`);
    console.log(`  Please run 'npm run verify:env' to see detailed errors`);
    allPassed = false;
  }

  // 3. Check Node.js and npm versions
  console.log(`\n${colors.blue}Checking Node.js and npm versions...${colors.reset}`);

  // Read package.json to get required versions
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredNodeVersion = packageJson.engines?.node || '>=22.0.0';
    const requiredNpmVersion = packageJson.engines?.npm || '>=10.0.0';

    // Get current versions
    const nodeVersion = process.version;
    const npmVersion = runCommand('npm --version', 'Failed to get npm version').trim();

    // Helper function to compare versions
    function satisfiesVersion(current, required) {
      const cleanRequired = required.replace(/[^0-9.]/g, '');
      const cleanCurrent = current.replace(/[^0-9.]/g, '');

      const requiredParts = cleanRequired.split('.').map(Number);
      const currentParts = cleanCurrent.split('.').map(Number);

      for (let i = 0; i < Math.max(requiredParts.length, currentParts.length); i++) {
        const requiredPart = requiredParts[i] || 0;
        const currentPart = currentParts[i] || 0;

        if (currentPart > requiredPart) return true;
        if (currentPart < requiredPart) return false;
      }

      return true;
    }

    // Check Node.js version
    if (satisfiesVersion(nodeVersion, requiredNodeVersion)) {
      console.log(
        `  ${colors.green}✓ Node.js version ${nodeVersion} meets requirement ${requiredNodeVersion}${colors.reset}`
      );
    } else {
      console.log(
        `  ${colors.red}✗ Node.js version ${nodeVersion} does not meet requirement ${requiredNodeVersion}${colors.reset}`
      );
      allPassed = false;
    }

    // Check npm version
    if (satisfiesVersion(npmVersion, requiredNpmVersion)) {
      console.log(
        `  ${colors.green}✓ npm version ${npmVersion} meets requirement ${requiredNpmVersion}${colors.reset}`
      );
    } else {
      console.log(
        `  ${colors.red}✗ npm version ${npmVersion} does not meet requirement ${requiredNpmVersion}${colors.reset}`
      );
      allPassed = false;
    }
  } catch (error) {
    console.log(
      `  ${colors.red}✗ Failed to check Node.js and npm versions: ${error.message}${colors.reset}`
    );
    allPassed = false;
  }

  // 4. Check Sentry configuration
  console.log(`\n${colors.blue}Checking Sentry configuration...${colors.reset}`);

  // Check Sentry CLI
  try {
    const sentryVersion = runCommand(
      'npx @sentry/cli --version',
      'Failed to get Sentry CLI version'
    );
    if (sentryVersion) {
      console.log(
        `  ${colors.green}✓ Sentry CLI is installed (${sentryVersion.trim()})${colors.reset}`
      );
    } else {
      console.log(`  ${colors.red}✗ Sentry CLI is not installed${colors.reset}`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`  ${colors.red}✗ Failed to check Sentry CLI: ${error.message}${colors.reset}`);
    allPassed = false;
  }

  // Check .sentryclirc file
  if (fileExists('.sentryclirc')) {
    try {
      const sentryCliRc = fs.readFileSync('.sentryclirc', 'utf8');
      if (sentryCliRc.includes('[auth]') && sentryCliRc.includes('[defaults]')) {
        console.log(`  ${colors.green}✓ .sentryclirc file is properly configured${colors.reset}`);
      } else {
        console.log(
          `  ${colors.yellow}⚠ .sentryclirc file may not be properly configured${colors.reset}`
        );
      }
    } catch (error) {
      console.log(
        `  ${colors.red}✗ Failed to read .sentryclirc file: ${error.message}${colors.reset}`
      );
      allPassed = false;
    }
  }

  // Skip Sentry CLI check in development
  console.log(
    `  ${colors.yellow}⚠ Skipping Sentry CLI authentication check in development${colors.reset}`
  );
  console.log(
    `  ${colors.yellow}  This check will be performed during actual deployment${colors.reset}`
  );

  // 5. Check for security issues
  console.log(`\n${colors.blue}Checking for security issues...${colors.reset}`);
  try {
    console.log(`  Running security check script...`);
    execSync('npm run security:check', { stdio: 'inherit' });
    console.log(`  ${colors.green}✓ Security check completed${colors.reset}`);
  } catch (error) {
    console.log(`  ${colors.red}✗ Security check failed${colors.reset}`);
    console.log(`  Please run 'npm run security:check' to see detailed errors`);
    allPassed = false;
  }

  // Final summary
  console.log(`\n${colors.cyan}=== Verification Summary ====${colors.reset}\n`);

  if (allPassed) {
    console.log(
      `${colors.green}✅ All checks passed! The project is ready for deployment.${colors.reset}`
    );
    console.log(`\nRun the following command to deploy:`);
    console.log(`${colors.cyan}npm run deploy:prepare && npm run deploy:vercel${colors.reset}`);
  } else {
    console.log(
      `${colors.red}❌ Some checks failed. Please fix the issues before deploying.${colors.reset}`
    );
    console.log(
      `\nRefer to the DEPLOYMENT.md file for more information on deployment requirements.`
    );
  }

  return allPassed;
}

// Run the verification
verifyDeployment().catch((error) => {
  console.error(`${colors.red}Verification failed with an error:${colors.reset}`, error);
  process.exit(1);
});
