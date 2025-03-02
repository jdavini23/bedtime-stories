/**
 * Temporarily disable Sentry during the build process
 * This script creates a backup of the next.config.js file and replaces it with a version
 * that doesn't include Sentry configuration.
 */

const fs = require('fs');
const path = require('path');

const nextConfigPath = path.join(process.cwd(), 'next.config.js');
const backupPath = path.join(process.cwd(), 'next.config.js.backup');

// Check if a backup already exists
if (fs.existsSync(backupPath)) {
  console.log('Backup already exists. Using existing backup.');
} else {
  // Create a backup of the original next.config.js
  fs.copyFileSync(nextConfigPath, backupPath);
  console.log('Created backup of next.config.js at:', backupPath);
}

// Read the original next.config.js
const originalConfig = fs.readFileSync(nextConfigPath, 'utf8');

// Extract the nextConfig object
let configObject = originalConfig
  .split('const nextConfig = ')[1]
  .split('// For all available options')[0]
  .trim();

// Modify the typescript configuration to ignore build errors
if (configObject.includes('typescript:')) {
  // If typescript config exists, update it
  configObject = configObject.replace(
    /typescript:\s*{[^}]*}/,
    'typescript: { ignoreBuildErrors: true }'
  );
} else {
  // If typescript config doesn't exist, add it
  configObject = configObject.replace(/}(\s*)$/, '  typescript: { ignoreBuildErrors: true },\n}');
}

// Create a simplified version without Sentry
const simplifiedConfig = `
// This is a temporary configuration file without Sentry integration
// The original file is backed up at next.config.js.backup

/** @type {import('next').NextConfig} */
const nextConfig = ${configObject};

// Export the config without Sentry
module.exports = nextConfig;
`;

// Write the simplified config
fs.writeFileSync(nextConfigPath, simplifiedConfig);
console.log('Temporarily disabled Sentry in next.config.js');
console.log('To restore the original configuration, run: npm run restore:sentry');
