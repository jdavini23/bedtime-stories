'use client';

import React, { useState, memo, FC, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryInput } from '@/types/story';
import { Select, SelectOption } from '@/components/common/Select';
import { Input } from '@/components/common/Input';

const COMMON_INTERESTS = [
  'Dinosaurs', 'Space', 'Superheroes', 'Unicorns', 'Pirates', 
  'Princesses', 'Animals', 'Magic', 'Adventure', 'Science', 
  'Robots', 'Dragons', 'Exploration', 'Nature', 'Cooking',
  'Sports', 'Music', 'Art', 'Dancing', 'Reading'
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
  { value: 'science', label: 'Science' }
];

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'boy', label: 'Boy' },
  { value: 'girl', label: 'Girl' },
  { value: 'neutral', label: 'Other' }
];

interface StoryFormProps {
  onSubmit: (input: StoryInput) => Promise<void>;
  isLoading?: boolean;
}

const StoryForm: FC<StoryFormProps> = memo(({ onSubmit, isLoading = false }) => {
  const [characterName, setCharacterName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEME_OPTIONS[0]);
  const [selectedGender, setSelectedGender] = useState(GENDER_OPTIONS[2]);
  const [interests, setInterests] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
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
        const filtered = COMMON_INTERESTS.filter(interest => 
          interest.toLowerCase().startsWith(currentInput) &&
          !interestArray.slice(0, -1).map(i => i.trim().toLowerCase()).includes(interest.toLowerCase())
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
    const interestArray = interests.split(',').map(i => i.trim()).filter(Boolean);
    interestArray.pop(); // Remove the partial interest
    
    const newInterests = interestArray.length > 0
      ? [...interestArray, suggestion].join(', ') + ', '
      : suggestion + ', ';
    
    setInterests(newInterests);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!characterName.trim()) {
      newErrors.characterName = 'Character name is required';
    }

    if (!interests.trim()) {
      newErrors.interests = 'Interests are required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const interestsList = interests
      .split(',')
      .map(interest => interest.trim())
      .filter(Boolean);

    await onSubmit({
      childName: characterName.trim(),
      interests: interestsList,
      theme: selectedTheme.value as StoryInput['theme'],
      gender: selectedGender.value as StoryInput['gender']
    });
  };

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Character Name"
          id="characterName"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          required
          error={errors.characterName}
          placeholder="Enter character name"
        />

        <div className="relative">
          <Input
            ref={inputRef}
            label="Interests"
            id="interests"
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
          />
          
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200"
              >
                {suggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    type="button"
                    whileHover={{ backgroundColor: '#EEF2FF' }}
                    onClick={() => addSuggestion(suggestion)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 first:rounded-t-md last:rounded-b-md transition-colors duration-150"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Story Theme
          </label>
          <Select
            options={THEME_OPTIONS}
            value={selectedTheme}
            onChange={setSelectedTheme}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Character Gender
          </label>
          <Select
            options={GENDER_OPTIONS}
            value={selectedGender}
            onChange={setSelectedGender}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isLoading 
              ? 'bg-purple-300 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
            }`}
        >
          {isLoading ? 'Generating Story...' : 'Generate Story'}
        </button>
      </form>
    </motion.div>
  );
});

StoryForm.displayName = 'StoryForm';
export { StoryForm };
export default StoryForm;
