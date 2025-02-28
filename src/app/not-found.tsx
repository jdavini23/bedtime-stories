'use client';

import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Log the 404 error to Sentry
    Sentry.captureMessage('404 - Page Not Found', 'error');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
