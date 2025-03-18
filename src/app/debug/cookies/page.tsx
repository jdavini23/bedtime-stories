'use client';

import { useEffect, useState } from 'react';
import { clearAllCookies, clearCookiesByPrefix } from '@/utils/cookies';

export default function CookieDebugPage() {
  const [cookies, setCookies] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load all cookies on mount
  useEffect(() => {
    refreshCookies();
  }, []);

  // Function to refresh the cookie list
  const refreshCookies = () => {
    if (typeof document !== 'undefined') {
      const allCookies = document.cookie.split(';').map(c => c.trim());
      setCookies(allCookies);
    }
  };

  // Function to clear all cookies
  const handleClearAll = () => {
    try {
      clearAllCookies();
      setMessage('All cookies cleared successfully');
      setStatus('success');
      refreshCookies();
    } catch (error) {
      setMessage(`Error clearing cookies: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
    }
  };

  // Function to clear Clerk cookies
  const handleClearClerk = () => {
    try {
      clearCookiesByPrefix('__clerk');
      clearCookiesByPrefix('__session');
      setMessage('Clerk cookies cleared successfully');
      setStatus('success');
      refreshCookies();
    } catch (error) {
      setMessage(`Error clearing Clerk cookies: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
    }
  };

  // Function to clear Supabase cookies
  const handleClearSupabase = () => {
    try {
      clearCookiesByPrefix('sb-');
      setMessage('Supabase cookies cleared successfully');
      setStatus('success');
      refreshCookies();
    } catch (error) {
      setMessage(`Error clearing Supabase cookies: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cookie Debugger</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={handleClearAll} 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear ALL Cookies
        </button>
        <button 
          onClick={handleClearClerk} 
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Clear Clerk Cookies
        </button>
        <button 
          onClick={handleClearSupabase} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Clear Supabase Cookies
        </button>
        <button 
          onClick={refreshCookies} 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Refresh Cookie List
        </button>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Current Cookies ({cookies.length})</h2>
        {cookies.length > 0 ? (
          <div className="p-4 bg-gray-100 rounded">
            <ul className="space-y-2">
              {cookies.map((cookie, i) => (
                <li key={i} className={`p-2 rounded ${cookie.includes('__clerk') || cookie.includes('__session') ? 'bg-orange-100' : cookie.includes('sb-') ? 'bg-blue-100' : ''}`}>
                  {cookie}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No cookies found</p>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <a 
          href="/auth/login" 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
        >
          Go to Login
        </a>
        <a 
          href="/debug" 
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-center"
        >
          Go to Debug Dashboard
        </a>
        <a 
          href="/" 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-center"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
