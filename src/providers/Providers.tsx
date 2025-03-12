'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SupabaseAuthProvider } from './SupabaseAuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SupabaseAuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SupabaseAuthProvider>
  );
}
