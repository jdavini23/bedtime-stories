'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryInput } from '@/types/story';
import { ThemeStep } from './ThemeStep';
import { CharacterStep } from './CharacterStep';
import { ReadingLevelStep } from './ReadingLevelStep';
import { PreviewStep } from './PreviewStep';

interface StoryWizardProps {
  onComplete: (input: StoryInput) => Promise<void>;
  isLoading?: boolean;
}

type WizardStep = 'theme' | 'character' | 'readingLevel' | 'preview';

export function StoryWizard({ onComplete, isLoading = false }: StoryWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('theme');
  const [storyInput, setStoryInput] = useState<Partial<StoryInput>>({
    theme: '',
    childName: '',
    gender: 'neutral',
    mood: 'adventurous',
    interests: '',
    readingLevel: 'intermediate',
  });

  const handleStepComplete = (stepData: Partial<StoryInput>) => {
    setStoryInput((prev) => ({ ...prev, ...stepData }));

    // Move to next step
    switch (currentStep) {
      case 'theme':
        setCurrentStep('character');
        break;
      case 'character':
        setCurrentStep('readingLevel');
        break;
      case 'readingLevel':
        setCurrentStep('preview');
        break;
      case 'preview':
        if (isValidStoryInput(storyInput)) {
          onComplete(storyInput as StoryInput);
        }
        break;
    }
  };

  const isValidStoryInput = (input: Partial<StoryInput>): input is StoryInput => {
    return !!input.theme && !!input.childName && !!input.readingLevel;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl p-6"
        >
          {currentStep === 'theme' && (
            <ThemeStep
              onComplete={(theme) => handleStepComplete({ theme })}
              initialValue={storyInput.theme}
            />
          )}

          {currentStep === 'character' && (
            <CharacterStep
              onComplete={(characterData) => handleStepComplete(characterData)}
              initialValues={{
                childName: storyInput.childName || '',
                gender: storyInput.gender || 'neutral',
                interests: storyInput.interests || '',
              }}
            />
          )}

          {currentStep === 'readingLevel' && (
            <ReadingLevelStep
              onComplete={(level: 'beginner' | 'intermediate' | 'advanced') =>
                handleStepComplete({ readingLevel: level })
              }
              initialValue={storyInput.readingLevel}
            />
          )}

          {currentStep === 'preview' && (
            <PreviewStep
              storyInput={storyInput as StoryInput}
              onBack={() => setCurrentStep('readingLevel')}
              onComplete={() => {
                if (isValidStoryInput(storyInput)) {
                  onComplete(storyInput as StoryInput);
                }
              }}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => {
            switch (currentStep) {
              case 'character':
                setCurrentStep('theme');
                break;
              case 'readingLevel':
                setCurrentStep('character');
                break;
              case 'preview':
                setCurrentStep('readingLevel');
                break;
            }
          }}
          className={`px-4 py-2 text-sm text-gray-600 hover:text-gray-800 ${currentStep === 'theme' ? 'invisible' : ''}`}
        >
          Back
        </button>
        <div className="flex space-x-2">
          <div className="flex space-x-1">
            {['theme', 'character', 'readingLevel', 'preview'].map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${currentStep === step ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
