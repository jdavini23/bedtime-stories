'use client';

import { useUser } from '@clerk/nextjs';

export default function MiddlewareTestPage() {
  const { user, isLoaded } = useUser();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Middleware Test Page</h1>
      {isLoaded ? (
        <p>User ID: {user?.id || 'Not authenticated'}</p>
      ) : (
        <p>Loading...</p>
      )}
      <p>If you can see this page without errors, the middleware is working correctly!</p>
    </div>
  );
}
