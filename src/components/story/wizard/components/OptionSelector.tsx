'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { colorOpacityClasses, textOpacityClasses, borderOpacityClasses } from '@/utils/colors';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface OptionSelectorProps {
  options: Option[];
  selectedValue?: string;
  onChange: (value: string) => void;
  className?: string;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  selectedValue,
  onChange,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'w-full flex items-center justify-start space-x-2 h-auto py-3 px-4 text-left rounded-lg transition-colors',
            'border',
            selectedValue === option.value
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
          {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
          <div className="flex-1">
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div className={cn('text-sm', textOpacityClasses.primary.muted)}>
                {option.description}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default OptionSelector;
