'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryInput, StoryTheme, StoryGender, StoryMetadata } from '@/types/story';
import { ThemeStep } from './ThemeStep';
import { CharacterStep } from './CharacterStep';
import { ReadingLevelStep } from './ReadingLevelStep';
import { PreviewStep } from './PreviewStep';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/ui/card';
import {
  EnhancedStoryInput,
  StoryCharacter,
  UserPreferences,
} from '@/services/personalizationEngine';

// Extend the EnhancedStoryInput to include ageGroup
interface ExtendedStoryInput extends EnhancedStoryInput {
  ageGroup?: UserPreferences['ageGroup'];
}

interface StoryWizardProps {
  onComplete: (input: ExtendedStoryInput) => Promise<void>;
  isLoading?: boolean;
}

type WizardStep = 'theme' | 'character' | 'readingLevel' | 'preview';

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 'theme', label: 'Theme' },
  { id: 'character', label: 'Character' },
  { id: 'readingLevel', label: 'Reading Level' },
  { id: 'preview', label: 'Preview' },
];

export function StoryWizard({ onComplete, isLoading = false }: StoryWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('theme');
  const [direction, setDirection] = useState(0);
  const [storyInput, setStoryInput] = useState<Partial<ExtendedStoryInput>>({
    theme: '' as StoryTheme,
    childName: '',
    gender: 'neutral' as StoryGender,
    mood: 'adventurous',
    interests: [],
    mostLikedCharacterTypes: [],
    readingLevel: 'intermediate' as StoryMetadata['readingLevel'],
    ageGroup: '6-8',
    mainCharacter: {
      traits: [],
      appearance: [],
      skills: [],
    },
    supportingCharacters: [],
  });

  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);

  const handleStepComplete = (stepData: Partial<ExtendedStoryInput>) => {
    setStoryInput((prev) => ({ ...prev, ...stepData }));
    goToNextStep();
  };

  const goToNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    } else if (isValidStoryInput(storyInput)) {
      onComplete(storyInput as ExtendedStoryInput);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const isValidStoryInput = (input: Partial<ExtendedStoryInput>): input is ExtendedStoryInput => {
    return (
      !!input.theme &&
      !!input.childName &&
      !!input.readingLevel &&
      !!input.gender &&
      Array.isArray(input.mostLikedCharacterTypes) &&
      input.mostLikedCharacterTypes.length > 0
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'theme':
        return (
          <ThemeStep
            onComplete={(theme) => handleStepComplete({ theme: theme as StoryTheme })}
            initialValue={storyInput.theme}
          />
        );
      case 'character':
        return (
          <CharacterStep
            onComplete={(characterData) => {
              const {
                childName,
                gender,
                interests,
                characterTraits,
                supportingCharacter,
                mostLikedCharacterTypes,
              } = characterData;

              // Create enhanced story input with character customization
              const enhancedData: Partial<ExtendedStoryInput> = {
                childName,
                gender: gender as StoryGender,
                interests: interests
                  ? interests
                      .split(',')
                      .map((i) => i.trim())
                      .filter(Boolean)
                  : [],
                mostLikedCharacterTypes: mostLikedCharacterTypes || [],
                mainCharacter: {
                  traits: characterTraits || [],
                },
              };

              // Add supporting character if provided
              if (supportingCharacter) {
                enhancedData.supportingCharacters = [supportingCharacter];
              }

              handleStepComplete(enhancedData);
            }}
            initialValues={{
              childName: storyInput.childName || '',
              gender: storyInput.gender || 'neutral',
              interests: Array.isArray(storyInput.interests) ? storyInput.interests.join(', ') : '',
              characterTraits: storyInput.mainCharacter?.traits || [],
              supportingCharacter: storyInput.supportingCharacters?.[0],
            }}
            theme={storyInput.theme}
          />
        );
      case 'readingLevel':
        return (
          <ReadingLevelStep
            onComplete={(level, ageGroup) =>
              handleStepComplete({
                readingLevel: level as StoryMetadata['readingLevel'],
                ageGroup,
              })
            }
            initialValue={storyInput.readingLevel}
            initialAgeGroup={storyInput.ageGroup}
          />
        );
      case 'preview':
        return (
          <PreviewStep
            storyInput={storyInput as ExtendedStoryInput}
            onBack={goToPreviousStep}
            onComplete={() => {
              if (isValidStoryInput(storyInput)) {
                onComplete(storyInput as ExtendedStoryInput);
              }
            }}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  // Update animation properties based on direction
  const getAnimationProps = () => {
    return {
      initial: {
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
      },
      animate: {
        x: 0,
        opacity: 1,
        transition: {
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        },
      },
      exit: {
        x: direction > 0 ? '-100%' : '100%',
        opacity: 0,
        transition: {
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        },
      },
    };
  };

  const animationProps = getAnimationProps();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                  index < currentStepIndex
                    ? 'bg-primary text-text-primary'
                    : index === currentStepIndex
                      ? 'bg-primary text-text-primary ring-4 ring-primary/20'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  index <= currentStepIndex ? 'text-primary' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content with Animation */}
      <Card className="p-6 mb-4 overflow-hidden shadow-dreamy">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={animationProps.initial}
            animate={animationProps.animate}
            exit={animationProps.exit}
            className="w-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          className={`${currentStepIndex === 0 ? 'invisible' : ''}`}
        >
          Back
        </Button>

        {currentStep !== 'preview' && (
          <Button
            variant="primary"
            onClick={goToNextStep}
            disabled={
              (currentStep === 'theme' && !storyInput.theme) ||
              (currentStep === 'character' && !storyInput.childName) ||
              (currentStep === 'readingLevel' && !storyInput.readingLevel)
            }
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
