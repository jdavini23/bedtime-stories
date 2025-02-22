'use client';

import { useUser } from '@/hooks/useUser';
import { ThemeStep } from '@/components/story/ThemeStep';
import { isAdmin } from '@/utils/auth';
import { redirect } from 'next/navigation';

export default function StoryPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect('/sign-in');
  }

  if (user && isAdmin(user)) {
    return (
      <div className="admin-test-panel p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <ThemeStep onComplete={(theme) => console.log('Selected theme:', theme)} />
    </div>
  );
}