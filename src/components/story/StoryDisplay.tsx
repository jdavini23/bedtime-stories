import React, { FC, useState, useCallback } from 'react';
import { Story } from '@/types/story';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

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
          delay: index * 0.2 // Stagger paragraph animations
        }}
        className="mb-6 text-lg leading-relaxed text-gray-700 font-serif"
      >
        {paragraph.trim()}
      </motion.p>
    ));

  return paragraphs;
};

export const StoryDisplay: FC<StoryDisplayProps> = ({ story }) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  // Helper function to get theme emoji
  const getThemeEmoji = useCallback((theme: string): string => {
    const emojiMap: Record<string, string> = {
      adventure: '🌟',
      fantasy: '🦄',
      educational: '📚',
      friendship: '🤝',
      courage: '🦁',
      kindness: '💝',
      curiosity: '🔍',
      creativity: '🎨',
      nature: '🌿',
      science: '🔬'
    };
    return emojiMap[theme.toLowerCase()] || '✨';
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(story.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [story.content]);

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      const mailtoLink = `mailto:?subject=A Bedtime Story for ${story.input.childName}&body=${encodeURIComponent(story.content)}`;
      window.location.href = mailtoLink;
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  }, [story.input.childName, story.content]);

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {story && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
                {story.input.childName}&apos;s Magical Story
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Generated on {new Date(story.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              {story.input.interests.map((interest, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="story-content">
            {formatStoryParagraphs(story.content)}
          </div>
          
          <motion.div 
            className="flex gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex-1 transition-all duration-200 hover:bg-indigo-50"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={copySuccess ? 'copied' : 'copy'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {copySuccess ? '✓ Copied!' : 'Copy Story'}
                </motion.span>
              </AnimatePresence>
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex-1 transition-all duration-200 hover:bg-indigo-50"
              disabled={isSharing}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={isSharing ? 'sharing' : 'share'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSharing ? 'Opening Email...' : 'Share via Email'}
                </motion.span>
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

StoryDisplay.displayName = 'StoryDisplay';
