'use client';

import { useState, useEffect } from 'react';

export interface Story {
  id: string;
  title?: string;
  content?: string;
}

export function useUserStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching data with a timeout
    const timer = setTimeout(() => {
      setStories([
        { id: '1', title: 'A New Beginning', content: 'Once upon a time, ...' },
        { id: '2', title: 'The Adventure Continues', content: 'The journey goes on, ...' }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { stories, isLoading };
}


