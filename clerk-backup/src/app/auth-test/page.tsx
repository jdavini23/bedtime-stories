'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function AuthTestPage() {
  const { isLoaded: authLoaded, isSignedIn, userId } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const [serverCheck, setServerCheck] = useState<string>('Checking...');

  useEffect(() => {
    // Check server-side auth state
    const checkServerAuth = async () => {
      try {
        const response = await fetch('/api/auth-check');
        const data = await response.json();
        setServerCheck(JSON.stringify(data, null, 2));
      } catch (error) {
        setServerCheck(
          `Error checking server auth: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    };

    if (authLoaded) {
      checkServerAuth();
    }
  }, [authLoaded]);

  if (!authLoaded || !userLoaded) {
    return <div className="p-4">Loading authentication state...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Client-Side Auth State</h2>
        <pre className="bg-white p-2 rounded overflow-auto">
          {JSON.stringify(
            {
              isSignedIn,
              userId,
              userEmail: user?.emailAddresses?.[0]?.emailAddress,
              firstName: user?.firstName,
              lastName: user?.lastName,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Server-Side Auth State</h2>
        <pre className="bg-white p-2 rounded overflow-auto">{serverCheck}</pre>
      </div>

      <div className="mt-4">
        <a href="/dashboard" className="text-blue-500 underline mr-4">
          Try Dashboard
        </a>
        <a href="/sign-in" className="text-blue-500 underline">
          Go to Sign In
        </a>
      </div>
    </div>
  );
}
