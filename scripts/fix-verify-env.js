/**
 * Fix Environment Verification Script
 *
 * This script modifies the verify-env.js script to make it more flexible
 * by allowing environment variables to be set either in the process environment
 * or in the .env files.
 */

const fs = require('fs');
const path = require('path');

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

// Main function
function fixVerifyEnv() {
  console.log(
    `${colors.cyan}${colors.bold}Fixing Environment Verification Script${colors.reset}\n`
  );

  // Path to the verify-env.js file
  const verifyEnvPath = path.join(process.cwd(), 'scripts', 'verify-env.js');

  // Check if the file exists
  if (!fs.existsSync(verifyEnvPath)) {
    console.error(
      `${colors.red}Error: verify-env.js does not exist at ${verifyEnvPath}${colors.reset}`
    );
    return;
  }

  // Read the file
  let verifyEnvContent = fs.readFileSync(verifyEnvPath, 'utf8');

  // Make a backup of the original file
  const backupPath = `${verifyEnvPath}.backup-${Date.now()}`;
  fs.writeFileSync(backupPath, verifyEnvContent);
  console.log(`${colors.green}✓ Created backup of verify-env.js at ${backupPath}${colors.reset}`);

  // Modify the verifyEnvironment function to check both process.env and .env files
  const verifyEnvironmentFunctionRegex =
    /function verifyEnvironment\(\) \{[\s\S]*?for \(const \[variable, config\] of Object\.entries\(requiredVariables\)\) \{[\s\S]*?const value = process\.env\[variable\];/g;

  const modifiedVerifyEnvironmentFunction = `function verifyEnvironment() {
  let hasErrors = false;

  console.log('\\x1b[34m\\x1b[1m\\nVerifying environment variables...\\n\\x1b[0m');

  // Load environment variables from .env.local
  const localEnvPath = path.join(process.cwd(), '.env.local');
  const localEnv = fs.existsSync(localEnvPath) ? dotenv.parse(fs.readFileSync(localEnvPath)) : {};

  // Check required variables
  for (const [variable, config] of Object.entries(requiredVariables)) {
    // Check both process.env and localEnv
    const value = process.env[variable] || localEnv[variable];`;

  // Replace the function
  verifyEnvContent = verifyEnvContent.replace(
    verifyEnvironmentFunctionRegex,
    modifiedVerifyEnvironmentFunction
  );

  // Write the modified file
  fs.writeFileSync(verifyEnvPath, verifyEnvContent);
  console.log(
    `${colors.green}✓ Modified verify-env.js to check both process.env and .env files${colors.reset}`
  );

  console.log(`\n${colors.cyan}${colors.bold}Next Steps${colors.reset}`);
  console.log(
    `1. Run ${colors.green}npm run verify:deployment${colors.reset} again to verify your deployment`
  );
}

// Run the fix
fixVerifyEnv();
