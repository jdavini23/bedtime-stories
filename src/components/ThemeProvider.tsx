'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode, toggleDarkMode } = useStore();
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    if (theme === 'system') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
      darkModeMediaQuery.addEventListener('change', (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      });
    } else {
      setTheme(isDarkMode ? 'dark' : 'light');
    }
  }, [theme, isDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility component for theme toggle button
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { toggleDarkMode } = useStore();

  const handleToggle = () => {
    toggleDarkMode();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button onClick={handleToggle}>
      {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}
