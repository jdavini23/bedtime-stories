// Server Component - No 'use client' directive needed
import React from 'react';
import { DynamicFontLoader } from './DynamicFontLoader';

/**
 * PreloadResources component that preloads critical resources
 * - Preloads critical fonts
 * - Preloads critical images
 * - Preloads critical CSS
 */
export function PreloadResources() {
  return (
    <>
      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="/fonts/inter-var-latin.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Preload critical images */}
      <link rel="preload" href="/images/hero-bg.webp" as="image" />

      {/* Preload critical CSS */}
      <link rel="preload" href="/styles/critical.css" as="style" />

      {/* Load critical CSS */}
      <link rel="stylesheet" href="/styles/critical.css" />

      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

      {/* Preconnect to critical domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Load fonts with display swap to prevent FOUC */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Load fonts with font-display: swap */
            @font-face {
              font-family: 'Quicksand';
              font-style: normal;
              font-weight: 300 700;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/quicksand/v30/6xKtdSZaM9iE8KbpRA_hK1QN.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            
            @font-face {
              font-family: 'Poppins';
              font-style: normal;
              font-weight: 300 700;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
          `,
        }}
      />

      {/* Dynamic font loader component handles the Google Fonts stylesheet */}
      <DynamicFontLoader />
    </>
  );
}

export default PreloadResources;
