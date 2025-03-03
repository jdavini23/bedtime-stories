import React from 'react';
import Script from 'next/script';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
// Import these after installing the packages
// import { SpeedInsights } from '@vercel/speed-insights/react';
// import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { Providers } from '@/providers/Providers';
import { ClerkProvider } from '@clerk/nextjs';
import { ErrorBoundary } from '@/components/error-boundaries/ErrorBoundary';
import { CriticalCSS } from '@/components/CriticalCSS';
import { PreloadResources } from '@/components/PreloadResources';
import { ScriptOptimizer } from '@/components/ScriptOptimizer';

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <head>
          <PreloadResources />
          <CriticalCSS />
          <Script id="critical-script" strategy="beforeInteractive" src="/scripts/critical.js" />
        </head>
        <body className={inter.className}>
          <ErrorBoundary
            fallback={
              <div className="p-4 text-red-500">Something went wrong. Please try again.</div>
            }
          >
            <Providers>
              {children}
              {/* <SpeedInsights />
              <Analytics /> */}
              <ScriptOptimizer />
            </Providers>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
