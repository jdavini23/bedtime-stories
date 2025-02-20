import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { Providers } from '@/providers/Providers';
import { ClerkProvider } from '@clerk/nextjs';
import { ErrorBoundary } from '@/components/error-boundaries/ErrorBoundary';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const dynamic = 'force-static';

export const metadata: Metadata | null = {
  title: 'Bedtime Stories',
  description: 'Personalized bedtime stories for children',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider
          appearance={{
            baseTheme: undefined,
          }}
        >
          <Providers>
            <ErrorBoundary
              fallback={
                <div className="p-4 text-red-500">Something went wrong. Please try again.</div>
              }
            >
              {children}
              <SpeedInsights />
              <Analytics />
            </ErrorBoundary>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
