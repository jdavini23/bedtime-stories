'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { clearCookiesByPrefix } from '@/utils/cookies';

export default function DebugPage() {
  const { supabase, user, signOut } = useSupabase();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [cookies, setCookies] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
        } else {
          setSessionInfo({
            hasSession: !!data.session,
            userId: data.session?.user?.id || 'none',
            email: data.session?.user?.email || 'none',
            expiresAt: data.session?.expires_at 
              ? new Date(data.session.expires_at * 1000).toISOString()
              : 'none',
            provider: data.session?.user?.app_metadata?.provider || 'none',
            lastSignIn: data.session?.user?.last_sign_in_at || 'none'
          });
        }
        
        // Get all cookies
        const allCookies = document.cookie.split(';')
          .map(c => c.trim())
          .filter(c => c);
        setCookies(allCookies);
        
        // Get all localStorage keys
        try {
          const keys = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) keys.push(key);
          }
          setLocalStorageKeys(keys);
        } catch (e) {
          console.error('Error accessing localStorage:', e);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    
    checkSession();
  }, [supabase.auth, refreshCount]);

  const clearAllCookies = () => {
    try {
      // Clear all cookies by setting expiration to past date
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      });
      
      // Clear localStorage
      localStorage.clear();
      
      // Refresh data
      setRefreshCount(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error clearing cookies');
    }
  };

  const clearSupabaseCookies = () => {
    try {
      // Clear Supabase specific cookies
      clearCookiesByPrefix('sb-');
      
      // Clear Supabase items from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }
      
      // Refresh data
      setRefreshCount(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error clearing Supabase cookies');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded">
        <h2 className="text-2xl font-semibold mb-4">Current User</h2>
        {user ? (
          <div>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
          </div>
        ) : (
          <p>No authenticated user</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Session Information</h2>
        {error ? (
          <div className="p-4 bg-red-100 text-red-800 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : sessionInfo ? (
          <pre className="p-4 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        ) : (
          <p>Loading session information...</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Auth Cookies</h2>
        {cookies.length > 0 ? (
          <ul className="p-4 bg-gray-100 rounded">
            {cookies.map((cookie, i) => (
              <li key={i} className="mb-1">
                {cookie}
              </li>
            ))}
          </ul>
        ) : (
          <p>No cookies found</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">LocalStorage Keys</h2>
        {localStorageKeys.length > 0 ? (
          <ul className="p-4 bg-gray-100 rounded">
            {localStorageKeys.map((key, i) => (
              <li key={i} className="mb-1">
                {key}
              </li>
            ))}
          </ul>
        ) : (
          <p>No localStorage keys found</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Actions</h2>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => window.location.href = '/auth/login'} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
          <button 
            onClick={() => window.location.href = '/dashboard'} 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={async () => {
              try {
                await signOut();
                window.location.reload();
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error during sign out');
              }
            }} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
          <button 
            onClick={clearSupabaseCookies} 
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Clear Supabase Cookies
          </button>
          <button 
            onClick={clearAllCookies} 
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
          >
            Clear All Cookies & Storage
          </button>
          <button 
            onClick={() => {
              setRefreshCount(prev => prev + 1);
            }} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Refresh Data
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Environment Info</h2>
        <div className="p-4 bg-gray-100 rounded">
          <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
          <p><strong>Has Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
          <p><strong>Browser:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent : 'Not available'}</p>
        </div>
      </div>
    </div>
  );
}
