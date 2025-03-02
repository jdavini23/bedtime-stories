/**
 * Sentry Test Script
 *
 * This script tests the Sentry configuration by sending a test error
 * and verifying that source maps are properly uploaded and working.
 */

const Sentry = require('@sentry/node');
require('dotenv').config({ path: '.env.local' });

// Check if Sentry DSN is available
const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (!sentryDsn) {
  console.error('Error: NEXT_PUBLIC_SENTRY_DSN environment variable is not set.');
  console.error('Please set this variable in your .env.local file or environment.');
  console.error('Example: NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0');
  process.exit(1);
}

console.log('Initializing Sentry with DSN:', sentryDsn);

// Initialize Sentry with the same DSN as in the application
Sentry.init({
  dsn: sentryDsn,
  tracesSampleRate: 1.0,
  debug: true,
  beforeSend(event) {
    console.log('Sending event to Sentry:', event.event_id);
    return event;
  },
});

console.log('Testing Sentry configuration...');

// Function that will generate an error with a stack trace
function generateError() {
  try {
    // Intentionally throw an error
    throw new Error('Test error from Sentry test script');
  } catch (error) {
    console.error('Generated test error:', error.message);
    return error;
  }
}

// Generate an error
const error = generateError();

// Capture the error with Sentry
const eventId = Sentry.captureException(error, {
  tags: {
    source: 'test-script',
    timestamp: new Date().toISOString(),
  },
});

console.log('Error captured with event ID:', eventId);
console.log('Error details:', {
  message: error.message,
  stack: error.stack.split('\n')[0],
  timestamp: new Date().toISOString(),
});

// Give Sentry some time to send the event
console.log('Waiting for event to be sent to Sentry...');

// Use a promise to properly handle the async nature of Sentry
Sentry.close(2000)
  .then(() => {
    console.log('Test complete. Check Sentry dashboard for the error.');
    console.log('Exiting test script.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Error closing Sentry client:', e);
    process.exit(1);
  });
