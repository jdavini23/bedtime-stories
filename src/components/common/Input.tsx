'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-2">
        {label && (
          <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          suppressHydrationWarning
          className={cn(
            'w-full px-3 py-2 border rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'text-gray-900 placeholder-gray-500',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export default Input;
