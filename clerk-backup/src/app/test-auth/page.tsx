'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function TestAuth() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { isLoaded, userId, getToken, sessionId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const testGeminiAPI = async (useApiKey: boolean = false) => {
    try {
      console.log('🔍 Starting API test:', {
        useApiKey,
        isAuthenticated: !!userId,
        sessionId,
      });

      setError('');
      setResult('');
      setIsLoading(true);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (useApiKey) {
        headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`;
        console.log('🔍 Using API key authentication');
      } else {
        console.log('🔍 Attempting to get Clerk token...');
        try {
          // Get the session token for authenticated requests
          const token = await getToken();
          console.log('🔍 Clerk token details:', {
            obtained: !!token,
            length: token?.length,
            prefix: token?.substring(0, 10) + '...',
          });

          if (!token) {
            throw new Error('Failed to get authentication token');
          }
          headers.Authorization = `Bearer ${token}`;
        } catch (tokenError) {
          console.error('🔍 Token error:', tokenError);
          throw tokenError;
        }
      }

      console.log('🔍 Making request with headers:', {
        ...headers,
        Authorization: headers.Authorization ? 'Bearer [REDACTED]' : undefined,
      });

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers,
        body: JSON.stringify({ test: true }),
      });

      console.log('🔍 Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      const data = await response.json();
      console.log('🔍 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('🔍 API Error:', {
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Auth Status: {userId ? 'Authenticated' : 'Not Authenticated'}
        </p>
        <p className="text-sm text-gray-600">User ID: {userId || 'None'}</p>
        <p className="text-sm text-gray-600">Session ID: {sessionId || 'None'}</p>
      </div>

      <div className="space-x-4">
        <button
          onClick={() => testGeminiAPI(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Testing...' : 'Test with API Key'}
        </button>

        <button
          onClick={() => testGeminiAPI(false)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={!userId || isLoading}
        >
          {isLoading ? 'Testing...' : 'Test with Clerk Auth'}
        </button>
      </div>

      {result && (
        <div className="mt-4">
          <h2 className="font-bold mb-2">Response:</h2>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-60">{result}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <h2 className="font-bold text-red-600 mb-2">Error:</h2>
          <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
        </div>
      )}
    </div>
  );
}
