'use client';

import { useState } from 'react';
import { useSupabase } from '@/providers/SupabaseAuthProvider';

export default function TestAuth() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { user, supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);

  const testGeminiAPI = async (useApiKey: boolean = false) => {
    try {
      console.log('🔍 Starting API test:', {
        useApiKey,
        isAuthenticated: !!user,
        userId: user?.id,
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
        console.log('🔍 Attempting to get Supabase session...');
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          console.log('🔍 Supabase session details:', {
            obtained: !!session,
            userId: session?.user?.id,
          });

          if (!session) {
            throw new Error('Failed to get authentication session');
          }
          // For this test, we'll just use the user ID as the token
          headers.Authorization = `Bearer ${session.user.id}`;
        } catch (tokenError) {
          console.error('🔍 Session error:', tokenError);
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

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('🔍 Test error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      <div className="mb-4">
        <p>Authentication Status:</p>
        <ul className="list-disc ml-6">
          <li>User ID: {user?.id || 'Not authenticated'}</li>
          <li>Email: {user?.email || 'Not available'}</li>
        </ul>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => testGeminiAPI(false)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test with Auth
        </button>
        <button
          onClick={() => testGeminiAPI(true)}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test with API Key
        </button>
      </div>

      {isLoading && <p>Loading...</p>}

      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <pre>{error}</pre>
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-100 rounded">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
