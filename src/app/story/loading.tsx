import React from 'react';

export default function StoryLoading() {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />

        {/* Story content skeleton */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
            </div>
          ))}
        </div>

        {/* Controls skeleton */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
        </div>
      </div>
    </div>
  );
}
