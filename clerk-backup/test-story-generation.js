const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Robust diagnostic logging function
function logDiagnostics(message, data = null) {
  const timestamp = new Date().toISOString();
  const logPath = path.resolve(__dirname, 'test-diagnostics-full.log');

  try {
    // Ensure log directory exists
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Prepare log entry
    let logEntry = `[${timestamp}] ${message}\n`;

    // Safely stringify data with controlled depth and length
    const safeStringify = (obj, maxLength = 1000) => {
      const seen = new WeakSet();

      const replacer = (key, value) => {
        // Redact sensitive information
        if (
          typeof key === 'string' &&
          (key.includes('token') ||
            key.includes('key') ||
            key.includes('secret') ||
            key.includes('password'))
        ) {
          return '[REDACTED]';
        }

        // Prevent circular references
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }

        // Truncate long strings
        if (typeof value === 'string' && value.length > maxLength) {
          return value.substring(0, maxLength) + '... [TRUNCATED]';
        }

        return value;
      };

      try {
        return JSON.stringify(obj, replacer, 2);
      } catch (error) {
        return `Unable to stringify data: ${error.message}`;
      }
    };

    // Append log entry and data
    fs.appendFileSync(logPath, logEntry);
    if (data) {
      const safeData = safeStringify(data);
      fs.appendFileSync(logPath, safeData + '\n\n');
    }
  } catch (error) {
    console.error('Comprehensive logging failed:', error);
  }

  // Always log to console for immediate visibility
  console.log(message);
  if (data) console.log(JSON.stringify(data, null, 2));
}

// Diagnostic environment variable reader
function readEnvironmentVariables() {
  const envVars = {};
  const sensitiveKeys = ['TOKEN', 'KEY', 'SECRET', 'PASSWORD', 'CREDENTIAL'];
  const MAX_ENV_VALUE_LENGTH = 100; // Truncate long environment values

  Object.keys(process.env).forEach((key) => {
    // Only log non-sensitive environment variables
    if (!sensitiveKeys.some((sensitiveKey) => key.toUpperCase().includes(sensitiveKey))) {
      // Truncate long values
      let value = process.env[key];
      if (typeof value === 'string' && value.length > MAX_ENV_VALUE_LENGTH) {
        value = value.substring(0, MAX_ENV_VALUE_LENGTH) + '... [TRUNCATED]';
      }
      envVars[key] = value;
    }
  });

  return envVars;
}

async function testStoryGeneration() {
  // Clear previous log to prevent accumulation
  const logPath = path.resolve(__dirname, 'test-diagnostics-full.log');
  if (fs.existsSync(logPath)) {
    fs.unlinkSync(logPath);
  }

  // Log comprehensive environment information with controlled output
  const environmentVars = readEnvironmentVariables();
  logDiagnostics('Environment Variables', {
    variableCount: Object.keys(environmentVars).length,
    sampleVariables: Object.entries(environmentVars)
      .slice(0, 10) // Only log first 10 variables
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {}),
  });

  try {
    logDiagnostics('Starting Story Generation Test');
    logDiagnostics('Target Endpoint', 'http://localhost:3001/api/story/generate');

    // Comprehensive diagnostic headers with multiple authentication strategies
    const diagnosticHeaders = {
      'Content-Type': 'application/json',

      // Multiple authentication override headers
      'x-test-user-id': process.env.NEXT_PUBLIC_DEV_USER_ID || 'test-user-123',
      'x-clerk-auth-user-id': process.env.NEXT_PUBLIC_DEV_USER_ID || 'test-user-123',
      'x-dev-auth-override': 'true',

      // Debugging and tracing headers
      'x-debug-mode': 'true',
      'x-environment': process.env.NODE_ENV || 'development',
      'x-request-trace-id': `test-${Date.now()}`,

      // Optional additional context headers
      'x-client-timestamp': new Date().toISOString(),
      'x-client-version': '1.0.0',
    };

    logDiagnostics('Diagnostic Headers', diagnosticHeaders);

    // Comprehensive test cases
    const testCases = [
      {
        name: 'Standard Story Generation',
        input: {
          childName: 'Emma',
          interests: ['dinosaurs', 'space'],
          theme: 'adventure',
          gender: 'female',
        },
      },
      {
        name: 'Minimal Input',
        input: {
          childName: 'Alex',
          interests: ['cars'],
          theme: 'exploration',
          gender: 'male',
        },
      },
    ];

    for (const testCase of testCases) {
      logDiagnostics(`Running Test Case: ${testCase.name}`);

      try {
        const response = await axios.post(
          'http://localhost:3001/api/story/generate',
          testCase.input,
          {
            headers: diagnosticHeaders,
            timeout: 15000, // Extended timeout for comprehensive debugging
          }
        );

        logDiagnostics(`Test Case ${testCase.name} - Response Status`, response.status);
        logDiagnostics(`Test Case ${testCase.name} - Response Headers`, response.headers);
        logDiagnostics(`Test Case ${testCase.name} - Response Data`, response.data);
      } catch (testCaseError) {
        logDiagnostics(`Test Case ${testCase.name} - Error Details`, {
          errorType: testCaseError.constructor.name,
          errorMessage: testCaseError.message,
          responseStatus: testCaseError.response?.status,
          responseHeaders: testCaseError.response?.headers,
          responseData: testCaseError.response?.data,
          requestDetails: {
            method: testCaseError.request?.method,
            path: testCaseError.request?.path,
            host: testCaseError.request?.host,
          },
          requestConfig: {
            url: testCaseError.config?.url,
            method: testCaseError.config?.method,
            headers: testCaseError.config?.headers,
          },
          stackTrace: testCaseError.stack,
        });
      }
    }
  } catch (error) {
    logDiagnostics('Full Error Details', {
      errorType: error.constructor.name,
      errorMessage: error.message,
      responseStatus: error.response?.status,
      responseHeaders: error.response?.headers,
      responseData: error.response?.data,
      requestDetails: {
        method: error.request?.method,
        path: error.request?.path,
        host: error.request?.host,
      },
      requestConfig: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      },
      stackTrace: error.stack,
    });
  }
}

testStoryGeneration();
