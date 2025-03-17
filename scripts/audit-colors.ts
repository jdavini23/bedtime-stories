import fs from 'fs';
import path from 'path';
import { colors } from '../src/config/design-system';

interface ColorUsage {
  file: string;
  line: number;
  color: string;
  context: string;
}

const validColors = new Set(
  Object.values(colors).flatMap((colorSet) => Object.values(colorSet as Record<string, string>))
);

const tailwindColorClasses = new Set([
  'primary',
  'secondary',
  'text',
  'background',
  'border',
  'midnight',
  'dreamy',
  'golden',
  'cloud',
  'sky',
  'lavender',
  'teal',
]);

function findColorUsage(content: string, filePath: string): ColorUsage[] {
  const lines = content.split('\n');
  const results: ColorUsage[] = [];

  // Find hex colors
  const hexColorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;

  // Find Tailwind color classes
  const tailwindRegex = new RegExp(
    `(bg|text|border|from|to|via)-(${Array.from(tailwindColorClasses).join('|')})(?:-[a-z]+)?/?[0-9]*`,
    'g'
  );

  lines.forEach((line, index) => {
    // Check for hex colors
    let match;
    while ((match = hexColorRegex.exec(line)) !== null) {
      const color = match[0];
      if (!validColors.has(color)) {
        results.push({
          file: filePath,
          line: index + 1,
          color,
          context: line.trim(),
        });
      }
    }

    // Check for Tailwind classes
    while ((match = tailwindRegex.exec(line)) !== null) {
      const colorClass = match[0];
      results.push({
        file: filePath,
        line: index + 1,
        color: colorClass,
        context: line.trim(),
      });
    }
  });

  return results;
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...walkDir(fullPath));
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?|css|scss)$/.test(entry.name)) {
      files.push(fullPath);
    }
  });

  return files;
}

function auditColors() {
  const srcDir = path.join(process.cwd(), 'src');
  const files = walkDir(srcDir);
  const results: ColorUsage[] = [];

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    results.push(...findColorUsage(content, file));
  });

  // Group results by file
  const groupedResults = results.reduce(
    (acc, result) => {
      const { file } = result;
      if (!acc[file]) {
        acc[file] = [];
      }
      acc[file].push(result);
      return acc;
    },
    {} as Record<string, ColorUsage[]>
  );

  // Print results
  console.log('\nColor Usage Audit Results:\n');
  Object.entries(groupedResults).forEach(([file, usages]) => {
    console.log(`\nFile: ${file}`);
    console.log('-'.repeat(80));
    usages.forEach(({ line, color, context }) => {
      console.log(`Line ${line}: ${color}`);
      console.log(`Context: ${context}\n`);
    });
  });

  console.log('\nSummary:');
  console.log('-'.repeat(80));
  console.log(`Total files scanned: ${files.length}`);
  console.log(`Total color usages found: ${results.length}`);
  console.log(`Files with color usage: ${Object.keys(groupedResults).length}`);
}

auditColors();
