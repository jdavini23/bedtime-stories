// Script to fix deployment issues
const fs = require('fs');
const path = require('path');

console.log('Starting deployment fixes...');

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(`Error checking if file exists: ${filePath}`, err);
    return false;
  }
}

// Function to create a backup of a file
function backupFile(filePath) {
  try {
    const backupPath = `${filePath}.backup-${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`Created backup of ${filePath} at ${backupPath}`);
    return true;
  } catch (err) {
    console.error(`Error creating backup of ${filePath}`, err);
    return false;
  }
}

// Check and fix middleware
const srcMiddlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
const rootMiddlewarePath = path.join(process.cwd(), 'middleware.js');

if (!fileExists(srcMiddlewarePath) && !fileExists(rootMiddlewarePath)) {
  console.log('Creating middleware file...');
  const middlewareContent = `// Middleware for Clerk authentication
import { clerkMiddleware } from '@clerk/nextjs/server';

// Export the middleware function
export default clerkMiddleware();

// Export the config for Next.js
export const config = {
  matcher: [
    '/((?!.+\\\\.[\\\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};`;

  try {
    fs.writeFileSync(rootMiddlewarePath, middlewareContent);
    console.log(`Created middleware file at ${rootMiddlewarePath}`);
  } catch (err) {
    console.error(`Error creating middleware file`, err);
  }
}

// Check and fix .env.production
const envProductionPath = path.join(process.cwd(), '.env.production');
if (fileExists(envProductionPath)) {
  console.log('Checking .env.production file...');
  try {
    const envContent = fs.readFileSync(envProductionPath, 'utf8');
    if (envContent.includes('${')) {
      console.log('Found variable references in .env.production, fixing...');
      if (backupFile(envProductionPath)) {
        const fixedContent = envContent.replace(/\${([^}]+)}/g, '$1_PLACEHOLDER');
        fs.writeFileSync(envProductionPath, fixedContent);
        console.log('Fixed .env.production file');
      }
    }
  } catch (err) {
    console.error('Error fixing .env.production file', err);
  }
}

// Check and fix vercel.json
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
if (fileExists(vercelJsonPath)) {
  console.log('Checking vercel.json file...');
  try {
    const vercelContent = fs.readFileSync(vercelJsonPath, 'utf8');
    if (vercelContent.includes('${')) {
      console.log('Found variable references in vercel.json, fixing...');
      if (backupFile(vercelJsonPath)) {
        const fixedContent = vercelContent.replace(/"\${([^}]+)}"/g, '"$1_PLACEHOLDER"');
        fs.writeFileSync(vercelJsonPath, fixedContent);
        console.log('Fixed vercel.json file');
      }
    }
  } catch (err) {
    console.error('Error fixing vercel.json file', err);
  }
}

console.log('Deployment fixes completed');
