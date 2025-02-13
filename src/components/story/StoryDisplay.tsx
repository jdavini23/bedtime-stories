import { FC, useState } from 'react';
import { Story } from '@/types/story';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryDisplayProps {
  story: Story;
}

// Helper function to format story paragraphs with animations
const formatStoryParagraphs = (content: string) => {
  const paragraphs = content.split('\n\n')
    .filter(paragraph => paragraph.trim().length > 0)
    .map((paragraph, index) => (
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
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Helper function to get theme emoji
  const getThemeEmoji = (theme: string): string => {
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
    return emojiMap[theme] || '✨';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(story.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const mailtoLink = `mailto:?subject=A Bedtime Story for ${story.input.childName}&body=${encodeURIComponent(story.content)}`;
      window.location.href = mailtoLink;
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="mb-8 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              initial={{ rotate: -5 }}
              animate={{ rotate: 5 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="inline-block"
            >
              <span className="text-5xl mb-2">{getThemeEmoji(story.input.theme)}</span>
            </motion.div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3">
              {story.input.childName}'s Magical Story
            </h1>
            
            <motion.div 
              className="flex items-center gap-2 text-lg text-gray-600"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                {story.input.theme.charAt(0).toUpperCase() + story.input.theme.slice(1)}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 font-medium">
                {new Date(story.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </motion.div>

            <motion.div
              className="mt-4 flex flex-wrap gap-2 justify-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {story.input.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="story-content">
          {formatStoryParagraphs(story.content)}
        </div>
      </motion.div>

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
  );
};

StoryDisplay.displayName = 'StoryDisplay';
