#!/usr/bin/env node

/**
 * This script verifies that the dependency conflict fixes are in place
 * before deploying to Vercel
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// ANSI color codes for prettier console output (fallback if chalk is not available)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

// Use chalk if available, otherwise use ANSI colors
const log = {
  success: (msg) =>
    console.log(chalk?.green ? chalk.green('✓ ' + msg) : `${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) =>
    console.log(chalk?.red ? chalk.red('✗ ' + msg) : `${colors.red}✗ ${msg}${colors.reset}`),
  warning: (msg) =>
    console.log(
      chalk?.yellow ? chalk.yellow('! ' + msg) : `${colors.yellow}! ${msg}${colors.reset}`
    ),
  info: (msg) =>
    console.log(chalk?.cyan ? chalk.cyan('ℹ ' + msg) : `${colors.cyan}ℹ ${msg}${colors.reset}`),
  header: (msg) =>
    console.log(chalk?.bold ? chalk.bold(msg) : `${colors.bright}${msg}${colors.reset}`),
};

console.log('\n');
log.header('VERCEL DEPLOYMENT VERIFICATION');
console.log('\nChecking if dependency conflict fixes are in place...\n');

let hasErrors = false;

// Check package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Check OpenTelemetry API version
  if (packageJson.dependencies['@opentelemetry/api'] === '1.8.0') {
    log.success('@opentelemetry/api version is correctly set to 1.8.0');
  } else {
    log.error(
      `@opentelemetry/api version is ${packageJson.dependencies['@opentelemetry/api']} but should be 1.8.0`
    );
    hasErrors = true;
  }

  // Check if deploy:fix script exists
  if (packageJson.scripts['deploy:fix']) {
    log.success('deploy:fix script is present');
  } else {
    log.warning('deploy:fix script is missing');
  }

  // Check if fix:dependencies script exists
  if (packageJson.scripts['fix:dependencies']) {
    log.success('fix:dependencies script is present');
  } else {
    log.warning('fix:dependencies script is missing');
  }
} catch (error) {
  log.error(`Failed to read or parse package.json: ${error.message}`);
  hasErrors = true;
}

// Check vercel.json
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
try {
  if (fs.existsSync(vercelJsonPath)) {
    const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

    // Check installCommand
    if (vercelJson.installCommand === 'npm ci --legacy-peer-deps') {
      log.success('vercel.json installCommand is correctly set to use --legacy-peer-deps');
    } else {
      log.error(
        `vercel.json installCommand is "${vercelJson.installCommand}" but should be "npm ci --legacy-peer-deps"`
      );
      hasErrors = true;
    }
  } else {
    log.error('vercel.json file is missing');
    hasErrors = true;
  }
} catch (error) {
  log.error(`Failed to read or parse vercel.json: ${error.message}`);
  hasErrors = true;
}

// Check if helper scripts exist
const deployToVercelPath = path.join(process.cwd(), 'scripts', 'deploy-to-vercel.js');
const fixDependencyConflictPath = path.join(process.cwd(), 'scripts', 'fix-dependency-conflict.js');

if (fs.existsSync(deployToVercelPath)) {
  log.success('deploy-to-vercel.js script is present');
} else {
  log.warning('deploy-to-vercel.js script is missing');
}

if (fs.existsSync(fixDependencyConflictPath)) {
  log.success('fix-dependency-conflict.js script is present');
} else {
  log.warning('fix-dependency-conflict.js script is missing');
}

console.log('\n');
if (hasErrors) {
  log.error('Some issues were found that might prevent successful deployment');
  log.info('Please fix the issues above before deploying to Vercel');
  process.exit(1);
} else {
  log.success('All dependency conflict fixes are in place!');
  log.info('You can now deploy to Vercel with:');
  console.log('\n  npx vercel --prod\n');
  process.exit(0);
}
