'use client';

import { Button } from '@/components/common/Button';
import { useTheme } from '@/hooks/useTheme';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { themes } from '@/config/theme';
import type { Theme } from '@/config/theme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

const themeIcons = {
  light: FiSun,
  dark: FiMoon,
  system: FiMonitor,
} as const;

const themeLabels = {
  light: 'Light Mode',
  dark: 'Dark Mode',
  system: 'System Theme',
} as const;

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn('w-9 h-9', className)}
        aria-label="Toggle theme"
      >
        <FiSun className="h-4 w-4 rotate-0 scale-100 transition-all" />
      </Button>
    );
  }

  const Icon = themeIcons[theme as Theme] || themeIcons.system;
  const label = themeLabels[theme as Theme] || themeLabels.system;

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme as Theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('w-9 h-9', className)}
      onClick={cycleTheme}
      aria-label={label}
    >
      <Icon className="h-4 w-4 rotate-0 scale-100 transition-all" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export default ThemeToggle;
