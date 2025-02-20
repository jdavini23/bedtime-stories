import React from 'react';
import { cn } from '@/utils/cn';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  className, 
  size = 'md', 
  color = 'text-blue-500' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-4 border-t-transparent',
        sizeClasses[size],
        color,
        className
      )}
    />
  );
};

export default Spinner;
