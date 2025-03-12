'use client';

import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      // Redirect if not authenticated
      if (!isSignedIn) {
        router.push('/sign-in?redirect_url=/dashboard/profile');
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isLoading) {
    return <div className="p-4 max-w-4xl mx-auto">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
        <p className="mb-4">
          There was a problem loading your profile. Please sign in and try again.
        </p>
        <Link
          href="/sign-in?redirect_url=/dashboard/profile"
          className="text-blue-600 hover:underline"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={`${user.firstName}'s profile`}
              width={80}
              height={80}
              className="rounded-full mr-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                {user.firstName?.[0] || user.lastName?.[0] || 'U'}
              </span>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {user.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium mb-2">Account Information</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="block">
                <strong>User ID:</strong> {user.id}
              </span>
              <span className="block mt-1">
                <strong>Created:</strong>{' '}
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
              <span className="block mt-1">
                <strong>Last Sign In:</strong>{' '}
                {new Date(user.lastSignInAt || Date.now()).toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="border dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium mb-2">Preferences</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="block">Manage your story preferences and account settings.</span>
            </p>
            <Link
              href="/dashboard/preferences"
              className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Edit Preferences →
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
