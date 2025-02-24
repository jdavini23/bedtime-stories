import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const inputVariants = cva(
  // Base styles
  'w-full rounded-xl px-4 py-3 transition-all duration-300 font-medium placeholder:text-text-muted focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-cloud-light border border-lavender focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-midnight-light dark:border-primary-light dark:text-text-primary',
        filled: 'bg-cloud border-2 border-transparent focus:bg-cloud-light focus:border-primary',
        outline: 'bg-transparent border-2 border-lavender focus:border-primary',
      },
      size: {
        sm: 'h-9 text-sm',
        md: 'h-11 text-base',
        lg: 'h-14 text-lg px-6',
      },
      error: {
        true: 'border-dreamy focus:ring-dreamy/50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ variant, size, error, className }),
            icon ? 'pl-12' : ''
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants }; 