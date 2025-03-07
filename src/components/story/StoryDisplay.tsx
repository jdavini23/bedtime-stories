'use client';

import React, { FC, useState, useCallback, memo } from 'react';
import { Story } from '@/types/story';
import { Button } from '../common/Button';
import { motion } from 'framer-motion';
import { logger } from '@/utils/loggerInstance';
import dynamic from 'next/dynamic';
import ReadingTime from './ReadingTime';
import { ErrorBoundary } from '../error-boundaries/ErrorBoundary';

// Dynamically import TextToSpeech with no SSR to avoid hydration issues
const TextToSpeech = dynamic(() => import('./TextToSpeech'), {
  ssr: false,
  loading: () => (
    <div className="px-6 pb-6">
      <div className="bg-midnight-light/10 dark:bg-midnight-light/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-lg font-medium text-sky-700 dark:text-sky-300 mb-4">
          Loading Text-to-Speech...
        </h3>
      </div>
    </div>
  ),
});

interface StoryDisplayProps {
  story: Story;
}

// Helper function to format story paragraphs with animations
const formatStoryParagraphs = (content: string): React.ReactNode[] => {
  const paragraphs: React.ReactNode[] = content
    .split('\n\n')
    .filter((paragraph: string) => paragraph.trim().length > 0)
    .map((paragraph: string, index: number) => (
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.2, // Stagger paragraph animations
        }}
        className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-cloud/90 font-serif"
      >
        {paragraph.trim()}
      </motion.p>
    ));

  return paragraphs;
};

const StoryDisplay: FC<StoryDisplayProps> = memo(({ story }) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const getThemeEmoji = useCallback((theme: string): string => {
    const emojiMap: Record<string, string> = {
      adventure: '🌟',
      fantasy: '🦄',
      educational: '📚',
      friendship: '🤝',
      courage: '🦁',
    };
    return emojiMap[theme?.toLowerCase()] || '✨';
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(story?.content || '');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err: unknown) {
      logger.error('Failed to copy text:', { error: err });
    }
  }, [story?.content]);

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      const childName = story?.input?.childName || 'You';
      const mailtoLink = `mailto:?subject=A Bedtime Story for ${childName}&body=${encodeURIComponent(story?.content || '')}`;
      window.location.href = mailtoLink;
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  }, [story?.input?.childName, story?.content]);

  // Return early if story is undefined
  if (!story || !story.input) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white/80 dark:bg-midnight-light/30 backdrop-blur-sm rounded-xl shadow-xl">
          <p className="text-gray-700 dark:text-cloud/90 p-8">Story not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {story && story.input && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden bg-white/80 dark:bg-midnight-light/30 backdrop-blur-sm shadow-xl"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 via-primary to-golden" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky to-primary">
                {story.input.childName || 'Your'}&apos;s Bedtime Story
              </h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-cloud/70">
                <span className="text-lg">{getThemeEmoji(story.input.theme)}</span>
                <span>•</span>
                <time dateTime={story.createdAt}>
                  {new Date(story.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
                <span>•</span>
                <ReadingTime text={story.content} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
              {story.input.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/30 rounded-full shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none h-[400px] overflow-y-auto px-6 pb-6 custom-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--color-primary) rgba(var(--midnight-blue), 0.3)',
            }}
          >
            {formatStoryParagraphs(story.content)}
          </div>

          <ErrorBoundary
            fallback={
              <div className="px-6 pb-6">
                <div className="bg-midnight-light/10 dark:bg-midnight-light/20 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-lg font-medium text-rose-600 dark:text-rose-400 mb-4">
                    Text-to-Speech is currently unavailable
                  </h3>
                </div>
              </div>
            }
          >
            <TextToSpeech text={story.content} />
          </ErrorBoundary>

          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="transition-all duration-200 bg-gradient-to-r from-sky to-primary hover:from-sky/90 hover:to-primary/90 text-white border-0 shadow-md rounded-lg py-3"
              >
                <motion.div>
                  <motion.span
                    key={copySuccess ? 'copied' : 'copy'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {copySuccess ? '✓ Copied!' : 'Copy Story'}
                  </motion.span>
                </motion.div>
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="transition-all duration-200 bg-gradient-to-r from-sky to-primary hover:from-sky/90 hover:to-primary/90 text-white border-0 shadow-md rounded-lg py-3"
                disabled={isSharing}
              >
                <motion.span
                  key={isSharing ? 'sharing' : 'share'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSharing ? 'Opening Email...' : 'Share via Email'}
                </motion.span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});

StoryDisplay.displayName = 'StoryDisplay';
export { StoryDisplay };
export default StoryDisplay;
