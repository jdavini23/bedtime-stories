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
      // Option 1: Use the API route
      const response = await fetch('/api/generateStory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyInput),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate story');
      }

      const storyData = await response.json();

      // Create a properly formatted Story object from the API response
      const story: Story = {
        id: storyData.id || `story-${Date.now()}`,
        title: storyData.title || `${storyInput.childName}'s ${storyInput.theme} Adventure`,
        content: storyData.content,
        theme: storyInput.theme,
        createdAt: storyData.createdAt || new Date().toISOString(),
        input: storyInput as unknown as StoryInput,
        metadata: storyData.metadata || {
          pronouns:
            storyInput.gender === 'boy'
              ? 'he/him'
              : storyInput.gender === 'girl'
                ? 'she/her'
                : 'they/them',
          possessivePronouns:
            storyInput.gender === 'boy' ? 'his' : storyInput.gender === 'girl' ? 'her' : 'their',
          generatedAt: new Date().toISOString(),
        },
        userId: user?.id || 'anonymous',
        pronouns:
          storyInput.gender === 'boy'
            ? 'he/him'
            : storyInput.gender === 'girl'
              ? 'she/her'
              : 'they/them',
        possessivePronouns:
          storyInput.gender === 'boy' ? 'his' : storyInput.gender === 'girl' ? 'her' : 'their',
        generatedAt: storyData.generatedAt || new Date().toISOString(),
      };

      // Option 2: Use the personalization engine directly (alternative approach)
      // Uncomment this section if you prefer to use the engine directly
      /*
      const personalizationEngine = new UserPersonalizationEngine(user?.id);
      const story = await personalizationEngine.generatePersonalizedStory(storyInput);
      */

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
    <div className="min-h-screen bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20 p-4">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center text-midnight dark:text-text-primary">
            <span className="inline-block animate-float">✨</span>{' '}
            {generatedStory ? 'Your Story' : 'Create Your Story'}
          </h1>
          <div className="w-24">
            {!generatedStory && (
              <Button variant="outline" size="sm" onClick={toggleWizardStyle}>
                {useConversationalUI ? 'Classic UI' : 'Chat UI'}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
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
          <div className="max-w-3xl mx-auto">
            <StoryDisplay story={generatedStory} />
            <div className="flex justify-center mt-8">
              <Button onClick={handleCreateNewStory} className="px-6 py-2">
                Create Another Story
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {useConversationalUI ? (
              <ConversationalWizard onComplete={handleStoryGeneration} isLoading={isGenerating} />
            ) : (
              <StoryWizard onComplete={handleStoryGeneration} isLoading={isGenerating} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
