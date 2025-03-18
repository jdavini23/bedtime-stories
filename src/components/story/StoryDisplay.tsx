'use client';

import React, { FC, useState, useCallback, memo } from 'react';
import { Story } from '@/types/story';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ReadingTime from './ReadingTime';
import { cn } from '@/utils/cn';
import { colorOpacityClasses } from '@/utils/colors';

// TODO: Text-to-speech functionality is temporarily disabled.
// Will be re-implemented later using the TextToSpeech component.
// See src/components/story/TextToSpeech.tsx for the implementation.

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
        className="mb-6 text-lg leading-relaxed text-text-secondary dark:text-text-primary font-serif"
      >
        {paragraph.trim()}
      </motion.p>
    ));

  return paragraphs;
};

interface StoryDisplayProps {
  story: Story;
}

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
      console.error('Failed to copy text:', err);
    }
  }, [story?.content]);

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      const childName = story?.metadata?.input?.childName || 'You';
      const mailtoLink = `mailto:?subject=A Bedtime Story for ${childName}&body=${encodeURIComponent(story?.content || '')}`;
      window.location.href = mailtoLink;
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  }, [story?.metadata?.input?.childName, story?.content]);

  // Return early if story is undefined
  if (!story || !story.metadata?.input) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-background/80 dark:bg-midnight/30 backdrop-blur-sm rounded-xl shadow-dreamy">
          <p className="text-text-secondary dark:text-text-primary p-8">Story not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {story && story.metadata?.input && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden bg-gray-900/80 dark:bg-gray-900/30 backdrop-blur-sm shadow-xl dark:shadow-dreamy"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                {story.metadata.input.childName || 'Your'}&apos;s Bedtime Story
              </h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <span className="text-lg">{getThemeEmoji(story.metadata.input.theme)}</span>
                <span>•</span>
                <time dateTime={new Date(story.metadata.timestamp).toISOString()}>
                  {new Date(story.metadata.timestamp).toLocaleDateString(undefined, {
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
              {story.metadata.input.characters.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 text-xs font-medium text-violet-300 bg-violet-500/10 rounded-full shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div
            className="prose prose-lg prose-invert max-w-none h-[400px] overflow-y-auto px-6 pb-6 custom-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--violet-600) var(--gray-900)',
            }}
          >
            {formatStoryParagraphs(story.content)}
          </div>

          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleCopy}
                className={cn(
                  'transition-all duration-200',
                  'bg-gradient-to-r from-violet-600 to-indigo-600',
                  'hover:from-violet-500 hover:to-indigo-500',
                  'text-white border-0 shadow-dreamy rounded-xl py-3'
                )}
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
                className={cn(
                  'transition-all duration-200',
                  'bg-gradient-to-r from-violet-600 to-indigo-600',
                  'hover:from-violet-500 hover:to-indigo-500',
                  'text-white border-0 shadow-dreamy rounded-xl py-3'
                )}
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
