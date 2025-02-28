import * as ClerkServer from '@clerk/nextjs/server';

export default async function MiddlewareTestPage() {
  // This will throw an error if middleware is not properly configured
  const { userId } = await ClerkServer.auth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Middleware Test Page</h1>
      <p>User ID: {userId || 'Not authenticated'}</p>
      <p>If you can see this page without errors, the middleware is working correctly!</p>
    </div>
  );
}
