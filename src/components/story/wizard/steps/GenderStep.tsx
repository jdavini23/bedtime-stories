'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useWizardState } from '../useWizardState';
import { GENDER_OPTIONS } from '../types';
import { StoryGender } from '@/types/story';

export function GenderStep() {
  const { handleGenderSelect, storyInput } = useWizardState();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {GENDER_OPTIONS.map((option) => (
          <Button
            key={option.value}
            onClick={() => handleGenderSelect(option.value as StoryGender)}
            className="flex items-center justify-start space-x-2 h-auto py-3 px-4 text-left bg-sky-800/50 hover:bg-sky-700/50 border-sky-600/30 hover:border-sky-500/50 transition-all duration-200 text-white"
          >
            <span className="text-xl">{option.emoji}</span>
            <span>{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
