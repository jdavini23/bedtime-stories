// A comprehensive script to test OpenAI API connection
require('dotenv').config({ path: '.env.local' });
const { OpenAI } = require('openai');

console.log('Testing OpenAI API connection...');

// Safely display key format (partial)
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('❌ ERROR: OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

const keyType = apiKey.startsWith('sk-proj-') ? 'project' : 'standard';
const maskedKey =
  keyType === 'project'
    ? apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 3)
    : apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 3);

console.log(`Using ${keyType} API key: ${maskedKey}`);

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 seconds timeout
  maxRetries: 2,
});

// Test API connection with a simple request
async function testOpenAIConnection() {
  try {
    console.log('Making a test request to OpenAI API...');

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "OpenAI connection successful!"' },
      ],
      max_tokens: 20,
    });

    console.log('✅ SUCCESS: Connected to OpenAI API!');
    console.log('Response:', response.choices[0].message.content);
    console.log('Model:', response.model);
    console.log('Usage:', response.usage);

    return true;
  } catch (error) {
    console.error('❌ ERROR: Failed to connect to OpenAI API');
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      status: error.status,
      code: error.code,
    });

    if (error.message.includes('timeout')) {
      console.error(
        'The request timed out. This could be due to network issues or high API traffic.'
      );
    } else if (error.status === 401) {
      console.error('Authentication error. Your API key may be invalid or expired.');
    } else if (error.status === 429) {
      console.error('Rate limit exceeded. You may need to wait before making more requests.');
    } else if (error.message.includes('billing')) {
      console.error('Billing issue. Check your OpenAI account for any payment issues.');
    }

    return false;
  }
}

// Run the test
testOpenAIConnection().then((success) => {
  if (!success) {
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your API key is correctly set in .env.local file');
    console.log('2. Verify your OpenAI account has sufficient credits');
    console.log('3. Make sure you have proper internet connection');
    console.log('4. Try with a different API key if possible');
  }
  console.log('\nTest completed.');
});
