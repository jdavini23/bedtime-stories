import { logger } from './logger';
import CircuitBreaker = require('opossum');
import { StoryInput } from '../services/personalizationEngine';

/**
 * Configure the circuit breaker for OpenAI API calls
 *
 * This implementation uses the Opossum library to provide robust circuit breaking
 * capabilities for API calls. It includes:
 * - Configurable failure thresholds and timeouts
 * - Event-based monitoring and logging
 * - Graceful fallback mechanisms
 * - Automatic recovery testing
 */
const openAICircuitBreakerTimeout = 45000; // 45 seconds
const geminiCircuitBreakerTimeout = 45000; // 45 seconds

export const openAICircuitBreaker = new CircuitBreaker(async (fn: Function) => await fn(), {
  resetTimeout: 120000, // 2 minutes before trying again
  timeout: openAICircuitBreakerTimeout, // 45 seconds before timing out a request
  errorThresholdPercentage: 50, // 50% of requests must fail to open circuit
  rollingCountTimeout: 60000, // 1 minute window for failure percentage calculation
  rollingCountBuckets: 10, // Split the rolling window into 10 buckets
  capacity: 10, // Maximum concurrent requests
});

/**
 * Configure the circuit breaker for Gemini API calls
 *
 * This implementation uses the same Opossum library with similar settings
 * to the OpenAI circuit breaker for consistency.
 */
export const geminiCircuitBreaker = new CircuitBreaker(async (fn: Function) => await fn(), {
  resetTimeout: 120000, // 2 minutes before trying again
  timeout: geminiCircuitBreakerTimeout, // 45 seconds before timing out a request
  errorThresholdPercentage: 50, // 50% of requests must fail to open circuit
  rollingCountTimeout: 60000, // 1 minute window for failure percentage calculation
  rollingCountBuckets: 10, // Split the rolling window into 10 buckets
  capacity: 10, // Maximum concurrent requests
});

// Track circuit breaker metrics for OpenAI
let totalRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;
let fallbackExecutions = 0;

// Track circuit breaker metrics for Gemini
let geminiTotalRequests = 0;
let geminiSuccessfulRequests = 0;
let geminiFailedRequests = 0;
let geminiFallbackExecutions = 0;

// Log circuit breaker events with enhanced information for OpenAI
openAICircuitBreaker.on('open', () => {
  logger.warn('OpenAI circuit breaker opened - too many failures', {
    metrics: openAICircuitBreaker.stats,
    successRate: successfulRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
  });
});

openAICircuitBreaker.on('close', () => {
  logger.info('OpenAI circuit breaker closed - service recovered', {
    metrics: openAICircuitBreaker.stats,
  });
});

openAICircuitBreaker.on('halfOpen', () => {
  logger.info('OpenAI circuit breaker half-open - testing service', {
    metrics: openAICircuitBreaker.stats,
  });
});

openAICircuitBreaker.on('fallback', (result) => {
  fallbackExecutions++;
  logger.warn('OpenAI circuit breaker fallback executed', {
    result,
    fallbackCount: fallbackExecutions,
  });
});

openAICircuitBreaker.on('success', () => {
  totalRequests++;
  successfulRequests++;
  logger.debug('OpenAI API call successful', {
    totalRequests,
    successRate: (successfulRequests / totalRequests) * 100,
  });
});

openAICircuitBreaker.on('failure', (error) => {
  totalRequests++;
  failedRequests++;
  logger.error('OpenAI API call failed', {
    error: serializeError(error),
    totalRequests,
    failureRate: (failedRequests / totalRequests) * 100,
  });
});

openAICircuitBreaker.on('timeout', () => {
  logger.warn('OpenAI API call timed out', {
    timeoutMs: openAICircuitBreakerTimeout,
  });
});

openAICircuitBreaker.on('reject', () => {
  logger.warn('OpenAI API call rejected (circuit open)', {
    circuitState: openAICircuitBreaker.status.stats,
    metrics: openAICircuitBreaker.stats,
  });
});

