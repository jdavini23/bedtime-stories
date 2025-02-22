'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create Your Character</h2>
        <p className="mt-2 text-sm text-gray-600">Tell us about who the story is for</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Character Name"
          value={characterData.childName}
          onChange={(e) => setCharacterData((prev) => ({ ...prev, childName: e.target.value }))}
          placeholder="Enter name"
          required
        />

        <Select
          label="Character Gender"
          options={GENDER_OPTIONS}
          value={selectedGender}
          onChange={(option) => setSelectedGender(option)}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Interests (Select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestClick(interest)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  characterData.interests.includes(interest)
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!characterData.childName.trim()}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
