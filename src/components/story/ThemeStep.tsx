'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { StoryTheme } from '@/types/story';

interface ThemeStepProps {
  onComplete: (theme: string) => void;
  initialValue?: string;
}

const THEME_OPTIONS = [
  {
    value: 'adventure',
    label: '🌟 Adventure',
    description: 'Exciting journeys and thrilling quests',
  },
  { value: 'fantasy', label: '🦄 Fantasy', description: 'Magical worlds and mythical creatures' },
  {
    value: 'educational',
    label: '📚 Educational',
    description: 'Learning through fun and engaging stories',
  },
  {
    value: 'friendship',
    label: '🤝 Friendship',
    description: 'Heartwarming tales of companionship',
  },
  {
    value: 'courage',
    label: '🦁 Courage',
    description: 'Stories about bravery and overcoming fears',
  },
  { value: 'kindness', label: '💝 Kindness', description: 'Acts of compassion and generosity' },
  {
    value: 'curiosity',
    label: '🔍 Curiosity',
    description: 'Exploring the unknown and asking questions',
  },
  {
    value: 'creativity',
    label: '🎨 Creativity',
    description: 'Imaginative and artistic storytelling',
  },
  {
    value: 'nature',
    label: '🌿 Nature',
    description: 'Stories about the environment and wildlife',
  },
  { value: 'science', label: '🔬 Science', description: 'Discoveries and scientific adventures' },
];

export function ThemeStep({ onComplete, initialValue = '' }: ThemeStepProps) {
  const [selectedTheme, setSelectedTheme] = useState(
    THEME_OPTIONS.find((theme) => theme.value === initialValue) || THEME_OPTIONS[0]
  );

  const handleRandomTheme = () => {
    const randomTheme = THEME_OPTIONS[Math.floor(Math.random() * THEME_OPTIONS.length)];
    setSelectedTheme(randomTheme);
    onComplete(randomTheme.value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-midnight dark:text-text-primary">Choose a Theme</h2>
        <p className="mt-2 text-sm text-text-secondary dark:text-text-primary/80">
          Select a theme for your story's adventure
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEME_OPTIONS.map((theme, index) => (
            <div
              key={theme.value}
              className={`p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-midnight/30 transition-colors cursor-pointer relative group ${
                selectedTheme.value === theme.value
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => {
                setSelectedTheme(theme);
                onComplete(theme.value);
              }}
              onTouchStart={() => setSelectedTheme(theme)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl font-medium text-midnight dark:text-text-primary">
                  {theme.label}
                </span>
              </div>
              <div
                className={`absolute z-10 transform ${
                  index % 2 === 0 ? 'right-full translate-x-0' : 'left-full -translate-x-0'
                } top-1/2 -translate-y-1/2 ml-2 mr-2 px-3 py-2 bg-white dark:bg-midnight border rounded-lg shadow-md text-sm font-medium text-gray-800 dark:text-text-primary opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity whitespace-nowrap`}
              >
                {theme.description}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleRandomTheme} className="flex-1">
            <span className="inline-block animate-spin-slow mr-2">🎲</span> Random Theme
          </Button>
        </div>
      </div>
    </div>
  );
}
