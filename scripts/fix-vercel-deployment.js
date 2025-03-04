#!/usr/bin/env node

/**
 * Enhanced script to fix Vercel deployment issues
 * This script addresses dependency conflicts and other common deployment problems
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for prettier console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

// Logging functions
const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}! ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bright}${msg}${colors.reset}`),
};

console.log('\n');
log.header('VERCEL DEPLOYMENT COMPREHENSIVE FIX');
console.log('\nThis script will fix common Vercel deployment issues\n');

// File paths
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageLockPath = path.join(process.cwd(), 'package-lock.json');
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');

// Create backup function
const createBackup = (filePath) => {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.backup-${new Date().toISOString().replace(/:/g, '-')}`;
    fs.copyFileSync(filePath, backupPath);
    log.success(`Created backup at ${path.basename(backupPath)}`);
    return backupPath;
  }
  return null;
};

// Run a command with error handling
const runCommand = (command, message) => {
  try {
    log.info(message || `Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log.error(`Command failed: ${command}`);
    log.error(error.message);
    return false;
  }
};

try {
  // Step 1: Back up important files
  log.header('\nStep 1: Creating backups');
  createBackup(packageJsonPath);
  createBackup(packageLockPath);
  createBackup(vercelJsonPath);

  // Step 2: Fix package.json
  log.header('\nStep 2: Fixing package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Fix OpenTelemetry API version
    if (packageJson.dependencies['@opentelemetry/api']) {
      const currentVersion = packageJson.dependencies['@opentelemetry/api'];
      log.info(`Current @opentelemetry/api version: ${currentVersion}`);

      packageJson.dependencies['@opentelemetry/api'] = '1.8.0';
      log.success('Updated @opentelemetry/api to version 1.8.0');
    } else {
      log.warning('@opentelemetry/api not found in dependencies');
    }

    // Add scripts if they don't exist
    if (!packageJson.scripts['fix:dependencies']) {
      packageJson.scripts['fix:dependencies'] = 'node scripts/fix-dependency-conflict.js';
      log.success('Added fix:dependencies script');
    }

    if (!packageJson.scripts['prepare:vercel']) {
      packageJson.scripts['prepare:vercel'] = 'node scripts/prepare-for-vercel.js';
      log.success('Added prepare:vercel script');
    }

    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    log.success('Updated package.json');
  } else {
    log.error('package.json not found');
    process.exit(1);
  }

  // Step 3: Fix or create vercel.json
  log.header('\nStep 3: Fixing vercel.json');
  let vercelJson;

  if (fs.existsSync(vercelJsonPath)) {
    vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    log.info('Found existing vercel.json');
  } else {
    log.warning('vercel.json not found, creating it');
    vercelJson = {
      version: 2,
      framework: 'nextjs',
    };
  }

  // Update vercel.json settings
  vercelJson.installCommand = 'npm ci --legacy-peer-deps';
  vercelJson.buildCommand = 'npm run build';

  // Write updated vercel.json
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
  log.success('Updated vercel.json with correct configuration');

  // Step 4: Clean build artifacts and node_modules
  log.header('\nStep 4: Cleaning build artifacts');

  // Clean .next directory
  if (fs.existsSync(path.join(process.cwd(), '.next'))) {
    runCommand('rimraf .next', 'Cleaning .next directory');
  } else {
    log.info('.next directory not found, skipping cleanup');
  }

  // Step 5: Clean npm cache and reinstall dependencies
  log.header('\nStep 5: Cleaning npm cache and reinstalling dependencies');

  // Ask user if they want to clean node_modules
  console.log('\nWould you like to clean node_modules and reinstall dependencies?');
  console.log('This is recommended but will take some time.');
  console.log('Enter "y" to proceed or any other key to skip: ');

  // Since we can't get direct input in this script without readline,
  // we'll provide instructions for manual steps

  log.info('To clean node_modules and reinstall dependencies, run these commands:');
  console.log('\n  npm cache clean --force');
  console.log('  rimraf node_modules');
  console.log('  npm install --legacy-peer-deps\n');

  // Step 6: Provide deployment instructions
  log.header('\nStep 6: Deployment instructions');
  log.success('Fixes have been applied!');
  console.log('\nTo deploy to Vercel:');
  console.log('\n1. Commit and push your changes:');
  console.log('   git add .');
  console.log('   git commit -m "Fix Vercel deployment issues"');
  console.log('   git push');
  console.log('\n2. Deploy with Vercel:');
  console.log('   npx vercel --prod');
  console.log('\nIf you encounter issues, try deploying from the Vercel dashboard.');
} catch (error) {
  log.error(`Error fixing Vercel deployment: ${error.message}`);
  console.error(error);
  process.exit(1);
}