// Log circuit breaker events with enhanced information for Gemini
geminiCircuitBreaker.on('open', () => {
  logger.warn('Gemini circuit breaker opened - too many failures', {
    metrics: geminiCircuitBreaker.stats,
    successRate:
      geminiSuccessfulRequests > 0 ? (geminiSuccessfulRequests / geminiTotalRequests) * 100 : 0,
  });
});

geminiCircuitBreaker.on('close', () => {
  logger.info('Gemini circuit breaker closed - service recovered', {
    metrics: geminiCircuitBreaker.stats,
  });
});

geminiCircuitBreaker.on('halfOpen', () => {
  logger.info('Gemini circuit breaker half-open - testing service', {
    metrics: geminiCircuitBreaker.stats,
  });
});

geminiCircuitBreaker.on('fallback', (result) => {
  geminiFallbackExecutions++;
  logger.warn('Gemini circuit breaker fallback executed', {
    result,
    fallbackCount: geminiFallbackExecutions,
  });
});

geminiCircuitBreaker.on('success', () => {
  geminiTotalRequests++;
  geminiSuccessfulRequests++;
  logger.debug('Gemini API call successful', {
    totalRequests: geminiTotalRequests,
    successRate: (geminiSuccessfulRequests / geminiTotalRequests) * 100,
  });
});

geminiCircuitBreaker.on('failure', (error) => {
  geminiTotalRequests++;
  geminiFailedRequests++;
  logger.error('Gemini API call failed', {
    error: serializeError(error),
    totalRequests: geminiTotalRequests,
    failureRate: (geminiFailedRequests / geminiTotalRequests) * 100,
  });
});

geminiCircuitBreaker.on('timeout', () => {
  logger.warn('Gemini API call timed out', {
    timeoutMs: geminiCircuitBreakerTimeout,
  });
});

geminiCircuitBreaker.on('reject', () => {
  logger.warn('Gemini API call rejected (circuit open)', {
    circuitState: geminiCircuitBreaker.status.stats,
    metrics: geminiCircuitBreaker.stats,
  });
});

/**
 * Serialize error objects for logging
 */
export function serializeError(error: any): any {
  if (!error) return { message: 'Unknown error (null or undefined)' };

  // Handle Error objects
  if (error instanceof Error) {
    const serialized: any = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    // Include additional properties that might be on custom errors
    Object.getOwnPropertyNames(error).forEach((prop) => {
      if (prop !== 'name' && prop !== 'message' && prop !== 'stack') {
        serialized[prop] = (error as any)[prop];
      }
    });

    return serialized;
  }

  // Handle non-Error objects
  if (typeof error === 'object') {
    try {
      // Try to serialize the object
      return JSON.parse(JSON.stringify(error));
    } catch (e) {
      // If circular references or other issues prevent serialization
      return { message: 'Unserializable error object', type: typeof error };
    }
  }

  // Handle primitive error values
  return { message: String(error), type: typeof error };
}

/**
 * Handle OpenAI API errors with detailed information
 */
export function handleOpenAIError(error: any) {
  // Default error response
  let errorResponse = {
    error: 'OpenAI API Error',
    message: 'An error occurred while generating the story',
    status: 500,
  };

  // Check if it's an OpenAI API error
  if (error?.response?.data) {
    const { error: openAIError } = error.response.data;

    if (openAIError) {
      errorResponse = {
        error: `OpenAI Error: ${openAIError.type}`,
        message: openAIError.message,
        status: error.response.status,
      };

      // Log specific error types for monitoring
      logger.error('OpenAI API specific error', {
        type: openAIError.type,
        message: openAIError.message,
        param: openAIError.param,
        code: openAIError.code,
      });
    }
  }
  // Handle network errors
  else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    errorResponse = {
      error: 'OpenAI Timeout',
      message: 'The request to OpenAI API timed out',
      status: 504, // Gateway Timeout
    };
    logger.error('OpenAI API timeout', { error: error.message });
  }
  // Handle server errors
  else if (error?.message?.includes('500') || error?.message?.includes('server error')) {
    errorResponse = {
      error: 'OpenAI Server Error',
      message: 'OpenAI servers are experiencing issues',
      status: 503, // Service Unavailable
    };
    logger.error('OpenAI server error', { error: error.message });
  }
  // Handle other errors
  else {
    logger.error('Unhandled OpenAI error', serializeError(error));
  }

  return errorResponse;
}

