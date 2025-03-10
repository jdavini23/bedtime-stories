'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { useWizardState } from '../useWizardState';
import { COMMON_INTERESTS } from '../types';

export function InterestsStep() {
  const { selectedInterests, setSelectedInterests, handleInterestsSubmit } = useWizardState();
  const [customInterest, setCustomInterest] = React.useState('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest)) {
      setSelectedInterests([...selectedInterests, customInterest]);
      setCustomInterest('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {COMMON_INTERESTS.map((interest) => (
          <Button
            key={interest.value}
            onClick={() => toggleInterest(interest.value)}
            className={`
              flex items-center space-x-2 h-auto py-3 px-4 
              bg-sky-800/30 border border-sky-600/30
              hover:bg-sky-700/40 hover:border-sky-500/40 
              transition-all duration-200 text-white/90
              ${selectedInterests.includes(interest.value) ? 'bg-sky-700/50 border-sky-400/50' : ''}
            `}
          >
            <span className="text-xl">{interest.emoji}</span>
            <span>{interest.value}</span>
          </Button>
        ))}
      </div>

      <div className="bg-sky-900/50 rounded-lg p-4 space-y-4">
        <div className="text-white/80">Selected interests:</div>
        <div className="text-white/60">
          {selectedInterests.length === 0 ? (
            'No interests selected yet'
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <div key={interest} className="bg-sky-800/50 px-3 py-1 rounded-full">
                  {interest}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            placeholder="Add a custom interest..."
            className="flex-1 bg-sky-800/30 border border-sky-600/30 rounded-lg px-4 py-2 text-white/90 placeholder:text-white/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCustomInterest();
              }
            }}
          />
          <Button
            onClick={handleInterestsSubmit}
            disabled={selectedInterests.length === 0}
            className="bg-sky-600/50 hover:bg-sky-500/50 px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
