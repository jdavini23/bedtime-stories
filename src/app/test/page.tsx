'use client';

import React from 'react';
import { StoryWizard } from '@/components/story/StoryWizard';
import { StoryInput } from '@/types/story';

export default function TestPage() {
  const handleComplete = async (input: StoryInput) => {
    console.log('Story input:', input);
    // In a real app, this would send the input to an API to generate the story
    alert('Story input received! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Story Generator Wizard Demo
        </h1>
        <StoryWizard onComplete={handleComplete} />
      </div>
    </div>
  );
}