/**
 * Handle Gemini API errors with detailed information
 */
export function handleGeminiError(error: any) {
  // Default error response
  let errorResponse = {
    error: 'Gemini API Error',
    message: 'An error occurred while generating the story',
    status: 500,
  };

  // Check if it's a Gemini API error with response data
  if (error?.response?.data) {
    const geminiError = error.response.data;

    errorResponse = {
      error: `Gemini Error: ${geminiError.error || 'Unknown'}`,
      message: geminiError.message || 'An error occurred with the Gemini API',
      status: error.response.status || 500,
    };

    // Log specific error types for monitoring
    logger.error('Gemini API specific error', {
      error: geminiError.error,
      message: geminiError.message,
    });
  }
  // Handle network errors
  else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    errorResponse = {
      error: 'Gemini Timeout',
      message: 'The request to Gemini API timed out',
      status: 504, // Gateway Timeout
    };
    logger.error('Gemini API timeout', { error: error.message });
  }
  // Handle server errors
  else if (error?.message?.includes('500') || error?.message?.includes('server error')) {
    errorResponse = {
      error: 'Gemini Server Error',
      message: 'Gemini servers are experiencing issues',
      status: 503, // Service Unavailable
    };
    logger.error('Gemini server error', { error: error.message });
  }
  // Handle other errors
  else {
    logger.error('Unhandled Gemini error', serializeError(error));
  }

  return errorResponse;
}

/**
 * Validate that the OpenAI API key is set and has a valid format
 */
export function validateApiKey(apiKey?: string): boolean {
  if (!apiKey) {
    logger.error('OpenAI API key is not set');
    return false;
  }

  // Check for valid key format (both standard sk- and project sk-proj- formats)
  if (!apiKey.startsWith('sk-')) {
    logger.error('OpenAI API key has invalid format - must start with sk-');
    return false;
  }

  // Additional validation for key length
  if (apiKey.length < 20) {
    logger.error('OpenAI API key is too short');
    return false;
  }

  // Log key format type for debugging
  const keyType = apiKey.startsWith('sk-proj-') ? 'project' : 'standard';
  const maskedKey =
    keyType === 'project'
      ? apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 3)
      : apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 3);

  logger.debug(`Using OpenAI ${keyType} API key: ${maskedKey}`);
  logger.debug(`API key length: ${apiKey.length}`);

  return true;
}

/**
 * Validate that the Gemini API key is set and has a valid format
 */
export function validateGeminiApiKey(apiKey?: string): boolean {
  if (!apiKey) {
    logger.error('Gemini API key is not set');
    return false;
  }

  // Gemini API keys are typically longer than 20 characters
  if (apiKey.length < 20) {
    logger.error('Gemini API key appears to be invalid (too short)');
    return false;
  }

  return true;
}

/**
 * Utility function to import the generateFallbackStory function from personalizationEngine
 * This avoids circular dependencies
 */
export function generateFallbackStoryUtil(input: StoryInput): string {
  // Import dynamically to avoid circular dependencies
  const { generateFallbackStory } = require('../services/personalizationEngine');
  return generateFallbackStory(input);
}

/**
 * Type definition for OpenAI error responses
 */
export type OpenAIErrorResponse = {
  error: string;
  message: string;
  status?: number;
  details?: unknown;
};

/**
 * Type definition for Gemini error responses
 */
export interface GeminiErrorResponse {
  error: string;
  message: string;
  status?: number;
  details?: unknown;
}
