'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { clerkConfig } from '@/config/clerk';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
      }}
      isSatellite={true}
      routerPush={(to) => {}}
      routerReplace={(to) => {}}
      domain="clerk.accounts.dev"
    >
      <ThemeProvider>{children}</ThemeProvider>
    </ClerkProvider>
  );
}
