'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ThemeStepProps {
  onComplete: (theme: string) => void;
  initialValue?: string;
}

const THEME_OPTIONS = [
  { value: 'adventure', label: '🌟 Adventure', description: 'Exciting journeys and thrilling quests' },
  { value: 'fantasy', label: '🦄 Fantasy', description: 'Magical worlds and mythical creatures' },
  { value: 'educational', label: '📚 Educational', description: 'Learning through fun and engaging stories' },
  { value: 'friendship', label: '🤝 Friendship', description: 'Heartwarming tales of companionship' },
  { value: 'courage', label: '🦁 Courage', description: 'Stories about bravery and overcoming fears' },
  { value: 'kindness', label: '💝 Kindness', description: 'Acts of compassion and generosity' },
  { value: 'curiosity', label: '🔍 Curiosity', description: 'Exploring the unknown and asking questions' },
  { value: 'creativity', label: '🎨 Creativity', description: 'Imaginative and artistic storytelling' },
  { value: 'nature', label: '🌿 Nature', description: 'Stories about the environment and wildlife' },
  { value: 'science', label: '🔬 Science', description: 'Discoveries and scientific adventures' },
];

export function ThemeStep({ onComplete, initialValue = '' }: ThemeStepProps) {
  const [selectedTheme, setSelectedTheme] = useState(
    THEME_OPTIONS.find(theme => theme.value === initialValue) || THEME_OPTIONS[0]
  );

  const handleRandomTheme = () => {
    const randomTheme = THEME_OPTIONS[Math.floor(Math.random() * THEME_OPTIONS.length)];
    setSelectedTheme(randomTheme);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Theme</h2>
        <p className="mt-2 text-sm text-gray-600">
          Select a theme for your story's adventure
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEME_OPTIONS.map((theme, index) => (
            <div
              key={theme.value}
              className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative group ${selectedTheme.value === theme.value ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedTheme(theme)}
              onTouchStart={() => setSelectedTheme(theme)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl font-medium text-gray-900">{theme.label}</span>
              </div>
              <div 
                className={`absolute z-10 transform ${index % 2 === 0 ? 'right-full translate-x-0' : 'left-full -translate-x-0'} top-1/2 -translate-y-1/2 ml-2 mr-2 px-3 py-2 bg-white border rounded-lg shadow-md text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity whitespace-nowrap`}
              >
                {theme.description}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleRandomTheme}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            🎲 Random Theme
          </button>
          <button
            onClick={() => onComplete(selectedTheme.value)}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}