/**
 * Manual test script for the Opossum CircuitBreaker implementation
 * Run with: npx ts-node -r tsconfig-paths/register src/scripts/test-circuit-breaker.ts
 */

import CircuitBreaker from 'opossum';
import { logger } from '../../src/utils/logger';

// Disable logger for cleaner output
logger.info = console.log;
logger.warn = console.warn;
logger.error = console.error;
logger.debug = console.log;

// Mock API functions - define before using
async function successfulApiCall(): Promise<string> {
  console.log('🟢 API call successful');
  return 'API response data';
}

async function failingApiCall(): Promise<string> {
  console.log('🔴 API call failed');
  throw new Error('API error');
}

// Create a circuit breaker with low thresholds for testing
const circuitBreaker = new CircuitBreaker(successfulApiCall, {
  errorThresholdPercentage: 50,
  resetTimeout: 5000, // 5 second timeout
  timeout: 3000, // 3 seconds
});

// Add event listeners
circuitBreaker.on('open', () => {
  console.log('🔴 Circuit opened - too many failures');
});

circuitBreaker.on('close', () => {
  console.log('🟢 Circuit closed - service recovered');
});

circuitBreaker.on('halfOpen', () => {
  console.log('🟠 Circuit half-open - testing service');
});

circuitBreaker.on('fallback', () => {
  console.log('⚠️ Using fallback function');
});

// Fallback function
const fallbackFunction = (): string => {
  return 'Fallback response data';
};

// Register fallback
circuitBreaker.fallback(fallbackFunction);

// Helper to display circuit breaker state
const logCircuitState = () => {
  console.log(`Circuit state: ${circuitBreaker.status.stats.failures > 0 ? 'open' : 'closed'}`);
  console.log(
    `Metrics: ${JSON.stringify(
      {
        failures: circuitBreaker.status.stats.failures,
        successes: circuitBreaker.status.stats.successes,
        fallbacks: circuitBreaker.status.stats.fallbacks,
        rejects: circuitBreaker.status.stats.rejects,
      },
      null,
      2
    )}`
  );
  console.log('-----------------------------------');
};

// Test sequence
const runTests = async () => {
  console.log('\n🧪 TEST 1: Successful API call');
  console.log('-----------------------------------');
  logCircuitState();

  // Use the successful API call
  const result1 = await circuitBreaker.fire();
  console.log(`Result: ${result1}`);
  logCircuitState();

  console.log('\n🧪 TEST 2: Failed API call');
  console.log('-----------------------------------');

  // Create a new circuit breaker with failing function
  const failingCircuitBreaker = new CircuitBreaker(failingApiCall, {
    errorThresholdPercentage: 50,
    resetTimeout: 5000,
    timeout: 3000,
  });

  failingCircuitBreaker.fallback(fallbackFunction);

  // Add event listeners
  failingCircuitBreaker.on('open', () => {
    console.log('🔴 Circuit opened - too many failures');
  });

  failingCircuitBreaker.on('fallback', () => {
    console.log('⚠️ Using fallback function');
  });

  try {
    const result2 = await failingCircuitBreaker.fire();
    console.log(`Result: ${result2}`);
  } catch (error) {
    console.log(`Error caught: ${error instanceof Error ? error.message : String(error)}`);
  }

  console.log(
    `Failing circuit metrics: ${JSON.stringify(
      {
        failures: failingCircuitBreaker.status.stats.failures,
        successes: failingCircuitBreaker.status.stats.successes,
        fallbacks: failingCircuitBreaker.status.stats.fallbacks,
        rejects: failingCircuitBreaker.status.stats.rejects,
      },
      null,
      2
    )}`
  );

  console.log('\n🧪 TEST 3: Another failed API call - should open circuit');
  console.log('-----------------------------------');

  try {
    const result3 = await failingCircuitBreaker.fire();
    console.log(`Result: ${result3}`);
  } catch (error) {
    console.log(`Error caught: ${error instanceof Error ? error.message : String(error)}`);
  }

  console.log(
    `Failing circuit metrics: ${JSON.stringify(
      {
        failures: failingCircuitBreaker.status.stats.failures,
        successes: failingCircuitBreaker.status.stats.successes,
        fallbacks: failingCircuitBreaker.status.stats.fallbacks,
        rejects: failingCircuitBreaker.status.stats.rejects,
      },
      null,
      2
    )}`
  );

  console.log('\n🧪 TEST 4: Call with open circuit - should use fallback without calling API');
  console.log('-----------------------------------');

  const result4 = await failingCircuitBreaker.fire();
  console.log(`Result: ${result4}`);

  console.log(
    `Failing circuit metrics: ${JSON.stringify(
      {
        failures: failingCircuitBreaker.status.stats.failures,
        successes: failingCircuitBreaker.status.stats.successes,
        fallbacks: failingCircuitBreaker.status.stats.fallbacks,
        rejects: failingCircuitBreaker.status.stats.rejects,
      },
      null,
      2
    )}`
  );

  console.log('\n🧪 TEST 5: Wait for circuit timeout');
  console.log('-----------------------------------');
  console.log('Waiting for 5 seconds...');
  await new Promise((resolve) => setTimeout(resolve, 5500));
  console.log('Timeout complete, circuit should be half-open now');

  console.log(
    `Failing circuit metrics: ${JSON.stringify(
      {
        failures: failingCircuitBreaker.status.stats.failures,
        successes: failingCircuitBreaker.status.stats.successes,
        fallbacks: failingCircuitBreaker.status.stats.fallbacks,
        rejects: failingCircuitBreaker.status.stats.rejects,
      },
      null,
      2
    )}`
  );

  console.log('\n🧪 TEST 6: Successful call after timeout - should close circuit');
  console.log('-----------------------------------');

  // Create a new circuit breaker that will succeed
  const successCircuitBreaker = new CircuitBreaker(successfulApiCall, {
    errorThresholdPercentage: 50,
    resetTimeout: 5000,
    timeout: 3000,
  });

  const result6 = await successCircuitBreaker.fire();
  console.log(`Result: ${result6}`);

  console.log(
    `Success circuit metrics: ${JSON.stringify(
      {
        failures: successCircuitBreaker.status.stats.failures,
        successes: successCircuitBreaker.status.stats.successes,
        fallbacks: successCircuitBreaker.status.stats.fallbacks,
        rejects: successCircuitBreaker.status.stats.rejects,
      },
      null,
      2
    )}`
  );

  console.log('\n🧪 TEST 7: Another successful call - circuit should remain closed');
  console.log('-----------------------------------');
  const result7 = await successCircuitBreaker.fire();
  console.log(`Result: ${result7}`);

  console.log(
    `Success circuit metrics: ${JSON.stringify(
      {
        failures: successCircuitBreaker.status.stats.failures,
        successes: successCircuitBreaker.status.stats.successes,
        fallbacks: successCircuitBreaker.status.stats.fallbacks,
        rejects: successCircuitBreaker.status.stats.rejects,
      },
      null,
      2
    )}`
  );
};

// Run the tests
console.log('🔄 CIRCUIT BREAKER MANUAL TEST');
console.log('===================================');
runTests().catch((error) => {
  console.error('Test failed:', error);
});
