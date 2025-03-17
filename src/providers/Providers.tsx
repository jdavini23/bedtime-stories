'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { SupabaseAuthProvider } from './SupabaseAuthProvider';

export interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SupabaseAuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </SupabaseAuthProvider>
  );
}
