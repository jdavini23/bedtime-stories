import fs from 'fs';
import path from 'path';

const BACKUP_DIR = 'clerk-backup';
const PROJECT_ROOT = process.cwd();

// Files and directories to exclude from processing
const EXCLUDE_PATTERNS = ['node_modules', '.git', '.next', 'clerk-backup', 'dist', 'build'];

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

function isExcluded(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => filePath.includes(pattern));
}

function containsClerk(content: string): boolean {
  return (
    content.includes('@clerk') ||
    content.toLowerCase().includes('clerk') ||
    content.includes('ClerkProvider')
  );
}

function backupFile(filePath: string): void {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  const backupDir = path.dirname(backupPath);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  fs.copyFileSync(filePath, backupPath);
  console.log(`Backed up: ${relativePath}`);
}

function processDirectory(dirPath: string): void {
  if (isExcluded(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (!entry.isFile()) continue;

    // Only process certain file types
    if (!/\.(ts|tsx|js|jsx|md|json)$/.test(entry.name)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    if (containsClerk(content)) {
      backupFile(fullPath);

      // If it's a configuration file or a file that's primarily about Clerk, we might want to remove it
      if (entry.name.toLowerCase().includes('clerk')) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Removed Clerk file: ${fullPath}`);
        } catch (error) {
          console.error(`Error removing file ${fullPath}:`, error);
        }
      }
    }
  }
}

console.log('Starting Clerk migration...');
processDirectory(PROJECT_ROOT);
console.log(`Migration complete. Clerk files have been backed up to ${BACKUP_DIR}`);
