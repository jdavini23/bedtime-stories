'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

import { Button } from '@/components/common/Button';
import { StoryCard } from '@/components/StoryCard';
import { useUserStories } from '@/hooks/useUserStories';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { stories, isLoading: storiesIsLoading } = useUserStories();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    } else if (!storiesIsLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading, storiesIsLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome, {user?.displayName || 'User'}!
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link href="/story/create">
              <Button className="w-full">
                Create New Story
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Your Stories
          </h3>
          <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories?.map((story) => (
              <li key={story.id}>
                <StoryCard story={story} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
