import { Project } from 'ts-morph';
import path from 'path';
import fs from 'fs';

const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
});

// Add source files
project.addSourceFilesAtPaths('src/**/*.{ts,tsx}');

// Install required dependencies
function installDependencies() {
  const { execSync } = require('child_process');
  console.log('Installing required dependencies...');
  execSync('npm install --save-dev ts-morph @types/node');
}

function fixTypeErrors() {
  // Install dependencies first
  installDependencies();

  // Add missing type declarations
  const typeDeclarations = {
    Story: `
      export interface Story {
        id: string;
        title: string;
        content: string;
        theme: string;
        createdAt: string;
        input: StoryInput;
        metadata: {
          pronouns: string;
          possessivePronouns: string;
          generatedAt: string;
        };
        userId?: string;
        pronouns: string;
        possessivePronouns: string;
        generatedAt: string;
      }
    `,
    StoryInput: `
      export interface StoryInput {
        childName: string;
        gender: 'boy' | 'girl' | 'other';
        theme: string;
        interests: string[];
        favoriteCharacters?: string[];
        mood?: string;
        themes?: string[];
      }
    `,
    UserPreferences: `
      export interface UserPreferences {
        id?: string;
        userId: string | null;
        preferredThemes: string[];
        generatedStoryCount: number;
        lastStoryGeneratedAt?: Date;
        learningInterests: string[];
        ageGroup: '3-5' | '6-8' | '9-12';
        theme: 'light' | 'dark';
        language: string;
        notifications: {
          email: boolean;
          push: boolean;
          frequency: 'daily' | 'weekly' | 'monthly';
        };
        createdAt?: Date;
        updatedAt?: Date;
      }
    `,
  };

  // Create or update type definitions
  const typesDir = path.join(process.cwd(), 'src', 'types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Write story types
  fs.writeFileSync(
    path.join(typesDir, 'story.ts'),
    `${typeDeclarations.Story}\n${typeDeclarations.StoryInput}\n${typeDeclarations.UserPreferences}`
  );

  // Fix clerk-auth test issues
  const testFile = project.getSourceFileOrThrow('src/__tests__/clerk-auth.test.ts');
  testFile.getImportDeclarations().forEach((importDecl) => {
    if (importDecl.getModuleSpecifierValue() === '@/types/story') {
      importDecl.addNamedImport('UserPreferences');
    }
  });

  // Fix server personalization engine
  const serverPersonalizationFile = project.getSourceFileOrThrow(
    'src/services/serverPersonalizationEngine.ts'
  );
  serverPersonalizationFile.getImportDeclarations().forEach((importDecl) => {
    if (importDecl.getModuleSpecifierValue() === '@/types/story') {
      importDecl.addNamedImport('UserPreferences');
    }
  });

  try {
    // Save all changes
    project.saveSync();
    console.log('Type fixes applied successfully!');
  } catch (error) {
    console.error('Error applying type fixes:', error);
    process.exit(1);
  }
}

fixTypeErrors();
