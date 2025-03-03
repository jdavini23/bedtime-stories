#!/usr/bin/env node

/**
 * This script fixes dependency conflicts for Vercel deployment
 * It specifically addresses the OpenTelemetry API version conflict
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing dependency conflicts for Vercel deployment...');

// Backup package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const backupPath = path.join(process.cwd(), `package.json.backup-${new Date().toISOString().replace(/:/g, '-')}`);

try {
  // Read the current package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Backup the current package.json
  fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Created backup at ${backupPath}`);
  
  // Fix the OpenTelemetry API version
  if (packageJson.dependencies['@opentelemetry/api']) {
    const currentVersion = packageJson.dependencies['@opentelemetry/api'];
    console.log(`Current @opentelemetry/api version: ${currentVersion}`);
    
    // Set to a compatible version
    packageJson.dependencies['@opentelemetry/api'] = '1.8.0';
    console.log('✅ Updated @opentelemetry/api to version 1.8.0');
    
    // Write the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    // Clean npm cache and reinstall dependencies
    console.log('🧹 Cleaning npm cache...');
    execSync('npm cache clean --force', { stdio: 'inherit' });
    
    console.log('📦 Reinstalling dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('✅ Dependencies updated successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Commit these changes');
    console.log('2. Push to your repository');
    console.log('3. Retry your Vercel deployment');
  } else {
    console.log('❓ @opentelemetry/api not found in dependencies');
  }
} catch (error) {
  console.error('❌ Error fixing dependencies:', error);
  process.exit(1);
}
