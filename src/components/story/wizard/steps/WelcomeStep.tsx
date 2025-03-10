'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { useWizardState } from '../useWizardState';
import { THEME_OPTIONS } from '../types';
import { StoryTheme } from '@/types/story';

export function WelcomeStep() {
  const { handleThemeSelect, addMessage, messages } = useWizardState();

  useEffect(() => {
    // Only send welcome messages if there are no messages yet
    if (messages.length > 0) return;

    const welcomeTimeout = setTimeout(() => {
      addMessage({
        content:
          "Hi there! 👋\n\nI'm your story assistant, and I'll help you create a personalized bedtime story.\n\nLet's start by choosing a theme for your story.",
        sender: 'system',
        type: 'welcome',
      });
    }, 100);

    return () => clearTimeout(welcomeTimeout);
  }, [addMessage, messages.length]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {THEME_OPTIONS.map((theme) => (
          <Button
            key={theme.value}
            variant="outline"
            className="flex items-center space-x-3 h-auto py-4 px-5 text-left bg-sky-800/50 hover:bg-sky-700/50 border-sky-600/30 hover:border-sky-500/50 transition-all duration-200 rounded-xl group"
            onClick={() => handleThemeSelect(theme.value as StoryTheme)}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              {theme.emoji}
            </span>
            <div>
              <div className="font-semibold text-lg text-white">{theme.label}</div>
              <div className="text-sm text-sky-100/70">{theme.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
