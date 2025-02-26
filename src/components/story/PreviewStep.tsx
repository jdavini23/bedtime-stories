'use client';

import React from 'react';
import { StoryInput } from '@/types/story';
import { Button } from '@/components/ui/button';
import { EnhancedStoryInput, StoryCharacter } from '@/services/personalizationEngine';

// Extend the interface to include the ageGroup property
interface ExtendedStoryInput extends EnhancedStoryInput {
  ageGroup?: string;
}

interface PreviewStepProps {
  storyInput: ExtendedStoryInput;
  onBack: () => void;
  onComplete: () => void;
  isLoading?: boolean;
}

export function PreviewStep({
  storyInput,
  onBack,
  onComplete,
  isLoading = false,
}: PreviewStepProps) {
  // Helper function to display supporting character details
  const renderSupportingCharacter = (character?: StoryCharacter) => {
    if (!character) return 'None';

    const parts = [];
    if (character.name) parts.push(character.name);
    if (character.type) parts.push(character.type);
    if (character.traits && character.traits.length > 0) parts.push(character.traits.join(', '));
    if (character.role) parts.push(`role: ${character.role}`);

    return parts.join(' - ') || 'None';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-midnight dark:text-text-primary">
          Preview Your Story Settings
        </h2>
        <p className="mt-2 text-sm text-text-secondary dark:text-text-primary/80">
          Review your story settings before we create your personalized story
        </p>
      </div>

      <div className="space-y-4 bg-gray-50 dark:bg-midnight/30 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-text-secondary dark:text-text-primary/80">
              Theme
            </h3>
            <p className="mt-1 text-sm text-midnight dark:text-text-primary">{storyInput.theme}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary dark:text-text-primary/80">
              Character Name
            </h3>
            <p className="mt-1 text-sm text-midnight dark:text-text-primary">
              {storyInput.childName}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary dark:text-text-primary/80">
              Gender
            </h3>
            <p className="mt-1 text-sm text-midnight dark:text-text-primary">{storyInput.gender}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary dark:text-text-primary/80">
              Reading Level
            </h3>
            <p className="mt-1 text-sm text-midnight dark:text-text-primary">
              {storyInput.readingLevel} {storyInput.ageGroup ? `(Ages ${storyInput.ageGroup})` : ''}
            </p>
          </div>

          {storyInput.interests && storyInput.interests.length > 0 && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-text-secondary dark:text-text-primary/80">
                Interests
              </h3>
              <p className="mt-1 text-sm text-midnight dark:text-text-primary">
                {Array.isArray(storyInput.interests)
                  ? storyInput.interests.join(', ')
                  : storyInput.interests}
              </p>
            </div>
          )}

          {storyInput.mainCharacter?.traits && storyInput.mainCharacter.traits.length > 0 && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-text-secondary dark:text-text-primary/80">
                Character Traits
              </h3>
              <p className="mt-1 text-sm text-midnight dark:text-text-primary">
                {storyInput.mainCharacter.traits.join(', ')}
              </p>
            </div>
          )}

          {storyInput.supportingCharacters && storyInput.supportingCharacters.length > 0 && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-text-secondary dark:text-text-primary/80">
                Supporting Character
              </h3>
              <p className="mt-1 text-sm text-midnight dark:text-text-primary">
                {renderSupportingCharacter(storyInput.supportingCharacters[0])}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>

        <Button variant="primary" onClick={onComplete} disabled={isLoading} className="w-1/2">
          {isLoading ? (
            <>
              <span className="inline-block animate-pulse mr-2">✨</span>
              Generating Story...
            </>
          ) : (
            <>
              <span className="inline-block mr-2">✨</span>
              Create Story
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
