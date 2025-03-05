const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'pages/404.jsx');

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const newContent = fileContent.replace(/import.*?from ['"]@sentry\/nextjs['"];/g, '').replace(/Sentry\.captureMessage\(.*?\);/g, '');
  fs.writeFileSync(filePath, newContent);
  console.log('Sentry references removed from pages/404.jsx successfully.');
} catch (error) {
  console.error('Error removing Sentry references from pages/404.jsx:', error);
  process.exit(1);
}