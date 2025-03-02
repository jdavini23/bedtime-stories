const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define update groups based on dependency relationships
const updateGroups = [
  // Group 1: TypeScript and related
  {
    name: 'TypeScript Ecosystem',
    packages: [
      '@types/node@22.13.8',
      '@types/react@19.0.10',
      '@typescript-eslint/eslint-plugin@8.25.0',
      '@typescript-eslint/parser@8.25.0',
      'typescript@5.8.2',
    ],
  },
  // Group 2: React and related
  {
    name: 'React Ecosystem',
    packages: ['react@19.0.0', 'react-dom@19.0.0', 'eslint-plugin-react-hooks@5.2.0'],
  },
  // Group 3: Build and style tools
  {
    name: 'Build and Style Tools',
    packages: ['tailwindcss@4.0.9', 'tailwind-merge@3.0.2', 'framer-motion@12.4.7'],
  },
  // Group 4: Development tools
  {
    name: 'Development Tools',
    packages: ['eslint@9.21.0', 'eslint-config-prettier@10.0.2', 'globals@16.0.0'],
  },
  // Group 5: Infrastructure
  {
    name: 'Infrastructure',
    packages: ['@vercel/kv@3.0.0'],
  },
];

function backupPackageFiles() {
  const files = ['package.json', 'package-lock.json'];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, `${file}.backup-${timestamp}`);
    }
  });
}

function updateGroup(group) {
  console.log(`\nUpdating ${group.name}...`);
  try {
    execSync(`npm install ${group.packages.join(' ')} --save-exact`, { stdio: 'inherit' });
    console.log(`✓ Successfully updated ${group.name}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to update ${group.name}`);
    console.error(error.message);
    return false;
  }
}

function runTests() {
  try {
    console.log('\nRunning tests...');
    execSync('npm test', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('✗ Tests failed');
    return false;
  }
}

function main() {
  console.log('Starting dependency update process...');
  backupPackageFiles();

  let success = true;
  for (const group of updateGroups) {
    if (!updateGroup(group)) {
      success = false;
      break;
    }

    if (!runTests()) {
      success = false;
      break;
    }
  }

  if (success) {
    console.log('\n✓ All updates completed successfully');
  } else {
    console.log('\n✗ Update process failed. Please restore from backup if needed.');
  }
}

main();
