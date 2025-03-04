#!/usr/bin/env node

/**
 * This script handles the deployment process to Vercel
 * It resolves dependency conflicts and provides a clean deployment experience
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for prettier console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

// Helper function to execute commands and handle errors
function runCommand(command, options = {}) {
  try {
    console.log(`${colors.dim}> ${command}${colors.reset}`);
    return execSync(command, {
      stdio: 'inherit',
      ...options,
    });
  } catch (error) {
    console.error(`${colors.red}Command failed: ${command}${colors.reset}`);
    if (!options.ignoreError) {
      process.exit(1);
    }
    return false;
  }
}

// Print header
console.log(
  `\n${colors.bgBlue}${colors.white}${colors.bright} VERCEL DEPLOYMENT HELPER ${colors.reset}\n`
);
console.log(
  `${colors.cyan}This script will prepare and deploy your project to Vercel${colors.reset}\n`
);

// Step 1: Prepare the project for deployment
console.log(`${colors.yellow}Step 1: Preparing project for deployment...${colors.reset}`);

// Fix package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Fix OpenTelemetry API version
if (packageJson.dependencies['@opentelemetry/api']) {
  const currentVersion = packageJson.dependencies['@opentelemetry/api'];
  packageJson.dependencies['@opentelemetry/api'] = '1.8.0';
  console.log(
    `${colors.green}✓ Updated @opentelemetry/api from ${currentVersion} to 1.8.0${colors.reset}`
  );
}

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Fix vercel.json
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

  // Update install command
  if (vercelJson.installCommand !== 'npm ci --legacy-peer-deps') {
    vercelJson.installCommand = 'npm ci --legacy-peer-deps';
    fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
    console.log(`${colors.green}✓ Updated vercel.json to use --legacy-peer-deps${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ vercel.json already configured correctly${colors.reset}`);
  }
} else {
  console.log(`${colors.yellow}! vercel.json not found, creating it...${colors.reset}`);
  const vercelJson = {
    version: 2,
    buildCommand: 'npm run build',
    installCommand: 'npm ci --legacy-peer-deps',
    framework: 'nextjs',
  };
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
  console.log(`${colors.green}✓ Created vercel.json with correct configuration${colors.reset}`);
}

// Step 2: Verify environment variables
console.log(`\n${colors.yellow}Step 2: Verifying environment variables...${colors.reset}`);
try {
  runCommand('node scripts/verify-env.js', { ignoreError: true });
} catch (error) {
  console.log(
    `${colors.yellow}! Environment verification script not found or failed${colors.reset}`
  );
}

// Step 3: Clean build artifacts
console.log(`\n${colors.yellow}Step 3: Cleaning build artifacts...${colors.reset}`);
try {
  runCommand('npm run build:clean', { ignoreError: true });
  console.log(`${colors.green}✓ Build artifacts cleaned${colors.reset}`);
} catch (error) {
  console.log(`${colors.yellow}! Could not clean build artifacts${colors.reset}`);
}

// Step 4: Commit changes
console.log(`\n${colors.yellow}Step 4: Commit changes? (y/n)${colors.reset}`);
process.stdout.write('> ');
process.stdin.once('data', (data) => {
  const input = data.toString().trim().toLowerCase();

  if (input === 'y' || input === 'yes') {
    const commitMessage = 'fix: resolve dependency conflicts for Vercel deployment';
    runCommand(`git add package.json vercel.json`);
    runCommand(`git commit -m "${commitMessage}"`);
    console.log(`${colors.green}✓ Changes committed${colors.reset}`);

    // Step 5: Push changes
    console.log(`\n${colors.yellow}Step 5: Push changes to remote? (y/n)${colors.reset}`);
    process.stdout.write('> ');
    process.stdin.once('data', (data) => {
      const pushInput = data.toString().trim().toLowerCase();

      if (pushInput === 'y' || pushInput === 'yes') {
        runCommand('git push');
        console.log(`${colors.green}✓ Changes pushed to remote${colors.reset}`);
        deployToVercel();
      } else {
        console.log(`${colors.yellow}! Skipping push to remote${colors.reset}`);
        deployToVercel();
      }
    });
  } else {
    console.log(`${colors.yellow}! Skipping commit${colors.reset}`);
    deployToVercel();
  }
});

function deployToVercel() {
  // Step 6: Deploy to Vercel
  console.log(`\n${colors.yellow}Step 6: Deploy to Vercel? (y/n)${colors.reset}`);
  process.stdout.write('> ');
  process.stdin.once('data', (data) => {
    const deployInput = data.toString().trim().toLowerCase();

    if (deployInput === 'y' || deployInput === 'yes') {
      console.log(`\n${colors.magenta}Deploying to Vercel...${colors.reset}`);
      runCommand('npx vercel --prod');
      console.log(`\n${colors.green}${colors.bright}✓ Deployment complete!${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}! Skipping deployment${colors.reset}`);
      console.log(
        `\n${colors.cyan}Project is ready for deployment. Run 'npx vercel --prod' when you're ready to deploy.${colors.reset}`
      );
    }

    console.log(`\n${colors.green}${colors.bright}All done! 🎉${colors.reset}\n`);
  });
}
