import { NextResponse } from 'next/server';
import { CircuitBreaker } from '@/lib/circuit-breaker/CircuitBreaker';
import { logger } from '@/utils/logger';

/**
 * API route to test the CircuitBreaker implementation
 * Access via: http://localhost:3002/api/test-circuit-breaker
 */
export async function GET() {
  try {
    // Create a circuit breaker with low thresholds for testing
    const circuitBreaker = new CircuitBreaker(2, 5000); // 2 failures, 5 second timeout
    const testResults: any[] = [];

    // Helper to log circuit state
    const getCircuitState = () => ({
      state: circuitBreaker.getState(),
      failures: circuitBreaker.getFailures(),
    });

    // Mock API functions
    const successfulApiCall = async () => {
      logger.info('API call successful');
      return 'API response data';
    };

    const failingApiCall = async () => {
      logger.error('API call failed');
      throw new Error('API error');
    };

    // Fallback function
    const fallbackFunction = () => {
      logger.warn('Using fallback function');
      return 'Fallback response data';
    };

    // Test 1: Successful API call
    testResults.push({
      test: 'Test 1: Successful API call',
      circuitStateBefore: getCircuitState(),
    });

    const result1 = await circuitBreaker.execute(successfulApiCall, fallbackFunction);

    testResults[0].result = result1;
    testResults[0].circuitStateAfter = getCircuitState();

    // Test 2: Failed API call
    testResults.push({
      test: 'Test 2: Failed API call',
      circuitStateBefore: getCircuitState(),
    });

    const result2 = await circuitBreaker.execute(failingApiCall, fallbackFunction);

    testResults[1].result = result2;
    testResults[1].circuitStateAfter = getCircuitState();

    // Test 3: Another failed API call - should open circuit
    testResults.push({
      test: 'Test 3: Another failed API call - should open circuit',
      circuitStateBefore: getCircuitState(),
    });

    const result3 = await circuitBreaker.execute(failingApiCall, fallbackFunction);

    testResults[2].result = result3;
    testResults[2].circuitStateAfter = getCircuitState();

    // Test 4: Call with open circuit - should use fallback without calling API
    testResults.push({
      test: 'Test 4: Call with open circuit - should use fallback without calling API',
      circuitStateBefore: getCircuitState(),
    });

    const result4 = await circuitBreaker.execute(successfulApiCall, fallbackFunction);

    testResults[3].result = result4;
    testResults[3].circuitStateAfter = getCircuitState();

    // Test 5: Wait for circuit timeout
    testResults.push({
      test: 'Test 5: Wait for circuit timeout (5 seconds)',
      circuitStateBefore: getCircuitState(),
    });

    await new Promise((resolve) => setTimeout(resolve, 5500));

    testResults[4].circuitStateAfter = getCircuitState();

    // Test 6: Successful call after timeout - should close circuit
    testResults.push({
      test: 'Test 6: Successful call after timeout - should close circuit',
      circuitStateBefore: getCircuitState(),
    });

    const result6 = await circuitBreaker.execute(successfulApiCall, fallbackFunction);

    testResults[5].result = result6;
    testResults[5].circuitStateAfter = getCircuitState();

    return NextResponse.json({
      success: true,
      message: 'Circuit breaker tests completed',
      testResults,
    });
  } catch (error) {
    logger.error('Error running circuit breaker tests', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error running circuit breaker tests',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
