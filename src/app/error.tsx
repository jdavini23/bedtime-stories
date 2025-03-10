'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-text-secondary dark:text-text-primary/80 mb-6">
            {error.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}