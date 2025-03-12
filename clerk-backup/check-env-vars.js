// Simple script to check environment variable loading
require('dotenv').config({ path: '.env.local' });

console.log('Checking environment variables...');
console.log('OPENAI_API_KEY exists:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
if (process.env.OPENAI_API_KEY) {
  const maskedKey =
    process.env.OPENAI_API_KEY.substring(0, 7) +
    '...' +
    process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 3);
  console.log('OPENAI_API_KEY starts with:', maskedKey);
}

console.log('\nOther important environment variables:');
console.log(
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY exists:',
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Yes' : 'No'
);
console.log('CLERK_SECRET_KEY exists:', process.env.CLERK_SECRET_KEY ? 'Yes' : 'No');
