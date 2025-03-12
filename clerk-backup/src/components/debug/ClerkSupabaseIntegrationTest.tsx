'use client';

import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { config } from '@/lib/config';
import { logger } from '@/utils/loggerInstance';

export function ClerkSupabaseIntegrationTest() {
  const { isLoaded, isSignedIn } = useAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [templateStatus, setTemplateStatus] = useState<string>('');
  const [configInfo, setConfigInfo] = useState<string>('');

  const verifyJwtTemplate = async () => {
    try {
      setTemplateStatus('Verifying JWT template...');
      logger.info('Starting JWT template verification', {
        apiBaseUrl: config.api.baseUrl,
        endpoint: '/clerk/jwt-template',
      });

      const url = `${config.api.baseUrl}/clerk/jwt-template`;
      logger.info('Making request to:', { url });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        logger.info('Received response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });

        const data = await response.json();
        logger.info('Parsed response data:', { data });

        if (!response.ok) {
          logger.error('JWT template verification failed', {
            status: response.status,
            statusText: response.statusText,
            error: data.error || 'Unknown error',
            data,
          });
          throw new Error(data.error || `Failed to verify JWT template: ${response.statusText}`);
        }

        logger.info('JWT template verification succeeded', { data });
        setTemplateStatus(data.message || 'JWT template verified');
        return data.success;
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);

        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          logger.error('Request timeout when verifying JWT template', { url });
          throw new Error(
            'Request timeout when verifying JWT template. The server might be down or unreachable.'
          );
        }

        throw fetchError;
      }
    } catch (err) {
      const errorDetails = {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        type: err instanceof Error ? err.constructor.name : typeof err,
      };

      logger.error('Error verifying JWT template', {
        error: errorDetails,
        apiBaseUrl: config.api.baseUrl,
      });

      const errorMessage = err instanceof Error ? err.message : String(err);
      const helpfulMessage = errorMessage.includes('Failed to fetch')
        ? 'Failed to connect to the server. Please check if the server is running and the API URL is correct.'
        : errorMessage;

      setTemplateStatus(`Template Error: ${helpfulMessage}`);
      return false;
    }
  };

  const runTest = async () => {
    try {
      setLoading(true);
      setError(null);
      setTestResult(null);

      logger.info('Starting integration test', {
        isSignedIn,
        apiBaseUrl: config.api.baseUrl,
      });

      // First verify JWT template exists
      const templateExists = await verifyJwtTemplate();
      if (!templateExists) {
        throw new Error('JWT template verification failed. Please check server logs.');
      }

      logger.info('Testing integration with verified template');
      const url = `${config.api.baseUrl}/test-integration`;
      logger.info('Making request to:', { url });

      const response = await fetch(url);
      logger.info('Received response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const data = await response.json();
      logger.info('Parsed response data:', { data });

      if (!response.ok) {
        logger.error('Integration test failed', {
          status: response.status,
          statusText: response.statusText,
          error: data.error || 'Unknown error',
          data,
        });
        throw new Error(data.error || `Failed to test integration: ${response.statusText}`);
      }

      logger.info('Integration test completed successfully', { data });
      setTestResult(data);
    } catch (err) {
      const errorDetails = {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        type: err instanceof Error ? err.constructor.name : typeof err,
      };

      logger.error('Error testing integration:', { error: errorDetails });
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const showConfig = () => {
    const configDetails = {
      apiBaseUrl: config.api.baseUrl,
      nextAuthUrl: config.nextauth.url,
      isServer: typeof window === 'undefined',
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'server-side',
      currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'server-side',
    };

    logger.info('Current configuration:', configDetails);
    setConfigInfo(JSON.stringify(configDetails, null, 2));
  };

  if (!isLoaded) {
    return <div className="p-4">Loading auth...</div>;
  }

  if (!isSignedIn) {
    return <div className="p-4">Please sign in to test the integration.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Clerk-Supabase Integration Test</h2>

      <div className="space-y-2">
        <button
          onClick={runTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mr-2"
        >
          {loading ? 'Testing...' : 'Test Integration'}
        </button>

        <button
          onClick={showConfig}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Show Config
        </button>

        {templateStatus && <div className="text-sm text-gray-600">{templateStatus}</div>}
      </div>

      {configInfo && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Current Configuration:</h3>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-60 text-xs">{configInfo}</pre>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error.message}</p>
          <p className="text-sm mt-2">
            Note: This may be expected if you're not signed in or don't have proper permissions.
            Check the browser console and server logs for more details.
          </p>
        </div>
      )}

      {testResult && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-96">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
