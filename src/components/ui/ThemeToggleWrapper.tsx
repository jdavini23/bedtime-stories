'use client';

import { ThemeToggle } from '@/components/ThemeProvider';

interface ThemeToggleWrapperProps {
  className?: string;
}

export function ThemeToggleWrapper({ className }: ThemeToggleWrapperProps) {
  return <ThemeToggle className={className} />;
}

export default ThemeToggleWrapper;
