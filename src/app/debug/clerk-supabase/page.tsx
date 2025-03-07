'use client';

import React from 'react';
import { ClerkSupabaseIntegrationTest } from '@/components/debug/ClerkSupabaseIntegrationTest';
import { useRouter } from 'next/navigation';

export default function ClerkSupabaseDebugPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Clerk-Supabase Integration Debug</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        This page allows you to test and verify the integration between Clerk authentication and
        Supabase. Use the tools below to check if the authentication flow is working correctly and
        if Row Level Security (RLS) policies are properly enforced.
      </p>

      <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-200">
              <strong>Note:</strong> Make sure you're accessing this page on the correct port. The
              Next.js development server may run on a different port (like 3001) if the default port
              (3000) is already in use.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <ErrorBoundary>
          <ClerkSupabaseIntegrationTest />
        </ErrorBoundary>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              <strong>Warning:</strong> This debug page should only be used in development
              environments. Make sure to disable or protect it in production.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-midnight p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Integration Requirements</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Clerk JWT template configured for Supabase</li>
            <li>Supabase RLS policies properly set up</li>
            <li>User records synchronized between Clerk and Supabase</li>
            <li>Middleware configured to pass authentication tokens</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-midnight p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Troubleshooting</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Verify Clerk webhook is properly configured at <code>/api/webhook/clerk</code>
            </li>
            <li>Check Supabase RLS policies for correct auth.uid() usage</li>
            <li>Ensure environment variables are set correctly</li>
            <li>Verify Clerk JWT template is configured for Supabase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-700 dark:text-red-300">
            Something went wrong
          </h2>
          <p className="mb-4 text-red-600 dark:text-red-200">
            There was an error loading the integration test component.
          </p>
          <div className="bg-white dark:bg-gray-800 p-4 rounded overflow-auto">
            <pre className="text-xs text-red-500 dark:text-red-300">
              {this.state.error?.message || 'Unknown error'}
            </pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
