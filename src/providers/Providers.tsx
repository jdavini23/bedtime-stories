'use client';

import React from 'react';
import { FirebaseProvider } from '@/components/providers/FirebaseProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      {children}
    </FirebaseProvider>
  );
}
