'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ClerkProvider } from '@clerk/nextjs';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  // Get the current origin for absolute URLs
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
      }}
      signInUrl={`${origin}/sign-in`}
      signUpUrl={`${origin}/sign-up`}
      afterSignInUrl={`${origin}/dashboard`}
      afterSignUpUrl={`${origin}/dashboard`}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </ClerkProvider>
  );
}
