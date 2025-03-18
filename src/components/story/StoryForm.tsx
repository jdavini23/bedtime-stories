'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { StoryInput } from '@/types/story';
import Select from '@/components/common/Select';

interface SelectOption {
  value: string;
  label: string;
}
import { Input } from '@/components/ui/Input';
import { logger } from '@/utils/logger';

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
  'Exploration',
  'Nature',
  'Cooking',
  'Sports',
  'Music',
  'Art',
  'Dancing',
  'Reading',
];

const THEME_OPTIONS: SelectOption[] = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'educational', label: 'Educational' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'courage', label: 'Courage' },
  { value: 'kindness', label: 'Kindness' },
  { value: 'curiosity', label: 'Curiosity' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'nature', label: 'Nature' },
  { value: 'science', label: 'Science' },
];

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'boy', label: 'Boy' },
  { value: 'girl', label: 'Girl' },
  { value: 'neutral', label: 'Other' },
];

interface StoryFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>, input: StoryInput) => Promise<void>;
  isLoading?: boolean;
}

function StoryForm({ onSubmit, isLoading = false }: StoryFormProps) {
  const [characterName, setCharacterName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEME_OPTIONS[0]);
  const [selectedGender, setSelectedGender] = useState(GENDER_OPTIONS[2]);
  const [interests, setInterests] = useState('');
  const [favoriteCharacters, setFavoriteCharacters] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-suggestion logic
  useEffect(() => {
    if (interests.trim()) {
      const interestArray = interests.split(',');
      const currentInput = interestArray[interestArray.length - 1].trim().toLowerCase();

      if (currentInput) {
        const filtered = COMMON_INTERESTS.filter(
          (interest) =>
            interest.toLowerCase().startsWith(currentInput) &&
            !interestArray
              .slice(0, -1)
              .map((i) => i.trim().toLowerCase())
              .includes(interest.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [interests]);

  const addSuggestion = (suggestion: string) => {
    const interestArray = interests
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);
    interestArray.pop(); // Remove the partial interest

    const newInterests =
      interestArray.length > 0
        ? [...interestArray, suggestion].join(', ') + ', '
        : suggestion + ', ';

    setInterests(newInterests);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!characterName.trim()) {
      newErrors.characterName = 'Character name is required';
    }

    if (!interests.trim()) {
      newErrors.interests = 'Interests are required';
    }

    if (!selectedTheme?.value) {
      newErrors.theme = 'Story theme is required';
    }

    if (!selectedGender?.value) {
      newErrors.gender = 'Character gender is required';
    }

    if (!favoriteCharacters.trim()) {
      newErrors.favoriteCharacters = 'At least one favorite character is recommended';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const interestsList = interests
      .split(',')
      .map((interest) => interest.trim())
      .filter(Boolean);

    try {
      await onSubmit(e, {
        childName: characterName.trim(),
        interests: interestsList,
        theme: selectedTheme.value as StoryInput['theme'],
        gender: selectedGender.value as StoryInput['gender'],
        mostLikedCharacterTypes: favoriteCharacters
          .split(',')
          .map((char) => char.trim())
          .filter(Boolean),
        favoriteCharacters: favoriteCharacters
          .split(',')
          .map((char) => char.trim())
          .filter(Boolean),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate story';
      setErrors({
        submit: errorMessage,
      });
      logger.error('Story generation error:', {
        error,
        formData: {
          characterName,
          interests,
          theme: selectedTheme.value,
          gender: selectedGender.value,
        },
      });
    }
  };

  return (
    <motion.div
      className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-dreamy p-8 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        role="form"
        aria-label="Story Generation Form"
      >
        <Input
          label="Child's Name"
          id="characterName"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          required
          error={errors.characterName}
          placeholder="Enter child's name"
          className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
        />

        <Input
          label="Interests"
          id="interests"
          ref={inputRef}
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          onFocus={() => {
            const lastInterest = interests.split(',').pop()?.trim() || '';
            if (lastInterest) {
              setShowSuggestions(true);
            }
          }}
          required
          error={errors.interests}
          placeholder="Enter interests (comma-separated)"
          className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
        />

        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700"
            role="listbox"
            aria-label="Interest Suggestions"
          >
            {suggestions.map((suggestion) => (
              <motion.button
                key={suggestion}
                type="button"
                whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}
                onClick={() => addSuggestion(suggestion)}
                className="w-full px-4 py-2 text-left text-white hover:text-violet-300 transition-colors"
                role="option"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}

        <div className="space-y-4">
          <Select
            label="Story Theme"
            id="theme"
            value={selectedTheme}
            onChange={setSelectedTheme}
            options={THEME_OPTIONS}
            error={errors.theme}
            className="bg-gray-800/50 border-gray-700 text-white"
          />

          <Select
            label="Character Gender"
            id="gender"
            value={selectedGender}
            onChange={setSelectedGender}
            options={GENDER_OPTIONS}
            error={errors.gender}
            className="bg-gray-800/50 border-gray-700 text-white"
          />

          <Input
            label="Favorite Characters"
            id="favoriteCharacters"
            value={favoriteCharacters}
            onChange={(e) => setFavoriteCharacters(e.target.value)}
            error={errors.favoriteCharacters}
            placeholder="Enter favorite characters (comma-separated)"
            className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {errors.submit && (
          <div className="text-red-400 text-sm mt-2" role="alert">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating Story...' : 'Generate Story'}
        </button>
      </form>
    </motion.div>
  );
}

export default StoryForm;
