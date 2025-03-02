/**
 * Restore the original next.config.js with Sentry configuration
 */

const fs = require('fs');
const path = require('path');

const nextConfigPath = path.join(process.cwd(), 'next.config.js');
const backupPath = path.join(process.cwd(), 'next.config.js.backup');

// Check if a backup exists
if (!fs.existsSync(backupPath)) {
  console.error('No backup file found at:', backupPath);
  console.error('Cannot restore the original configuration.');
  process.exit(1);
}

// Restore the original config
fs.copyFileSync(backupPath, nextConfigPath);
console.log('Restored original next.config.js with Sentry configuration');

// Optionally remove the backup
// fs.unlinkSync(backupPath);
// console.log('Removed backup file');
