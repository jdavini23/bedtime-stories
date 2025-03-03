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

try {
  // Read and update package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Fix OpenTelemetry API version
  if (packageJson.dependencies['@opentelemetry/api']) {
    packageJson.dependencies['@opentelemetry/api'] = '1.8.0';
    console.log('✅ Updated @opentelemetry/api to version 1.8.0 in package.json');
  }
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  // Read and update vercel.json
  if (fs.existsSync(vercelJsonPath)) {
    const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    
    // Update install command to use legacy-peer-deps
    if (vercelJson.installCommand !== 'npm ci --legacy-peer-deps') {
      vercelJson.installCommand = 'npm ci --legacy-peer-deps';
      console.log('✅ Updated installCommand in vercel.json to use --legacy-peer-deps');
      
      // Write updated vercel.json
      fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
    } else {
      console.log('ℹ️ vercel.json already has the correct installCommand');
    }
  } else {
    console.log('⚠️ vercel.json not found, creating it...');
    
    // Create basic vercel.json
    const vercelJson = {
      "version": 2,
      "buildCommand": "npm run build",
      "installCommand": "npm ci --legacy-peer-deps",
      "framework": "nextjs"
    };
    
    fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
    console.log('✅ Created vercel.json with correct installCommand');
  }
  
  console.log('');
  console.log('✅ Project prepared for Vercel deployment!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Commit these changes');
  console.log('2. Push to your repository');
  console.log('3. Run your Vercel deployment');
  
} catch (error) {
  console.error('❌ Error preparing project for Vercel:', error);
  process.exit(1);
}
