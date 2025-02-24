import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const cardVariants = cva(
  // Base styles
  'rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-cloud shadow-dreamy dark:bg-midnight-dark dark:text-text-primary',
        outline: 'border-2 border-lavender bg-cloud/50 dark:bg-midnight-dark/50',
        magical: 'bg-gradient-to-br from-primary/10 to-dreamy/10 backdrop-blur-sm shadow-glow',
      },
      hover: {
        true: 'hover:shadow-glow hover:scale-[1.02] hover:-translate-y-1',
        false: '',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: false,
      padding: 'md',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, padding, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant, hover, padding, className }))}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export { Card, cardVariants }; 