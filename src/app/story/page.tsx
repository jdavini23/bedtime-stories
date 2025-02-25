'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { StoryWizard } from '@/components/story/StoryWizard';
import { isAdmin } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { StoryInput } from '@/types/story';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StoryPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStoryGeneration = async (storyInput: StoryInput) => {
    setIsGenerating(true);
    try {
      // Here you would call your API to generate the story
      console.log('Generating story with input:', storyInput);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Redirect to the generated story or display it
      console.log('Story generated successfully!');
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
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
            <span className="inline-block animate-float">✨</span> Create Your Story
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="max-w-2xl mx-auto">
          <StoryWizard onComplete={handleStoryGeneration} isLoading={isGenerating} />
        </div>
      </div>
    </div>
  );
}
