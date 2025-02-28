import React from 'react';
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <CriticalCSS />
        <PreloadResources />
      </head>
      <body className={inter.className}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          appearance={{
            baseTheme: undefined,
          }}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <Providers>
            <ErrorBoundary
              fallback={
                <div className="p-4 text-red-500">Something went wrong. Please try again.</div>
              }
            >
              {children}
              {/* <SpeedInsights />
              <Analytics /> */}
              <ScriptOptimizer />
            </ErrorBoundary>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
