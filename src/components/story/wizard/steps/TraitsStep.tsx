'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useWizardState } from '../useWizardState';
import { CHARACTER_TRAITS } from '@/services/personalization';

type CategoryType = 'personality' | 'appearance' | 'skills';

export function TraitsStep() {
  const { selectedTraits, setSelectedTraits, handleTraitsSubmit } = useWizardState();
  const [customTrait, setCustomTrait] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<CategoryType>('personality');
  const [searchQuery, setSearchQuery] = React.useState('');

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const handleAddCustomTrait = () => {
    if (customTrait.trim() && !selectedTraits.includes(customTrait)) {
      setSelectedTraits([...selectedTraits, customTrait]);
      setCustomTrait('');
    }
  };

  const categories: Record<CategoryType, string> = {
    personality: '😊 Personality',
    appearance: '👤 Appearance',
    skills: '🎯 Skills',
  };

  const filteredTraits = CHARACTER_TRAITS[activeCategory].filter((trait) =>
    trait.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex space-x-2 mb-4">
        {(Object.entries(categories) as [CategoryType, string][]).map(([category, label]) => (
          <Button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              py-2 px-4 rounded-lg text-sm
              ${
                activeCategory === category
                  ? 'bg-sky-600/50 text-white'
                  : 'bg-sky-800/30 text-white/70 hover:bg-sky-700/40'
              }
            `}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search traits..."
        className="w-full bg-sky-800/30 border border-sky-600/30 rounded-lg px-4 py-2 text-white/90 placeholder:text-white/50 mb-4"
      />

      {/* Traits Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
        {filteredTraits.map((trait) => (
          <Button
            key={trait}
            onClick={() => toggleTrait(trait)}
            className={`
              flex items-center space-x-2 h-auto py-2 px-3
              bg-sky-800/30 border border-sky-600/30
              hover:bg-sky-700/40 hover:border-sky-500/40 
              transition-all duration-200 text-white/90 text-sm
              ${selectedTraits.includes(trait) ? 'bg-sky-700/50 border-sky-400/50' : ''}
            `}
          >
            <span>{trait}</span>
          </Button>
        ))}
      </div>

      <div className="bg-sky-900/50 rounded-lg p-4 space-y-4 mt-4">
        <div className="text-white/80">Selected traits:</div>
        <div className="text-white/60">
          {selectedTraits.length === 0 ? (
            'No traits selected yet'
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedTraits.map((trait) => (
                <div
                  key={trait}
                  className="bg-sky-800/50 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  onClick={() => toggleTrait(trait)}
                  role="button"
                  tabIndex={0}
                >
                  {trait}
                  <span className="opacity-60 hover:opacity-100">×</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customTrait}
            onChange={(e) => setCustomTrait(e.target.value)}
            placeholder="Add a custom trait..."
            className="flex-1 bg-sky-800/30 border border-sky-600/30 rounded-lg px-4 py-2 text-white/90 placeholder:text-white/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCustomTrait();
              }
            }}
          />
          <Button
            onClick={handleTraitsSubmit}
            disabled={selectedTraits.length === 0}
            className="bg-sky-600/50 hover:bg-sky-500/50 px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
