/**
 * Sentry Setup Script
 *
 * This script helps set up Sentry authentication and configuration.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

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

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to prompt for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

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

// Main function
async function setupSentry() {
  console.log(`${colors.cyan}${colors.bold}Sentry Setup${colors.reset}\n`);

  // Check if Sentry CLI is installed
  try {
    const sentryVersion = runCommand(
      'npx @sentry/cli --version',
      'Failed to get Sentry CLI version'
    );
    if (sentryVersion) {
      console.log(
        `${colors.green}✓ Sentry CLI is installed (${sentryVersion.trim()})${colors.reset}`
      );
    } else {
      console.log(`${colors.red}✗ Sentry CLI is not installed${colors.reset}`);
      console.log(`${colors.yellow}Installing Sentry CLI...${colors.reset}`);
      runCommand('npm install --save-dev @sentry/cli', 'Failed to install Sentry CLI');
    }
  } catch (error) {
    console.log(`${colors.red}✗ Failed to check Sentry CLI: ${error.message}${colors.reset}`);
    return;
  }

  // Check if .sentryclirc exists
  const sentryCliRcPath = path.join(process.cwd(), '.sentryclirc');
  let sentryCliRcExists = fs.existsSync(sentryCliRcPath);

  if (sentryCliRcExists) {
    console.log(`${colors.green}✓ .sentryclirc file exists${colors.reset}`);

    // Check if token is set
    const sentryCliRc = fs.readFileSync(sentryCliRcPath, 'utf8');
    if (
      sentryCliRc.includes('token=') &&
      !sentryCliRc.includes('token=${SENTRY_AUTH_TOKEN}') &&
      !sentryCliRc.includes('; token=')
    ) {
      console.log(`${colors.green}✓ Sentry auth token is set in .sentryclirc${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ Sentry auth token is not set in .sentryclirc${colors.reset}`);

      // Prompt for auth token
      const authToken = await prompt(
        `${colors.yellow}Enter your Sentry auth token (leave empty to use environment variable): ${colors.reset}`
      );

      if (authToken) {
        // Update .sentryclirc with auth token
        let updatedContent = sentryCliRc.replace(/; token=.*$/m, `token=${authToken}`);
        if (!updatedContent.includes('token=')) {
          updatedContent = updatedContent.replace(/\[auth\]/m, '[auth]\ntoken=' + authToken);
        }
        fs.writeFileSync(sentryCliRcPath, updatedContent);
        console.log(`${colors.green}✓ Updated .sentryclirc with auth token${colors.reset}`);
      } else {
        // Update .sentryclirc to use environment variable
        let updatedContent = sentryCliRc.replace(/; token=.*$/m, 'token=${SENTRY_AUTH_TOKEN}');
        if (!updatedContent.includes('token=')) {
          updatedContent = updatedContent.replace(
            /\[auth\]/m,
            '[auth]\ntoken=${SENTRY_AUTH_TOKEN}'
          );
        }
        fs.writeFileSync(sentryCliRcPath, updatedContent);
        console.log(
          `${colors.green}✓ Updated .sentryclirc to use SENTRY_AUTH_TOKEN environment variable${colors.reset}`
        );
      }
    }
  } else {
    console.log(`${colors.yellow}⚠ .sentryclirc file does not exist${colors.reset}`);

    // Prompt for Sentry organization and project
    const org = await prompt(`${colors.yellow}Enter your Sentry organization: ${colors.reset}`);
    const project = await prompt(`${colors.yellow}Enter your Sentry project: ${colors.reset}`);
    const authToken = await prompt(
      `${colors.yellow}Enter your Sentry auth token (leave empty to use environment variable): ${colors.reset}`
    );

    // Create .sentryclirc file
    const sentryCliRcContent = `[defaults]
org=${org}
project=${project}

[auth]
token=${authToken || '${SENTRY_AUTH_TOKEN}'}

[upload]
wait=true
upload_sources=true
source_maps=true
rewrite=true
validate=true
url_prefix=~/_next
include_sources=true
strip_common_prefix=true
debug=false

[sourcemaps]
assets=.next/**/*.map
filesToDeleteAfterUpload=.next/**/*.map
`;

    fs.writeFileSync(sentryCliRcPath, sentryCliRcContent);
    console.log(`${colors.green}✓ Created .sentryclirc file${colors.reset}`);
  }

  // Test Sentry CLI
  console.log(`\n${colors.blue}Testing Sentry CLI...${colors.reset}`);
  const sentryTest = runCommand('npx @sentry/cli info', 'Failed to test Sentry CLI');

  if (sentryTest) {
    console.log(`${colors.green}✓ Sentry CLI is working correctly${colors.reset}`);
    console.log(sentryTest);
  } else {
    console.log(`${colors.red}✗ Sentry CLI test failed${colors.reset}`);
    console.log(
      `${colors.yellow}Please make sure your auth token is correct and try again${colors.reset}`
    );
  }

  // Update .env.local with Sentry variables if needed
  console.log(`\n${colors.blue}Checking Sentry environment variables...${colors.reset}`);

  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    let envLocal = fs.readFileSync(envLocalPath, 'utf8');

    // Read .sentryclirc to get org and project
    const sentryCliRc = fs.readFileSync(sentryCliRcPath, 'utf8');
    const orgMatch = sentryCliRc.match(/org=([^\n]+)/);
    const projectMatch = sentryCliRc.match(/project=([^\n]+)/);
    const tokenMatch = sentryCliRc.match(/token=([^\n]+)/);

    const org = orgMatch ? orgMatch[1] : '';
    const project = projectMatch ? projectMatch[1] : '';
    const token = tokenMatch ? tokenMatch[1] : '';

    // Check if Sentry variables are in .env.local
    const hasSentryOrg = envLocal.includes('SENTRY_ORG=');
    const hasSentryProject = envLocal.includes('SENTRY_PROJECT=');
    const hasSentryAuthToken = envLocal.includes('SENTRY_AUTH_TOKEN=');

    let updated = false;

    // Add missing variables
    if (!hasSentryOrg && org) {
      envLocal += `\nSENTRY_ORG=${org}`;
      updated = true;
    }

    if (!hasSentryProject && project) {
      envLocal += `\nSENTRY_PROJECT=${project}`;
      updated = true;
    }

    if (!hasSentryAuthToken && token && token !== '${SENTRY_AUTH_TOKEN}') {
      envLocal += `\nSENTRY_AUTH_TOKEN=${token}`;
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(envLocalPath, envLocal);
      console.log(`${colors.green}✓ Updated .env.local with Sentry variables${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ No updates needed for .env.local${colors.reset}`);
    }
  }

  console.log(`\n${colors.cyan}${colors.bold}Sentry Setup Complete${colors.reset}`);
  console.log(`${colors.yellow}Next steps:${colors.reset}`);
  console.log(
    `1. Make sure SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT are set in your Vercel environment`
  );
  console.log(
    `2. Run ${colors.green}npm run verify:deployment${colors.reset} to verify your deployment`
  );

  rl.close();
}

// Run the setup
setupSentry().catch((error) => {
  console.error(`${colors.red}Setup failed with an error:${colors.reset}`, error);
  rl.close();
  process.exit(1);
});
