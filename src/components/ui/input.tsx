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
          <label htmlFor={props.id} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          suppressHydrationWarning
          className={cn(
            'w-full px-3 py-2 rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            'text-foreground placeholder-muted-foreground',
            'bg-secondary border-input',
            error ? 'border-destructive' : 'border',
            className
          )}
        />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export default Input;
