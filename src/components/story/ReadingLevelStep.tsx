'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Select } from '@/components/common/Select';

interface ReadingLevelStepProps {
  onComplete: (level: string) => void;
  initialValue?: string;
}

const READING_LEVEL_OPTIONS = [
  { value: 'beginner', label: '📖 Beginner (Ages 3-5)' },
  { value: 'intermediate', label: '📚 Intermediate (Ages 6-8)' },
  { value: 'advanced', label: '🎓 Advanced (Ages 9-12)' },
];

export function ReadingLevelStep({ onComplete, initialValue = 'intermediate' }: ReadingLevelStepProps) {
  const [selectedLevel, setSelectedLevel] = useState(
    READING_LEVEL_OPTIONS.find(level => level.value === initialValue) || READING_LEVEL_OPTIONS[1]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Select Reading Level</h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose the appropriate reading level for your story
        </p>
      </div>

      <div className="space-y-4">
        <Select
          label="Reading Level"
          options={READING_LEVEL_OPTIONS}
          value={selectedLevel}
          onChange={option => setSelectedLevel(option)}
        />

        <div className="p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Reading Level Guide
          </h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Beginner: Simple words, short sentences, lots of repetition</li>
            <li>• Intermediate: Varied vocabulary, longer sentences, basic plot</li>
            <li>• Advanced: Rich vocabulary, complex sentences, detailed storylines</li>
          </ul>
        </div>

        <button
          onClick={() => onComplete(selectedLevel.value)}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}