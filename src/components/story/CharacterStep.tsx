'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { StoryGender } from '@/types/story';

interface CharacterStepProps {
  onComplete: (data: { childName: string; gender: string; interests: string }) => void;
  initialValues: {
    childName: string;
    gender: string;
    interests: string;
  };
}

const GENDER_OPTIONS = [
  { value: 'boy', label: '👦 Boy' },
  { value: 'girl', label: '👧 Girl' },
  { value: 'neutral', label: '🌟 Other' },
];

const COMMON_INTERESTS = [
  'Dinosaurs',
  'Space',
  'Superheroes',
  'Unicorns',
  'Pirates',
  'Princesses',
  'Animals',
  'Magic',
  'Adventure',
  'Science',
  'Robots',
  'Dragons',
  'Nature',
  'Music',
  'Art',
  'Sports',
];

export function CharacterStep({ onComplete, initialValues }: CharacterStepProps) {
  const [characterData, setCharacterData] = useState({
    childName: initialValues.childName,
    gender: initialValues.gender,
    interests: initialValues.interests,
  });

  const [selectedGender, setSelectedGender] = useState(
    GENDER_OPTIONS.find((option) => option.value === initialValues.gender) || GENDER_OPTIONS[2]
  );

  const handleInterestClick = (interest: string) => {
    const currentInterests = characterData.interests
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    setCharacterData((prev) => ({
      ...prev,
      interests: newInterests.join(', '),
    }));
  };

  const handleSubmit = () => {
    onComplete({
      childName: characterData.childName,
      gender: selectedGender.value,
      interests: characterData.interests,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-midnight dark:text-text-primary">Create Your Character</h2>
        <p className="mt-2 text-sm text-text-secondary dark:text-text-primary/80">Tell us about who the story is for</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary dark:text-text-primary/80">
            Character Name
          </label>
          <Input
            type="text"
            placeholder="Enter name"
            value={characterData.childName}
            onChange={(e) => setCharacterData((prev) => ({ ...prev, childName: e.target.value }))}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary dark:text-text-primary/80">
            Character Gender
          </label>
          <div className="grid grid-cols-3 gap-3">
            {GENDER_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                  selectedGender.value === option.value
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-midnight/30'
                }`}
                onClick={() => {
                  setSelectedGender(option);
                  setCharacterData((prev) => ({ ...prev, gender: option.value }));
                }}
              >
                <span className="block text-lg">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary dark:text-text-primary/80">
            Interests (Select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestClick(interest)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  characterData.interests.includes(interest)
                    ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-text-primary hover:bg-primary/30 dark:hover:bg-primary/40'
                    : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-primary/80 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={!characterData.childName.trim()}
            className="w-full px-4 py-2 text-sm font-medium text-text-primary bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
