'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { useWizardState } from '../useWizardState';
import { READING_LEVEL_OPTIONS } from '../types';

export function ReadingLevelStep() {
  const { handleReadingLevelSelect } = useWizardState();

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-start">
        <span className="text-amber-400 text-xl">✨</span>
        <div className="bg-[#1e3a4f] rounded-2xl p-4 max-w-[90%]">
          <h2 className="text-white text-lg font-medium">
            What reading level would you like for this story?
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {READING_LEVEL_OPTIONS.map((level) => (
          <button
            key={level.value}
            onClick={() => handleReadingLevelSelect(level.value)}
            className="w-full text-left bg-[#1e3a4f]/90 hover:bg-[#1e3a4f] border border-sky-500/20 hover:border-sky-400/30 rounded-xl p-4 transition-all duration-200"
          >
            <div className="space-y-1">
              <div className="text-white font-medium">{level.label}</div>
              <div className="text-sky-200/70 text-sm">{level.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
