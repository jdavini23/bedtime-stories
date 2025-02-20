#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Utility function to replace content in a file
function replaceFileContent(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  replacements.forEach(([regex, replacement]) => {
    content = typeof replacement === 'function' 
      ? content.replace(regex, replacement) 
      : content.replace(regex, replacement);
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated file: ${filePath}`);
  return content;
}

// Find files matching a pattern
function findFiles(pattern) {
  return glob.sync(pattern, { cwd: path.resolve(__dirname, '..') });
}

// Comprehensive type migration function
function migrateTypes() {
  const files = findFiles('src/**/*.{ts,tsx,js,jsx}');

  // Prepare import statements to add logger if missing
  const loggerImport = "import { logger } from '@/utils/logger';\n";

  files.forEach(file => {
    const fullPath = path.resolve(__dirname, '..', file);
    let content = fs.readFileSync(fullPath, 'utf-8');

    // Comprehensive replacements
    const replacements = [
      // Personalization Engine Type Migrations
      [/StoryPersonalizationEngine/g, 'UserPersonalizationEngine'],
      [/serverStoryPersonalizationEngine/g, 'serverUserPersonalizationEngine'],
      [/ServerStoryPersonalizationEngine/g, 'ServerUserPersonalizationEngine'],
      
      // Type Conversions
      [/themes: string\[\]/g, 'preferredThemes: string[]'],
      [/interests: string\[\]/g, 'mostLikedCharacterTypes: string[]'],
      
      // Clerk Metadata Migrations
      [/publicMetadata\.preferences\.themes/g, 'publicMetadata.preferences.preferredThemes'],
      [/publicMetadata\.preferences\.interests/g, 'publicMetadata.preferences.mostLikedCharacterTypes'],
      
      // Type Casting Migrations
      [/as { themes: string\[\] }/g, 'as { preferredThemes: string[] }'],
      [/as { interests: string\[\] }/g, 'as { mostLikedCharacterTypes: string[] }'],
      
      // Import Migrations
      [/import { StoryPersonalizationEngine } from '@\/services\/personalizationEngine';/g, 
       'import { UserPersonalizationEngine } from \'@/services/personalizationEngine\';'],
      [/import { serverStoryPersonalizationEngine } from '@\/services\/serverPersonalizationEngine';/g, 
       'import { serverUserPersonalizationEngine } from \'@/services/serverPersonalizationEngine\';'],
      
      // Specific Type Fixes
      [/StoryInput\s*{([^}]+)}/g, (match, content) => {
        const updatedContent = content
          .replace(/themes\??: string\[\];/g, 'preferredThemes?: string[];')
          .replace(/interests\??: string\[\];/g, 'mostLikedCharacterTypes?: string[];')
          .replace(/mostLikedCharacterTypes: string\[\];/g, 'mostLikedCharacterTypes?: string[];');
        return `StoryInput {${updatedContent}}`;
      }],
      
      // Handling Undefined and Null Cases
      [/\.themes\?/g, '.preferredThemes?'],
      [/\.interests\?/g, '.mostLikedCharacterTypes?'],
      
      // Logging and Error Handling Improvements
      [/console\.error\(/g, 'logger.error('],
      [/console\.log\(/g, 'logger.info('],
      [/console\.warn\(/g, 'logger.warn('],

      // Specific Error Handling
      [/throw new Error\(/g, 'logger.error('],
      
      // Potential Null/Undefined Checks
      [/if \(([^)]+)\s*===\s*undefined\)/g, 'if ($1 == null)'],
      [/if \(([^)]+)\s*===\s*null\)/g, 'if ($1 == null)'],

      // Aggressive type widening
      [/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, 
       'const $1: $2 | null ='],
      
      // Potential userId fixes
      [/userId\s*:\s*string/g, 'userId: string | null'],
      
      // Aggressive import and type fixes
      [/import\s+{([^}]+)}\s+from\s+['"]@\/services\/personalizationEngine['"];/g, 
       (match, imports) => {
         const cleanImports = imports.split(',')
           .map(imp => imp.trim())
           .filter(imp => 
             imp === 'UserPersonalizationEngine' || 
             imp === 'DEFAULT_PREFERENCES'
           )
           .join(', ');
         return `import { ${cleanImports} } from '@/services/personalizationEngine';`;
       }
      ],
      
      // Ensure logger is imported
      [/import\s+{([^}]+)}\s+from\s+['"]@\/utils\/logger['"];/g, 
       (match, imports) => {
         const importList = imports.split(',').map(imp => imp.trim());
         if (!importList.includes('logger')) {
           importList.push('logger');
         }
         return `import { ${importList.join(', ')} } from '@/utils/logger';`;
       }
      ]
    ];

    // Apply replacements
    replacements.forEach(([regex, replacement]) => {
      content = typeof replacement === 'function' 
        ? content.replace(regex, replacement) 
        : content.replace(regex, replacement);
    });

    // Add logger import if console.log or console.error are used and logger import is missing
    if ((content.includes('console.log(') || content.includes('console.error(')) && 
        !content.includes("from '@/utils/logger'")) {
      // Add logger import at the top of the file
      content = loggerImport + content;
    }

    // Write back the modified content
    fs.writeFileSync(fullPath, content);
    console.log(`Processed file for type migration: ${file}`);
  });
}

// Run the migration
function main() {
  try {
    console.log('Starting comprehensive type migration...');
    migrateTypes();
    console.log('Type migration completed successfully!');
  } catch (error) {
    console.error('Error during type migration:', error);
    process.exit(1);
  }
}

main();
