'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryInput, StoryTheme, ReadingLevel } from '@/types/story';
import { ThemeStep } from './ThemeStep';
import { CharacterStep } from './CharacterStep';
import { ReadingLevelStep } from './ReadingLevelStep';
import { PreviewStep } from './PreviewStep';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/ui/card';

interface StoryWizardProps {
  onComplete: (input: StoryInput) => Promise<void>;
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
  const [storyInput, setStoryInput] = useState<StoryInput>({
    theme: '',
    childName: '',
    childAge: 6,
    characters: ['adventurous child'],
    setting: 'a magical world',
    length: 'medium',
    readingLevel: 'intermediate',
  });

  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);

  const handleStepComplete = (stepData: Partial<StoryInput>) => {
    setStoryInput((prev) => {
      const newInput = { ...prev, ...stepData };

      // Ensure theme-based setting is set when theme changes
      if (stepData.theme && !stepData.setting) {
        newInput.setting = `a world of ${stepData.theme}`;
      }

      // Ensure we always have at least one character
      if (!newInput.characters || newInput.characters.length === 0) {
        newInput.characters = ['adventurous child'];
      }

      return newInput;
    });
    goToNextStep();
  };

  const goToNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    } else if (isValidStoryInput(storyInput)) {
      onComplete(storyInput);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const isValidStoryInput = (input: Partial<StoryInput>): input is StoryInput => {
    const requiredFields = [
      'theme',
      'childName',
      'childAge',
      'characters',
      'setting',
      'length',
      'readingLevel',
    ];

    const missingFields = requiredFields.filter((field) => !input[field as keyof typeof input]);

    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields);
      return false;
    }

    if (!Array.isArray(input.characters) || input.characters.length === 0) {
      console.warn('Characters must be a non-empty array');
      return false;
    }

    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'theme':
        return (
          <ThemeStep
            selectedTheme={storyInput.theme as StoryTheme}
            onThemeSelect={(theme) => handleStepComplete({ theme })}
            onNext={goToNextStep}
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
                characterTraits = [],
                supportingCharacter,
                mostLikedCharacterTypes = [],
              } = characterData;

              // Build character list
              const characters = [];

              // Add main character with traits
              if (characterTraits.length > 0) {
                characters.push(
                  `${gender === 'neutral' ? 'child' : gender} with traits: ${characterTraits.join(', ')}`
                );
              } else {
                characters.push(gender === 'neutral' ? 'child' : gender);
              }

              // Add supporting character if provided
              if (supportingCharacter?.name && supportingCharacter?.type) {
                characters.push(
                  `${supportingCharacter.name} the ${supportingCharacter.type}${
                    supportingCharacter.traits?.length
                      ? ` (${supportingCharacter.traits.join(', ')})`
                      : ''
                  }`
                );
              }

              // Add additional character types if selected
              if (mostLikedCharacterTypes.length > 0) {
                characters.push(...mostLikedCharacterTypes);
              }

              // Use interests as setting, or provide a default based on theme
              const setting = interests?.trim()
                ? interests.split(',')[0].trim()
                : storyInput.theme
                  ? `a world of ${storyInput.theme}`
                  : 'a magical world';

              handleStepComplete({
                childName: childName || storyInput.childName,
                childAge: storyInput.childAge,
                characters: characters.length > 0 ? characters : ['adventurous child'],
                setting,
              });
            }}
            initialValues={{
              childName: storyInput.childName || '',
              gender: 'neutral',
              interests: storyInput.setting || '',
              characterTraits: [],
            }}
            theme={storyInput.theme}
          />
        );
      case 'readingLevel':
        return (
          <ReadingLevelStep
            onComplete={(level, ageGroup) =>
              handleStepComplete({
                readingLevel: level as ReadingLevel,
                length: ageGroup === '3-5' ? 'short' : ageGroup === '9-12' ? 'long' : 'medium',
              })
            }
            initialValue={storyInput.readingLevel}
            initialAgeGroup={
              (storyInput.childAge ?? 6) <= 5
                ? '3-5'
                : (storyInput.childAge ?? 6) >= 9
                  ? '9-12'
                  : '6-8'
            }
          />
        );
      case 'preview':
        return (
          <PreviewStep
            storyInput={storyInput}
            onBack={goToPreviousStep}
            onSubmit={() => {
              if (isValidStoryInput(storyInput)) {
                onComplete(storyInput);
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
