'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { StoryWizard } from '@/components/story/StoryWizard';
import { ConversationalWizard } from '@/components/story/ConversationalWizard';
import { StoryDisplay } from '@/components/story/StoryDisplay';
import { isAdmin } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { StoryInput, Story } from '@/types/story';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EnhancedStoryInput } from '@/services/personalizationEngine';
import { UserPersonalizationEngine } from '@/services/personalizationEngine';

// Extend the EnhancedStoryInput to include ageGroup
interface ExtendedStoryInput extends EnhancedStoryInput {
  ageGroup?: string;
}

export default function StoryPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useConversationalUI, setUseConversationalUI] = useState(true);

  const handleStoryGeneration = async (storyInput: ExtendedStoryInput) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Use the personalization engine which now uses our secure server-side API
      const personalizationEngine = new UserPersonalizationEngine(user?.id);
      const story = await personalizationEngine.generatePersonalizedStory(storyInput);

      // Set the generated story
      setGeneratedStory(story);
      console.log('Story generated successfully!', story);
    } catch (error) {
      console.error('Error generating story:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNewStory = () => {
    setGeneratedStory(null);
    setError(null);
  };

  const toggleWizardStyle = () => {
    setUseConversationalUI(!useConversationalUI);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    );
  }

  // Temporarily commenting out authentication check for testing
  /*
  if (!isSignedIn) {
    redirect('/sign-in');
  }

  if (user && isAdmin(user)) {
    return (
      <div className="admin-test-panel p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    );
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20 p-4 flex flex-col">
      <div className="container mx-auto py-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-white/10 transition-colors">
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
            <span className="inline-block animate-float">✨</span>{' '}
            {generatedStory ? 'Your Story' : 'Create Your Story'}
          </h1>
          <div className="w-24">
            {!generatedStory && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleWizardStyle}
                className="hover:bg-white/10 transition-colors"
              >
                {useConversationalUI ? 'Classic UI' : 'Chat UI'}
              </Button>
            )}
          </div>
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
            {useConversationalUI ? (
              <ConversationalWizard onComplete={handleStoryGeneration} isLoading={isGenerating} />
            ) : (
              <div className="bg-white/80 dark:bg-midnight-light/30 rounded-xl shadow-xl p-6 backdrop-blur-sm w-full">
                <StoryWizard onComplete={handleStoryGeneration} isLoading={isGenerating} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
