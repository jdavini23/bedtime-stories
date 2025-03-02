/**
 * Environment Script Generator
 *
 * This script generates shell scripts for setting environment variables
 * without storing actual secrets in the repository.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

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

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: 'powershell', // default
    envFile: '.env.local',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--type' && i + 1 < args.length) {
      options.type = args[i + 1].toLowerCase();
      i++;
    } else if (arg === '--env-file' && i + 1 < args.length) {
      options.envFile = args[i + 1];
      i++;
    }
  }

  return options;
}

// Load environment variables from file
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

// Generate PowerShell script
function generatePowerShellScript(envVars) {
  let script = '# PowerShell script to set environment variables\n';
  script += '# Generated on ' + new Date().toISOString() + '\n';
  script += '# This file should not be committed to version control\n\n';

  Object.entries(envVars).forEach(([key, value]) => {
    // Escape single quotes in the value
    const escapedValue = value.replace(/'/g, "''");
    script += `$env:${key} = '${escapedValue}'\n`;
  });

  script += "\nWrite-Host 'Environment variables set successfully' -ForegroundColor Green\n";
  return script;
}

// Generate CMD batch script
function generateBatchScript(envVars) {
  let script = '@echo off\n';
  script += ':: Batch script to set environment variables\n';
  script += ':: Generated on ' + new Date().toISOString() + '\n';
  script += ':: This file should not be committed to version control\n\n';

  Object.entries(envVars).forEach(([key, value]) => {
    // Escape special characters in the value
    const escapedValue = value.replace(/%/g, '%%').replace(/[&|<>^]/g, '^$&');
    script += `set "${key}=${escapedValue}"\n`;
  });

  script += '\necho Environment variables set successfully\n';
  return script;
}

// Generate a unique filename with timestamp and random hash
function generateUniqueFilename(prefix, extension) {
  const timestamp = Date.now();
  const randomHash = crypto.randomBytes(4).toString('hex');
  return `${prefix}-${timestamp}-${randomHash}.${extension}`;
}

// Main function
function generateEnvScript() {
  const options = parseArgs();
  console.log(`${colors.cyan}${colors.bold}Environment Script Generator${colors.reset}\n`);
  console.log(`${colors.blue}Options:${colors.reset}`);
  console.log(`  Type: ${options.type}`);
  console.log(`  Environment file: ${options.envFile}\n`);

  // Load environment variables
  const envVars = loadEnvFile(options.envFile);
  if (Object.keys(envVars).length === 0) {
    console.error(`${colors.red}No environment variables found. Exiting.${colors.reset}`);
    process.exit(1);
  }

  console.log(
    `${colors.green}Loaded ${Object.keys(envVars).length} environment variables from ${options.envFile}${colors.reset}`
  );

  // Generate script based on type
  let scriptContent = '';
  let fileExtension = '';

  if (options.type === 'powershell') {
    scriptContent = generatePowerShellScript(envVars);
    fileExtension = 'ps1';
    console.log(`${colors.blue}Generating PowerShell script...${colors.reset}`);
  } else if (options.type === 'cmd') {
    scriptContent = generateBatchScript(envVars);
    fileExtension = 'bat';
    console.log(`${colors.blue}Generating CMD batch script...${colors.reset}`);
  } else {
    console.error(`${colors.red}Unsupported script type: ${options.type}${colors.reset}`);
    process.exit(1);
  }

  // Create a unique filename
  const filename = generateUniqueFilename('env-setup', fileExtension);
  const filePath = path.join(process.cwd(), filename);

  // Write the script to a file
  try {
    fs.writeFileSync(filePath, scriptContent);
    console.log(`${colors.green}Script generated successfully: ${filePath}${colors.reset}`);

    // Add a .gitignore entry if it doesn't exist
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    let gitignoreContent = '';

    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    // Check if env-setup* is already in .gitignore
    if (!gitignoreContent.includes('env-setup*')) {
      const newGitignoreContent =
        gitignoreContent +
        (gitignoreContent.endsWith('\n') ? '' : '\n') +
        '# Environment setup scripts\nenv-setup*\n';

      fs.writeFileSync(gitignorePath, newGitignoreContent);
      console.log(`${colors.green}Added env-setup* to .gitignore${colors.reset}`);
    }

    // Print usage instructions
    console.log(`\n${colors.cyan}${colors.bold}Usage Instructions:${colors.reset}`);
    if (options.type === 'powershell') {
      console.log(
        `Run the script in PowerShell with: ${colors.green}. ./${filename}${colors.reset}`
      );
    } else {
      console.log(
        `Run the script in Command Prompt with: ${colors.green}${filename}${colors.reset}`
      );
    }

    console.log(
      `\n${colors.yellow}Note: This script contains sensitive information and should not be shared or committed to version control.${colors.reset}`
    );
    console.log(
      `${colors.yellow}The script has been added to .gitignore to prevent accidental commits.${colors.reset}`
    );
  } catch (error) {
    console.error(`${colors.red}Error writing script file:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run the generator
generateEnvScript();
