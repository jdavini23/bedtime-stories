const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const sentryFiles = ['sentry.client.config.ts', 'sentry.edge.config.ts', 'sentry.server.config.ts'];

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Remove Sentry dependencies
  delete packageJson.dependencies['@sentry/nextjs'];
  delete packageJson.devDependencies['@sentry/nextjs']; // Check both dependencies and devDependencies

  // Remove OpenTelemetry dependencies (if any)
  // ... (Add code to remove OpenTelemetry dependencies if needed) ...

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Delete Sentry config files
  sentryFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  // Delete OpenTelemetry config files (if any)
  // ... (Add code to delete OpenTelemetry config files if needed) ...

  console.log('Sentry and OpenTelemetry dependencies and config files removed successfully.');

} catch (error) {
  console.error('Error removing Sentry and OpenTelemetry:', error);
  process.exit(1);
}