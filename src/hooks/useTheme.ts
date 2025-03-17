'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import type { Theme } from '@/config/theme';

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useNextTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : undefined;
  const isDark = currentTheme === 'dark';

  return {
    theme: theme as Theme,
    setTheme,
    isDark,
    isLight: !isDark,
    currentTheme,
    mounted,
  };
}
