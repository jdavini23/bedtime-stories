'use client';

import React from 'react';
import readingTime from 'reading-time';

interface ReadingTimeProps {
  text: string;
  className?: string;
}

const ReadingTime: React.FC<ReadingTimeProps> = ({ text, className = '' }) => {
  const stats = readingTime(text);

  // For bedtime stories, we want to adjust the reading time to be a bit slower
  // since parents often read more slowly and expressively to children
  const adjustedMinutes = Math.ceil(stats.minutes * 1.3); // 30% slower for bedtime reading

  // Format the time in a friendly way
  const getFormattedTime = () => {
    if (adjustedMinutes < 1) {
      return 'Less than a minute';
    } else if (adjustedMinutes === 1) {
      return '1 minute';
    } else {
      return `${adjustedMinutes} minutes`;
    }
  };

  return (
    <div
      className={`flex items-center text-sm font-medium text-gray-700 dark:text-cloud ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1 text-primary-600 dark:text-primary-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        <span className="font-semibold text-primary-600 dark:text-primary-400">
          {getFormattedTime()}
        </span>{' '}
        reading time
      </span>
    </div>
  );
};

export default ReadingTime;
