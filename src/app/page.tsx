'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Story, StoryInput } from '@/types/story';
import { storyApi } from '@/services/api';
import Spinner from '@/components/common/Spinner';

// Static animation configuration
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Dynamically import components
const StoryForm = dynamic(() => import('@/components/story/StoryForm'), { 
  loading: () => <Spinner />,
  ssr: false 
});

const StoryDisplay = dynamic(() => import('@/components/story/StoryDisplay'), { 
  loading: () => <Spinner />,
  ssr: false 
});

const titleEmojis = ['🌙', '⭐', '📚', '🌟'];

export default function Home() {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStory = useCallback(async (input: StoryInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const newStory = await storyApi.generateStory(input);
      setStory(newStory);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate story';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center gap-4 mb-6">
            {titleEmojis.map((emoji, index) => (
              <motion.span
                key={index}
                className="text-4xl sm:text-5xl"
                variants={floatingAnimation}
                initial="initial"
                animate="animate"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          <motion.h1 
            className="text-5xl sm:text-6xl font-bold mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Bedtime Story Magic
            </span>
          </motion.h1>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-xl text-gray-600 leading-relaxed">
              Where imagination meets AI to create enchanting, personalized stories 
              <br className="hidden sm:block" />
              that make bedtime the most magical part of the day ✨
            </p>
          </motion.div>
        </motion.div>

        <StoryForm onSubmit={handleGenerateStory} isLoading={isLoading} />

        {error && (
          <motion.div 
            className="bg-red-50 text-red-700 p-4 rounded-lg mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {isLoading && <Spinner />}

        {story && <StoryDisplay story={story} />}
      </main>
    </div>
  );
}
