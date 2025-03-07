// Script to test environment variables loading
require('dotenv').config();

console.log('Environment Variables Test');
console.log('-----------------------');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

if (process.env.OPENAI_API_KEY) {
  console.log('OPENAI_API_KEY starts with:', process.env.OPENAI_API_KEY.substring(0, 10) + '...');
  console.log('OPENAI_API_KEY format valid:', process.env.OPENAI_API_KEY.startsWith('sk-'));
} else {
  console.log('OPENAI_API_KEY is not defined in environment');
}

// Check which .env file is being loaded
console.log('\nChecking .env files:');
const fs = require('fs');
const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];

envFiles.forEach((file) => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const openaiKeyLine = content.split('\n').find((line) => line.startsWith('OPENAI_API_KEY='));
      console.log(
        `${file} exists:`,
        !!openaiKeyLine,
        openaiKeyLine ? `(Key: ${openaiKeyLine.substring(0, 25)}...)` : ''
      );
    } else {
      console.log(`${file} does not exist`);
    }
  } catch (err) {
    console.log(`Error checking ${file}:`, err.message);
  }
});
