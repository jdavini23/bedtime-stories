'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { colorOpacityClasses, textOpacityClasses, borderOpacityClasses } from '@/utils/colors';
import { THEME_OPTIONS } from '../types';
import { StoryTheme } from '@/types/story';

interface WelcomeStepProps {
  onThemeSelect: (theme: StoryTheme) => void;
  selectedTheme?: StoryTheme;
  className?: string;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onThemeSelect, selectedTheme, className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className={cn('space-y-2', textOpacityClasses.primary.DEFAULT)}>
        <h2 className="text-2xl font-bold">Welcome to Story Creator!</h2>
        <p className={textOpacityClasses.primary.muted}>
          Let's create a magical story together. First, choose a theme for your adventure:
        </p>
      </div>

      <div className="space-y-3">
        {THEME_OPTIONS.map((theme) => (
          <button
            key={theme.value}
            onClick={() => onThemeSelect(theme.value)}
            className={cn(
              'w-full flex items-center space-x-3 h-auto py-4 px-5 text-left rounded-xl transition-all duration-200 group',
              'border',
              selectedTheme === theme.value
                ? cn(
                    colorOpacityClasses.overlay.primary,
                    borderOpacityClasses.primary.DEFAULT,
                    textOpacityClasses.primary.DEFAULT
                  )
                : cn(
                    colorOpacityClasses.subtle.primary,
                    borderOpacityClasses.primary.subtle,
                    textOpacityClasses.primary.muted
                  ),
              'hover:' + colorOpacityClasses.overlay.primary,
              'hover:' + borderOpacityClasses.primary.muted
            )}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {theme.emoji}
            </span>
            <div className="flex-1">
              <div className="font-semibold">{theme.label}</div>
              <div className={cn('text-sm', textOpacityClasses.primary.muted)}>
                {theme.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeStep;
