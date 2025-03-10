'use client';

import React from 'react';
import { Button } from '@/components/common/Button';

export default function StoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to console in development
    console.error('Story page error:', error);
  }, [error]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white/80 dark:bg-midnight-light/30 backdrop-blur-sm rounded-xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We encountered an error while loading your story. Please try again.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
