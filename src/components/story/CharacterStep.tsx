'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { StoryGender } from '@/types/story';
import {
  CHARACTER_TRAITS,
  CHARACTER_ARCHETYPES,
  StoryCharacter,
  userPersonalizationEngine,
} from '@/services/personalizationEngine';

interface CharacterStepProps {
  onComplete: (data: {
    childName: string;
    gender: string;
    interests: string;
    characterTraits?: string[];
    supportingCharacter?: StoryCharacter;
    mostLikedCharacterTypes: string[];
  }) => void;
  initialValues: {
    childName: string;
    gender: string;
    interests: string;
    characterTraits?: string[];
    supportingCharacter?: StoryCharacter;
  };
  theme?: string;
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

// Character types for supporting characters
const CHARACTER_TYPES = [
  { value: 'animal', label: '🐾 Animal' },
  { value: 'magical', label: '✨ Magical Creature' },
  { value: 'human', label: '👤 Human' },
  { value: 'robot', label: '🤖 Robot' },
  { value: 'other', label: '🌟 Other' },
];

export function CharacterStep({ onComplete, initialValues, theme }: CharacterStepProps) {
  const [characterData, setCharacterData] = useState({
    childName: initialValues.childName,
    gender: initialValues.gender,
    interests: initialValues.interests,
    characterTraits: initialValues.characterTraits || [],
    supportingCharacter: initialValues.supportingCharacter || {
      name: '',
      type: 'animal' as const,
      traits: [],
      role: '',
    },
  });

  const [selectedGender, setSelectedGender] = useState(
    GENDER_OPTIONS.find((option) => option.value === initialValues.gender) || GENDER_OPTIONS[2]
  );

  const [selectedCharacterType, setSelectedCharacterType] = useState(
    CHARACTER_TYPES.find((type) => type.value === characterData.supportingCharacter?.type) ||
      CHARACTER_TYPES[0]
  );

  const [availableTraits, setAvailableTraits] = useState<string[]>(CHARACTER_TRAITS.personality);
  const [availableRoles, setAvailableRoles] = useState<string[]>(CHARACTER_ARCHETYPES);

  // Generate suggested traits based on theme when component mounts or theme changes
  useEffect(() => {
    if (theme) {
      const suggestedTraits = userPersonalizationEngine.suggestCharacterTraits(theme as any);
      if (suggestedTraits.length > 0 && characterData.characterTraits.length === 0) {
        setCharacterData((prev) => ({
          ...prev,
          characterTraits: suggestedTraits,
        }));
      }
    }
  }, [theme]);

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

  const handleTraitClick = (trait: string) => {
    const currentTraits = [...characterData.characterTraits];
    const newTraits = currentTraits.includes(trait)
      ? currentTraits.filter((t) => t !== trait)
      : [...currentTraits, trait];

    // Limit to 3 traits maximum
    const limitedTraits = newTraits.slice(0, 3);

    setCharacterData((prev) => ({
      ...prev,
      characterTraits: limitedTraits,
    }));
  };

  const handleSupportingCharacterTraitClick = (trait: string) => {
    const currentTraits = [...characterData.supportingCharacter.traits];
    const newTraits = currentTraits.includes(trait)
      ? currentTraits.filter((t) => t !== trait)
      : [...currentTraits, trait];

    // Limit to 2 traits maximum
    const limitedTraits = newTraits.slice(0, 2);

    setCharacterData((prev) => ({
      ...prev,
      supportingCharacter: {
        ...prev.supportingCharacter,
        traits: limitedTraits,
      },
    }));
  };

  const handleRoleClick = (role: string) => {
    setCharacterData((prev) => ({
      ...prev,
      supportingCharacter: {
        ...prev.supportingCharacter,
        role,
      },
    }));
  };

  const handleSubmit = () => {
    // Split interests into an array if it's a string
    const interestsArray =
      typeof characterData.interests === 'string'
        ? characterData.interests
            .split(',')
            .map((i) => i.trim())
            .filter(Boolean)
        : characterData.interests;

    onComplete({
      childName: characterData.childName,
      gender: selectedGender.value,
      interests: characterData.interests,
      // Add mostLikedCharacterTypes based on interests
      mostLikedCharacterTypes: interestsArray,
      characterTraits: characterData.characterTraits,
      supportingCharacter: {
        ...characterData.supportingCharacter,
        type: selectedCharacterType.value as any,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-midnight dark:text-text-primary">
          Create Your Characters
        </h2>
        <p className="mt-2 text-sm text-text-secondary dark:text-text-primary/80">
          Tell us about who will be in the story
        </p>
      </div>

      <div className="space-y-4">
        {/* Main Character Section */}
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-midnight dark:text-text-primary">
            Main Character
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary dark:text-text-primary/80">
                Character Name
              </label>
              <Input
                type="text"
                placeholder="Enter name"
                value={characterData.childName}
                onChange={(e) =>
                  setCharacterData((prev) => ({ ...prev, childName: e.target.value }))
                }
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
                Character Traits (Select up to 3)
              </label>
              <div className="flex flex-wrap gap-2">
                {CHARACTER_TRAITS.personality.slice(0, 12).map((trait) => (
                  <button
                    key={trait}
                    onClick={() => handleTraitClick(trait)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      characterData.characterTraits.includes(trait)
                        ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-text-primary hover:bg-primary/30 dark:hover:bg-primary/40'
                        : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-primary/80 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {trait}
                  </button>
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
          </div>
        </div>

        {/* Supporting Character Section */}
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-midnight dark:text-text-primary">
            Supporting Character
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary dark:text-text-primary/80">
                Character Type
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {CHARACTER_TYPES.map((type) => (
                  <div
                    key={type.value}
                    className={`p-2 border rounded-lg text-center cursor-pointer transition-colors ${
                      selectedCharacterType.value === type.value
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-midnight/30'
                    }`}
                    onClick={() => {
                      setSelectedCharacterType(type);
                      setCharacterData((prev) => ({
                        ...prev,
                        supportingCharacter: {
                          ...prev.supportingCharacter,
                          type: type.value as any,
                        },
                      }));
                    }}
                  >
                    <span className="block text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary dark:text-text-primary/80">
                Character Name (Optional)
              </label>
              <Input
                type="text"
                placeholder="Enter name (or leave blank)"
                value={characterData.supportingCharacter.name}
                onChange={(e) =>
                  setCharacterData((prev) => ({
                    ...prev,
                    supportingCharacter: {
                      ...prev.supportingCharacter,
                      name: e.target.value,
                    },
                  }))
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary dark:text-text-primary/80">
                Character Traits (Select up to 2)
              </label>
              <div className="flex flex-wrap gap-2">
                {CHARACTER_TRAITS.personality.slice(0, 10).map((trait) => (
                  <button
                    key={trait}
                    onClick={() => handleSupportingCharacterTraitClick(trait)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      characterData.supportingCharacter.traits.includes(trait)
                        ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-text-primary hover:bg-primary/30 dark:hover:bg-primary/40'
                        : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-primary/80 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary dark:text-text-primary/80">
                Character Role
              </label>
              <div className="flex flex-wrap gap-2">
                {CHARACTER_ARCHETYPES.slice(0, 8).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleClick(role)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      characterData.supportingCharacter.role === role
                        ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-text-primary hover:bg-primary/30 dark:hover:bg-primary/40'
                        : 'bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-primary/80 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
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
