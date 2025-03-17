import React from 'react';
import Script from 'next/script';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers/Providers';
import { ErrorBoundary } from '@/components/error-boundaries/ErrorBoundary';
import { CriticalCSS } from '@/components/optimization/CriticalCSS';
import { ResourcePreload } from '@/components/optimization/ResourcePreload';
import { ScriptOptimizer } from '@/components/optimization/ScriptOptimizer';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { themeClasses } from '@/config/theme';
import { cn } from '@/lib/utils';

// Import global styles after other imports
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: {
    default: 'Step Into Story Time',
    template: '%s | Step Into Story Time',
  },
  description: 'Interactive AI-powered bedtime stories for children',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <ResourcePreload
          resources={[
            {
              href: '/scripts/critical.js',
              as: 'script',
            },
            {
              href: '/fonts/inter.woff2',
              as: 'font',
              type: 'font/woff2',
              crossOrigin: 'anonymous',
            },
          ]}
        />
        <CriticalCSS />
        <Script id="critical-script" strategy="beforeInteractive" src="/scripts/critical.js" />
      </head>
      <body
        className={cn(
          inter.className,
          'min-h-screen antialiased',
          themeClasses.background,
          themeClasses.text
        )}
      >
        <SupabaseProvider>
          <ErrorBoundary
            fallback={
              <div className={cn('p-4 text-red-500', themeClasses.text)}>
                Something went wrong. Please try again.
              </div>
            }
          >
            <Providers>
              {children}
              <ScriptOptimizer />
              <Analytics />
              <SpeedInsights />
            </Providers>
          </ErrorBoundary>
        </SupabaseProvider>
      </body>
    </html>
  );
}
