'use client';

import { useState, useEffect } from 'react';
import { ConversationalWizardWithProvider as ConversationalWizard } from '@/components/story/wizard';
import { StoryDisplay } from '@/components/story/StoryDisplay';
import { StoryInput, Story } from '@/types/story';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { StoryGenerator } from '@/services/personalization/storyGeneration';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';

export default function StoryPage() {
  const { session, user, isAuthenticated, isLoading } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we've finished loading and the user isn't authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleStoryGeneration = async (storyInput: StoryInput) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Use the story generator which now uses our secure server-side API
      const storyGenerator = new StoryGenerator(user?.id || 'anonymous-user');

      // Log authentication status for debugging
      console.log('[StoryPage] Starting story generation', {
        storyInput,
        isAuthenticated,
        userId: user?.id || 'anonymous-user',
      });

      const story = await storyGenerator.generatePersonalizedStory(storyInput);

      // Log the generated story for debugging
      console.log('[StoryPage] Story generated successfully', {
        storyId: story.id,
        hasTitle: !!story.title,
        contentLength: story.content.length,
        metadata: story.metadata,
      });

      // Set the generated story
      setGeneratedStory(story);
    } catch (error) {
      console.error('[StoryPage] Error generating story:', error);

      // Enhanced error handling with specific user messages
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate story';
      if (errorMessage.includes('API key')) {
        setError('OpenAI API key configuration error. Please check your API key setup.');
      } else if (errorMessage.includes('authentication') || errorMessage.includes('Unauthorized')) {
        setError('Authentication error. Please try signing in again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNewStory = () => {
    setGeneratedStory(null);
    setError(null);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20 p-4 flex flex-col justify-center items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20 p-4 flex flex-col">
      <div className="container mx-auto py-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="hover:bg-white/10 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center text-midnight dark:text-text-primary">
            <span className="inline-block animate-float">✨</span>
            {generatedStory ? 'Your Story' : 'Create Your Story'}
          </h1>
          <div className="w-24" /> {/* Spacer for layout balance */}
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg shadow-md">
            <p className="font-medium">Error: {error}</p>
            <p className="text-sm mt-2">
              Please try again or use different story parameters.
              {error.includes('API key') && (
                <span className="block mt-1">
                  <Link
                    href="/admin/test-api"
                    className="underline hover:text-red-600 dark:hover:text-red-300"
                  >
                    Test your OpenAI API key configuration
                  </Link>
                </span>
              )}
            </p>
          </div>
        )}

        {generatedStory ? (
          <div className="max-w-3xl mx-auto flex-grow flex items-center flex-col">
            <StoryDisplay story={generatedStory} />
            <div className="mt-6 mb-4">
              <Button
                onClick={handleCreateNewStory}
                className="px-8 py-3 bg-gradient-to-r from-golden to-golden-light hover:from-golden/90 hover:to-golden-light/90 text-midnight font-medium shadow-dreamy rounded-full transition-all duration-200"
              >
                Create Another Story
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto my-auto flex-grow flex items-center">
            <ConversationalWizard onComplete={handleStoryGeneration} isLoading={isGenerating} />
          </div>
        )}
      </div>
    </div>
  );
}
