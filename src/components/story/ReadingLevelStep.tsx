'use client';

import React, { useState } from 'react';
import { StoryMetadata } from '@/types/story';

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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-midnight dark:text-text-primary">Select Reading Level</h2>
        <p className="mt-2 text-sm text-text-secondary dark:text-text-primary/80">
          Choose the appropriate reading level for your story
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {READING_LEVEL_OPTIONS.map((level) => (
            <div
              key={level.value}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedLevel.value === level.value
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-midnight/30'
              }`}
              onClick={() => {
                setSelectedLevel(level);
                onComplete(level.value);
              }}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-midnight dark:text-text-primary">{level.label}</h3>
                  <p className="text-sm text-text-secondary dark:text-text-primary/80">
                    {level.value === 'beginner' && 'Simple words, short sentences, lots of repetition'}
                    {level.value === 'intermediate' && 'Varied vocabulary, longer sentences, basic plot'}
                    {level.value === 'advanced' && 'Rich vocabulary, complex sentences, detailed storylines'}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedLevel.value === level.value 
                    ? 'border-primary bg-primary' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedLevel.value === level.value && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white dark:bg-text-primary rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Reading Level Guide
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-2">
            <li>• Beginner: Simple words, short sentences, lots of repetition</li>
            <li>• Intermediate: Varied vocabulary, longer sentences, basic plot</li>
            <li>• Advanced: Rich vocabulary, complex sentences, detailed storylines</li>
          </ul>
        </div>
      </div>
    </div>
  );
}