'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

export function ScriptOptimizer() {
  useEffect(() => {
    // Add event listener for page load to load non-critical scripts
    const handleLoad = () => {
      // Load analytics or other non-critical scripts after page load
      const loadNonCriticalScripts = () => {
        // Example of dynamically loading a script
        const script = document.createElement('script');
        script.src = '/scripts/analytics.js';
        script.async = true;
        document.body.appendChild(script);
      };

      // Use requestIdleCallback for browsers that support it
      if ('requestIdleCallback' in window) {
        // @ts-ignore - TypeScript doesn't recognize requestIdleCallback
        window.requestIdleCallback(loadNonCriticalScripts, { timeout: 2000 });
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(loadNonCriticalScripts, 2000);
      }
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  return (
    <>
      {/* Load critical third-party scripts with next/script */}
      <Script id="critical-script" strategy="beforeInteractive" src="/scripts/critical.js" />

      {/* Load less critical scripts after page load */}
      <Script id="theme-script" strategy="afterInteractive" src="/scripts/theme.js" />

      {/* Load non-critical scripts when browser is idle */}
      <Script id="non-critical-script" strategy="lazyOnload" src="/scripts/non-critical.js" />
    </>
  );
}
