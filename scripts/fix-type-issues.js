#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Utility function to replace content in a file
function replaceFileContent(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated file: ${filePath}`);
}

// Find files matching a pattern
function findFiles(pattern) {
  return glob.sync(pattern, { cwd: path.resolve(__dirname, '..') });
}

// Fix personalization engine files
function fixPersonalizationEngineFiles() {
  const personalizationEnginePath = path.resolve(__dirname, '../src/services/personalizationEngine.ts');
  const serverPersonalizationEnginePath = path.resolve(__dirname, '../src/services/serverPersonalizationEngine.ts');
  const clerkAuthTestPath = path.resolve(__dirname, '../src/__tests__/clerk-auth.test.ts');

  // Update personalizationEngine.ts to expose userId methods
  replaceFileContent(personalizationEnginePath, [
    [/private userId: string \| null = null;/, 'protected userId: string | null = null;'],
    [/protected setUserId\(userId: string \| null\) {[\s\n]+this.userId = userId;[\s\n]+}/, `protected setUserId(userId: string | null) {
    this.userId = userId;
  }

  protected getUserId(): string | null {
    return this.userId;
  }`],
    [/themes: string\[\]/g, 'preferredThemes: string[]'],
    [/interests: string\[\]/g, 'mostLikedCharacterTypes: string[]']
  ]);

  // Update serverPersonalizationEngine.ts 
  replaceFileContent(serverPersonalizationEnginePath, [
    [/setUserId\(userId: string \| null\) {[\s\n]+this.userId = userId;[\s\n]+}/, `setUserId(userId: string | null) {
    super.setUserId(userId);
  }`],
    [/if \(!this\.userId\)/, 'if (!this.getUserId())'],
    [/this\.userId/g, 'this.getUserId()'],
    [/themes: string\[\]/g, 'preferredThemes: string[]'],
    [/interests: string\[\]/g, 'mostLikedCharacterTypes: string[]']
  ]);

  // Update clerk-auth.test.ts
  replaceFileContent(clerkAuthTestPath, [
    [/import { UserPersonalizationEngine } from '@\/services\/personalizationEngine';/, 
     'import { ServerUserPersonalizationEngine } from \'@/services/serverPersonalizationEngine\';'],
    [/const personalizationEngine = new UserPersonalizationEngine\(TEST_USER_ID\);/, 
     'const personalizationEngine = new ServerUserPersonalizationEngine();\n    personalizationEngine.setUserId(TEST_USER_ID);']
  ]);
}

// Find and fix type-related issues in other files
function findAndFixTypeIssues() {
  const files = findFiles('src/**/*.{ts,tsx}');

  files.forEach(file => {
    const fullPath = path.resolve(__dirname, '..', file);
    let content = fs.readFileSync(fullPath, 'utf-8');

    // Replace deprecated type references
    const typeReplacements = [
      // Personalization Engine related replacements
      [/StoryPersonalizationEngine/g, 'UserPersonalizationEngine'],
      [/serverStoryPersonalizationEngine/g, 'serverUserPersonalizationEngine'],
      [/ServerStoryPersonalizationEngine/g, 'ServerUserPersonalizationEngine'],
      
      // Type conversions
      [/themes: string\[\]/g, 'preferredThemes: string[]'],
      [/interests: string\[\]/g, 'mostLikedCharacterTypes: string[]'],
      
      // Clerk and Authentication related
      [/publicMetadata\.preferences\.themes/g, 'publicMetadata.preferences.preferredThemes'],
      [/publicMetadata\.preferences\.interests/g, 'publicMetadata.preferences.mostLikedCharacterTypes'],
      
      // Potential type casting
      [/as { themes: string\[\] }/g, 'as { preferredThemes: string[] }'],
      [/as { interests: string\[\] }/g, 'as { mostLikedCharacterTypes: string[] }']
    ];

    typeReplacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });

    // Fix import statements
    const importReplacements = [
      [/import { StoryPersonalizationEngine } from '@\/services\/personalizationEngine';/g, 
       'import { UserPersonalizationEngine } from \'@/services/personalizationEngine\';'],
      [/import { serverStoryPersonalizationEngine } from '@\/services\/serverPersonalizationEngine';/g, 
       'import { serverUserPersonalizationEngine } from \'@/services/serverPersonalizationEngine\';']
    ];

    importReplacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });

    fs.writeFileSync(fullPath, content);
    console.log(`Processed file for type fixes: ${file}`);
  });
}

// Run the fixes
function main() {
  try {
    console.log('Starting type issue fixes...');
    fixPersonalizationEngineFiles();
    findAndFixTypeIssues();
    console.log('Type issues fixed successfully!');
  } catch (error) {
    console.error('Error fixing type issues:', error);
    process.exit(1);
  }
}

main();
