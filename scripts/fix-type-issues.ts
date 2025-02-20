#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

// Utility function to replace content in a file
function replaceFileContent(filePath: string, replacements: Array<[RegExp, string]>) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated file: ${filePath}`);
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
  }`]
  ]);

  // Update serverPersonalizationEngine.ts 
  replaceFileContent(serverPersonalizationEnginePath, [
    [/setUserId\(userId: string \| null\) {[\s\n]+this.userId = userId;[\s\n]+}/, `setUserId(userId: string | null) {
    super.setUserId(userId);
  }`],
    [/if \(!this\.userId\)/, 'if (!this.getUserId())'],
    [/this\.userId/g, 'this.getUserId()']
  ]);

  // Update clerk-auth.test.ts
  replaceFileContent(clerkAuthTestPath, [
    [/import { UserPersonalizationEngine } from '@\/services\/personalizationEngine';/, 
     'import { ServerUserPersonalizationEngine } from \'@/services/serverPersonalizationEngine\';'],
    [/const personalizationEngine = new UserPersonalizationEngine\(TEST_USER_ID\);/, 
     'const personalizationEngine = new ServerUserPersonalizationEngine();\n    personalizationEngine.setUserId(TEST_USER_ID);']
  ]);
}

// Run the fixes
function main() {
  try {
    fixPersonalizationEngineFiles();
    console.log('Type issues fixed successfully!');
  } catch (error) {
    console.error('Error fixing type issues:', error);
    process.exit(1);
  }
}

main();
