/**
 * Security Check Script
 *
 * This script performs a security audit on the project dependencies
 * and provides a summary of vulnerabilities found.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

console.log(`${colors.cyan}${colors.bold}Running Security Check...${colors.reset}\n`);

// Check if .env files contain sensitive information
function checkEnvFiles() {
  console.log(`${colors.cyan}Checking .env files for sensitive information...${colors.reset}`);

  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];

  const sensitivePatterns = [/key/i, /secret/i, /password/i, /token/i, /auth/i];

  let issues = 0;

  envFiles.forEach((file) => {
    const filePath = path.join(process.cwd(), file);

    if (fs.existsSync(filePath)) {
      console.log(`  Checking ${file}...`);

      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line) => {
        if (line.trim() && !line.startsWith('#')) {
          const [key, value] = line.split('=');

          if (key && value) {
            const isSensitive = sensitivePatterns.some((pattern) => pattern.test(key));

            if (isSensitive && value.trim() !== '') {
              console.log(
                `    ${colors.yellow}Warning: Sensitive key found: ${key}${colors.reset}`
              );
              issues++;
            }
          }
        }
      });
    }
  });

  if (issues === 0) {
    console.log(
      `  ${colors.green}No obvious sensitive information found in .env files.${colors.reset}`
    );
  } else {
    console.log(
      `  ${colors.yellow}Found ${issues} potentially sensitive keys in .env files.${colors.reset}`
    );
    console.log(
      `  ${colors.yellow}Make sure these are not committed to version control.${colors.reset}`
    );
  }

  console.log('');
}

// Run npm audit
function runNpmAudit() {
  console.log(`${colors.cyan}Running npm audit...${colors.reset}`);

  try {
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
    const auditData = JSON.parse(auditOutput);

    const vulnerabilities = auditData.vulnerabilities || {};
    const metadata = auditData.metadata || {};

    const totalVulnerabilities = metadata.vulnerabilities?.total || 0;

    if (totalVulnerabilities === 0) {
      console.log(`  ${colors.green}No vulnerabilities found!${colors.reset}`);
    } else {
      console.log(`  ${colors.red}Found ${totalVulnerabilities} vulnerabilities:${colors.reset}`);

      const severityCount = {
        critical: metadata.vulnerabilities?.critical || 0,
        high: metadata.vulnerabilities?.high || 0,
        moderate: metadata.vulnerabilities?.moderate || 0,
        low: metadata.vulnerabilities?.low || 0,
      };

      Object.entries(severityCount).forEach(([severity, count]) => {
        if (count > 0) {
          const color =
            severity === 'critical' || severity === 'high'
              ? colors.red
              : severity === 'moderate'
                ? colors.yellow
                : colors.reset;
          console.log(`    ${color}${severity}: ${count}${colors.reset}`);
        }
      });

      console.log('\n  Vulnerable Dependencies:');

      Object.entries(vulnerabilities).forEach(([name, info]) => {
        console.log(`    ${colors.bold}${name}:${colors.reset}`);
        console.log(`      Severity: ${info.severity}`);
        console.log(
          `      Via: ${info.via.map((v) => (typeof v === 'string' ? v : v.name)).join(', ')}`
        );

        if (info.effects && info.effects.length > 0) {
          console.log(`      Affects: ${info.effects.join(', ')}`);
        }

        if (info.fixAvailable) {
          console.log(`      ${colors.green}Fix available${colors.reset}`);
        } else {
          console.log(`      ${colors.yellow}No direct fix available${colors.reset}`);
        }

        console.log('');
      });

      if (Object.keys(vulnerabilities).length > 0) {
        console.log(`  ${colors.yellow}Run 'npm audit fix' to fix fixable issues.${colors.reset}`);
        console.log(
          `  ${colors.yellow}Run 'npm audit fix --force' to fix all issues (may include breaking changes).${colors.reset}`
        );
      }
    }
  } catch (error) {
    console.error(`  ${colors.red}Error running npm audit:${colors.reset}`, error.message);
  }

  console.log('');
}

// Check for outdated dependencies
function checkOutdatedDependencies() {
  console.log(`${colors.cyan}Checking for outdated dependencies...${colors.reset}`);

  try {
    const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8' });

    if (outdatedOutput.trim() === '') {
      console.log(`  ${colors.green}All dependencies are up to date!${colors.reset}`);
    } else {
      const outdatedData = JSON.parse(outdatedOutput);
      const outdatedCount = Object.keys(outdatedData).length;

      console.log(`  ${colors.yellow}Found ${outdatedCount} outdated dependencies:${colors.reset}`);

      Object.entries(outdatedData).forEach(([name, info]) => {
        const updateType =
          info.current && info.latest ? semverDiff(info.current, info.latest) : 'unknown';

        const updateColor =
          updateType === 'major'
            ? colors.red
            : updateType === 'minor'
              ? colors.yellow
              : updateType === 'patch'
                ? colors.green
                : colors.reset;

        console.log(
          `    ${colors.bold}${name}:${colors.reset} ${info.current} → ${updateColor}${info.latest}${colors.reset} (${updateType})`
        );
      });

      console.log(
        `\n  ${colors.yellow}Run 'npm update' to update to compatible versions.${colors.reset}`
      );
      console.log(
        `  ${colors.yellow}Run 'npm install <package>@latest' to update to latest versions (may include breaking changes).${colors.reset}`
      );
    }
  } catch (error) {
    if (error.status === 1 && error.stdout) {
      // npm outdated returns exit code 1 when there are outdated packages
      try {
        const outdatedData = JSON.parse(error.stdout);
        const outdatedCount = Object.keys(outdatedData).length;

        console.log(
          `  ${colors.yellow}Found ${outdatedCount} outdated dependencies:${colors.reset}`
        );

        Object.entries(outdatedData).forEach(([name, info]) => {
          const updateType =
            info.current && info.latest ? semverDiff(info.current, info.latest) : 'unknown';

          const updateColor =
            updateType === 'major'
              ? colors.red
              : updateType === 'minor'
                ? colors.yellow
                : updateType === 'patch'
                  ? colors.green
                  : colors.reset;

          console.log(
            `    ${colors.bold}${name}:${colors.reset} ${info.current} → ${updateColor}${info.latest}${colors.reset} (${updateType})`
          );
        });

        console.log(
          `\n  ${colors.yellow}Run 'npm update' to update to compatible versions.${colors.reset}`
        );
        console.log(
          `  ${colors.yellow}Run 'npm install <package>@latest' to update to latest versions (may include breaking changes).${colors.reset}`
        );
      } catch (parseError) {
        console.error(
          `  ${colors.red}Error parsing npm outdated output:${colors.reset}`,
          parseError.message
        );
      }
    } else {
      console.error(
        `  ${colors.red}Error checking outdated dependencies:${colors.reset}`,
        error.message
      );
    }
  }

  console.log('');
}

// Helper function to determine semver diff type
function semverDiff(current, latest) {
  const currentParts = current.split('.');
  const latestParts = latest.split('.');

  if (currentParts[0] !== latestParts[0]) {
    return 'major';
  } else if (currentParts[1] !== latestParts[1]) {
    return 'minor';
  } else if (currentParts[2] !== latestParts[2]) {
    return 'patch';
  } else {
    return 'same';
  }
}

// Check for secrets in code
function checkSecretsInCode() {
  console.log(`${colors.cyan}Checking for secrets in code...${colors.reset}`);

  const patterns = [
    {
      pattern:
        /(['"])(?:api|jwt|auth|token|secret|password|pw|key).*?\1\s*[:=]\s*(['"])(?!process\.env)[^\2]+?\2/gi,
      description: 'Potential hardcoded secret',
    },
    { pattern: /(['"])[a-f0-9]{32,}\1/gi, description: 'Potential API key or token (hex)' },
    {
      pattern: /(['"])[A-Za-z0-9+/]{40,}[=]{0,2}\1/gi,
      description: 'Potential Base64 encoded secret',
    },
  ];

  const excludeDirs = ['node_modules', '.git', '.next', 'out', 'build', 'dist'];
  const includeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.yml', '.yaml', '.env'];

  let issues = 0;

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          scanDir(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();

        if (includeExtensions.includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');

            for (const { pattern, description } of patterns) {
              pattern.lastIndex = 0; // Reset regex state

              let match;
              while ((match = pattern.exec(content)) !== null) {
                const matchedText = match[0];
                const lineIndex = content.substring(0, match.index).split('\n').length - 1;
                const line = lines[lineIndex];

                // Skip if it's in a comment
                if (
                  line.trim().startsWith('//') ||
                  line.trim().startsWith('/*') ||
                  line.trim().startsWith('*')
                ) {
                  continue;
                }

                // Skip if it references process.env
                if (line.includes('process.env.')) {
                  continue;
                }

                const relativePath = path.relative(process.cwd(), fullPath);
                console.log(
                  `  ${colors.yellow}${description} found in ${relativePath}:${lineIndex + 1}${colors.reset}`
                );
                console.log(`    ${line.trim()}`);
                issues++;
              }
            }
          } catch (error) {
            console.error(
              `  ${colors.red}Error reading file ${fullPath}:${colors.reset}`,
              error.message
            );
          }
        }
      }
    }
  }

  scanDir(process.cwd());

  if (issues === 0) {
    console.log(`  ${colors.green}No potential secrets found in code.${colors.reset}`);
  } else {
    console.log(`  ${colors.yellow}Found ${issues} potential secrets in code.${colors.reset}`);
    console.log(
      `  ${colors.yellow}Please review these findings and ensure no sensitive information is committed.${colors.reset}`
    );
  }

  console.log('');
}

// Run all checks
function runAllChecks() {
  checkEnvFiles();
  runNpmAudit();
  checkOutdatedDependencies();
  checkSecretsInCode();

  console.log(`${colors.cyan}${colors.bold}Security check complete.${colors.reset}`);
}

// Run the security check
runAllChecks();
