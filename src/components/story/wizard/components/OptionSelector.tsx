'use client';

import React from 'react';
import { Button } from '@/components/common/Button';

interface Option {
  value: string;
  label: string;
  emoji?: string;
  description?: string;
}

interface OptionSelectorProps {
  options: Option[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  multiple?: boolean;
  columns?: 1 | 2;
  disabled?: boolean;
}

export function OptionSelector({
  options,
  selectedValues,
  onSelect,
  multiple = false,
  columns = 2,
  disabled = false,
}: OptionSelectorProps) {
  const handleSelect = (value: string) => {
    if (disabled) return;
    onSelect(value);
  };

  return (
    <div className={`grid grid-cols-${columns} gap-2`}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selectedValues.includes(option.value) ? 'primary' : 'outline'}
          onClick={() => handleSelect(option.value)}
          disabled={disabled}
          className="flex items-center justify-start space-x-2 h-auto py-3 px-4 text-left border-sky/20 hover:bg-sky/10 hover:border-sky/40 transition-colors text-cloud"
          role="option"
          aria-selected={selectedValues.includes(option.value)}
        >
          {option.emoji && <span className="text-xl">{option.emoji}</span>}
          <div>
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div className="text-xs text-cloud/60">{option.description}</div>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}
