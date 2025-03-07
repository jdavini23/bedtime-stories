'use client';

import React from 'react';
import { StoryInput } from '@/types/story';
import { Button } from '@/components/common/Button';
import { EnhancedStoryInput, StoryCharacter } from '@/services/personalizationEngine';

// Extend the interface to include the ageGroup property
interface PreviewStepProps {
  storyInput: StoryInput;
  enhancedStoryInput: EnhancedStoryInput;
  onBack: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  storyInput,
  enhancedStoryInput,
  onBack,
  onSubmit,
  isLoading = false,
}) => {
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
      <div className="bg-white dark:bg-midnight-light rounded-lg p-6 shadow-dreamy">
        <h3 className="text-xl font-semibold text-primary mb-4">Story Preview</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-primary mb-1">
              Theme
            </h4>
            <p className="text-text-primary dark:text-text-primary/90">{storyInput.theme}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-primary mb-1">
              Character
            </h4>
            <p className="text-text-primary dark:text-text-primary/90">{storyInput.childName}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-primary mb-1">
              Gender
            </h4>
            <p className="text-text-primary dark:text-text-primary/90">{storyInput.gender}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-primary mb-1">
              Reading Level
            </h4>
            <p className="text-text-primary dark:text-text-primary/90">
              {storyInput.readingLevel} {storyInput.ageGroup ? `(Ages ${storyInput.ageGroup})` : ''}
            </p>
          </div>

          {storyInput.interests && storyInput.interests.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-secondary dark:text-text-primary mb-1">
                Interests
              </h4>
              <p className="text-text-primary dark:text-text-primary/90">
                {Array.isArray(storyInput.interests)
                  ? storyInput.interests.join(', ')
                  : storyInput.interests}
              </p>
            </div>
          )}

          {storyInput.mainCharacter?.traits && storyInput.mainCharacter.traits.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-secondary dark:text-text-primary mb-1">
                Character Traits
              </h4>
              <p className="text-text-primary dark:text-text-primary/90">
                {storyInput.mainCharacter.traits.join(', ')}
              </p>
            </div>
          )}

          {storyInput.supportingCharacters && storyInput.supportingCharacters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-secondary dark:text-text-primary mb-1">
                Supporting Character
              </h4>
              <p className="text-text-primary dark:text-text-primary/90">
                {renderSupportingCharacter(storyInput.supportingCharacters[0])}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? 'Creating Story...' : 'Create Story'}
        </Button>
      </div>
    </div>
  );
};

export { PreviewStep };
export default PreviewStep;
