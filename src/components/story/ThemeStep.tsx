'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { StoryTheme } from '@/types/story';

interface ThemeStepProps {
  selectedTheme: StoryTheme;
  onThemeSelect: (theme: StoryTheme) => void;
  onNext: () => void;
}

const ThemeStep: React.FC<ThemeStepProps> = ({ selectedTheme, onThemeSelect, onNext }) => {
  const themes: { value: StoryTheme; label: string; description: string }[] = [
    {
      value: 'fantasy',
      label: 'Fantasy Adventure',
      description: 'Magical realms, mythical creatures, and epic quests',
    },
    {
      value: 'space',
      label: 'Space Exploration',
      description: 'Cosmic journeys, alien worlds, and interstellar discoveries',
    },
    {
      value: 'nature',
      label: 'Nature Discovery',
      description: 'Wildlife adventures, forest mysteries, and natural wonders',
    },
    {
      value: 'underwater',
      label: 'Ocean Adventure',
      description: 'Deep-sea exploration, marine life, and underwater mysteries',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => (
          <motion.div
            key={theme.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer rounded-lg p-4 transition-colors ${
              selectedTheme === theme.value
                ? 'bg-primary/10 dark:bg-primary/20 border-2 border-primary'
                : 'bg-white/50 dark:bg-midnight-light/50 hover:bg-primary/5 dark:hover:bg-primary/10 border-2 border-transparent'
            }`}
            onClick={() => onThemeSelect(theme.value)}
          >
            <h3 className="text-lg font-semibold text-primary mb-2">{theme.label}</h3>
            <p className="text-text-secondary dark:text-text-primary/80">{theme.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedTheme}>
          Next
        </Button>
      </div>
    </div>
  );
};

export { ThemeStep };
export default ThemeStep;
