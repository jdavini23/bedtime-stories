import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  size?: 'default' | 'small' | 'large';
}

const sizes = {
  small: 'max-w-3xl',
  default: 'max-w-5xl',
  large: 'max-w-7xl',
};

export function Container({
  children,
  className,
  as: Component = 'div',
  size = 'default',
}: ContainerProps) {
  return (
    <Component className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8', sizes[size], className)}>
      {children}
    </Component>
  );
}
