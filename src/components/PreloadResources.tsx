'use client';

import React from 'react';
import Head from 'next/head';

/**
 * PreloadResources component that preloads critical resources
 * - Preloads critical fonts
 * - Preloads critical images
 * - Preloads critical CSS
 */
export function PreloadResources() {
  return (
    <Head>
      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Preload critical images */}
      <link
        rel="preload"
        href="/images/illustrations/book-magic.svg"
        as="image"
        type="image/svg+xml"
      />

      {/* Preload critical CSS */}
      <link rel="preload" href="/styles/critical.css" as="style" />

      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

      {/* Preconnect to critical domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                    href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
                    rel="preconnect stylesheet"
                  />
    </Head>
  );
}

export default PreloadResources;
