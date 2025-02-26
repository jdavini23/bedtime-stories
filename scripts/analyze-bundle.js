// This script runs the webpack bundle analyzer to help identify large dependencies

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure the script directory exists
const scriptDir = path.join(process.cwd(), 'scripts');
if (!fs.existsSync(scriptDir)) {
  fs.mkdirSync(scriptDir, { recursive: true });
}

console.log('🔍 Starting bundle analysis in static mode...');

try {
  // Run the Next.js build with the ANALYZE flag in static mode
  execSync('cross-env ANALYZE=true ANALYZE_MODE=static next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      ANALYZE: 'true',
      ANALYZE_MODE: 'static',
    },
  });

  console.log('✅ Bundle analysis complete! Check the report files in .next/analyze/ directory.');
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
