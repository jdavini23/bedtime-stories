#!/usr/bin/env node

/**
 * This script prepares the project for Vercel deployment
 * It updates package.json and vercel.json to resolve dependency conflicts
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing project for Vercel deployment...');

// Update package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
const backupDir = path.join(process.cwd(), '.backups');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Backup function
function createBackup(filePath, fileName) {
  const timestamp = new Date().toISOString().replace(/[:<>|?*"\\]/g, '-');
  const backupPath = path.join(backupDir, `${fileName}.backup-${timestamp}`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

try {
  // Backup files
  const packageJsonBackup = createBackup(packageJsonPath, 'package.json');
  console.log(`✅ Created package.json backup at ${packageJsonBackup}`);

  if (fs.existsSync(vercelJsonPath)) {
    const vercelJsonBackup = createBackup(vercelJsonPath, 'vercel.json');
    console.log(`✅ Created vercel.json backup at ${vercelJsonBackup}`);
  }

  // Read and update package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  let changesNeeded = false;

  // Fix OpenTelemetry API version
  if (packageJson.dependencies['@opentelemetry/api']) {
    if (packageJson.dependencies['@opentelemetry/api'] !== '1.8.0') {
      packageJson.dependencies['@opentelemetry/api'] = '1.8.0';
      console.log('✅ Updated @opentelemetry/api to version 1.8.0 in package.json');
      changesNeeded = true;
    } else {
      console.log('ℹ️ @opentelemetry/api already at correct version');
    }
  }

  if (changesNeeded) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  // Read and update vercel.json
  if (fs.existsSync(vercelJsonPath)) {
    const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    let vercelChangesNeeded = false;

    // Update install command to use legacy-peer-deps
    if (vercelJson.installCommand !== 'npm ci --legacy-peer-deps') {
      vercelJson.installCommand = 'npm ci --legacy-peer-deps';
      console.log('✅ Updated installCommand in vercel.json to use --legacy-peer-deps');
      vercelChangesNeeded = true;
    } else {
      console.log('ℹ️ vercel.json already has the correct installCommand');
    }

    if (vercelChangesNeeded) {
      fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
    }
  } else {
    console.log('⚠️ vercel.json not found, creating it...');

    // Create basic vercel.json
    const vercelJson = {
      version: 2,
      buildCommand: 'npm run build',
      installCommand: 'npm ci --legacy-peer-deps',
      framework: 'nextjs'
    };

    fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
    console.log('✅ Created vercel.json with correct configuration');
  }

  if (!changesNeeded && !fs.existsSync(vercelJsonPath)) {
    console.log('✅ No changes needed - project is already prepared for Vercel deployment!');
  } else {
    console.log('');
    console.log('✅ Project prepared for Vercel deployment!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Commit these changes');
    console.log('2. Push to your repository');
    console.log('3. Run your Vercel deployment');
  }
} catch (error) {
  console.error('❌ Error preparing project for Vercel:', error);
  process.exit(1);
}
