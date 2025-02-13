import { FC, useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { SelectOption } from '@/types/select';
import { StoryInput, StoryTheme, StoryGender } from '@/types/story';
import { motion, AnimatePresence } from 'framer-motion';

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
  { value: 'neutral', label: 'Neutral' }
];

// Common interests for auto-suggestions
const COMMON_INTERESTS = [
  'dinosaurs', 'space', 'animals', 'music', 'art',
  'sports', 'magic', 'robots', 'dragons', 'princesses',
  'superheroes', 'science', 'nature', 'cars', 'cooking'
];

interface StoryFormProps {
  onSubmit: (input: StoryInput) => void;
  isLoading?: boolean;
}

export const StoryForm: FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
  const [childName, setChildName] = useState('');
  const [interests, setInterests] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(THEME_OPTIONS[0]);
  const [selectedGender, setSelectedGender] = useState(GENDER_OPTIONS[2]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (interests.trim()) {
      const lastInterest = interests.split(',').pop()?.trim().toLowerCase() || '';
      if (lastInterest) {
        const filtered = COMMON_INTERESTS.filter(
          interest => interest.toLowerCase().startsWith(lastInterest)
        ).slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [interests]);

  const addSuggestion = (suggestion: string) => {
    const currentInterests = interests.split(',').slice(0, -1);
    setInterests([...currentInterests, suggestion].join(', '));
    setShowSuggestions(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!childName.trim()) {
      newErrors.childName = 'Child\'s name is required';
    }

    if (!interests.trim()) {
      newErrors.interests = 'At least one interest is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const interestsList = interests
      .split(',')
      .map(interest => interest.trim())
      .filter(Boolean);

    onSubmit({
      childName: childName.trim(),
      interests: interestsList,
      theme: selectedTheme.value as StoryTheme,
      gender: selectedGender.value as StoryGender,
    });
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Input
          label="Child's Name"
          placeholder="Enter child's name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          error={errors.childName}
          className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
        />
      </motion.div>

      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            label="Interests"
            placeholder="Enter interests (comma-separated)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            error={errors.interests}
            className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
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

      <div className="relative z-40">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Select
            label="Story Theme"
            options={THEME_OPTIONS}
            value={selectedTheme}
            onChange={setSelectedTheme}
            className="transition-all duration-200"
          />
        </motion.div>
      </div>

      <div className="relative z-30">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Select
            label="Child's Gender"
            options={GENDER_OPTIONS}
            value={selectedGender}
            onChange={setSelectedGender}
            className="transition-all duration-200"
          />
        </motion.div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative z-20"
      >
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Generating Story...
            </div>
          ) : (
            'Generate Story'
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};

StoryForm.displayName = 'StoryForm';
