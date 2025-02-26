'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';
import {
  ANALYTICS_SCRIPT_PATH,
  NON_CRITICAL_SCRIPT_PATH,
  CRITICAL_SCRIPT_PATH,
  THEME_SCRIPT_PATH,
} from '../constants/scriptPaths';

// Add type definition for requestIdleCallback
declare global {
  interface Window {
    requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  }
}

const shouldLoadProductionScripts = () => process.env.NODE_ENV === 'production';

interface ScriptOptimizerProps {
  /**
   * Whether to load analytics scripts
   */
  loadAnalytics?: boolean;

  /**
   * Whether to load non-critical scripts
   */
  loadNonCritical?: boolean;
}

/**
 * ScriptOptimizer component that optimizes the loading of third-party scripts
 * - Loads analytics scripts only when needed
 * - Defers non-critical scripts
 * - Uses appropriate loading strategies for different script types
 */
export function ScriptOptimizer({
  loadAnalytics = true,
  loadNonCritical = true,
}: ScriptOptimizerProps) {
  const analyticsRef = useRef<HTMLDivElement>(null);
  const nonCriticalRef = useRef<HTMLDivElement>(null);

  // Load analytics scripts when they come into view
  useEffect(() => {
    if (!loadAnalytics) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When analytics container is visible, load analytics scripts
            const analyticsContainer = document.getElementById('analytics-scripts');
            if (analyticsContainer) {
              analyticsContainer.dataset.loaded = 'true';
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (analyticsRef.current) {
      observer.observe(analyticsRef.current);
    }

    return () => {
      if (analyticsRef.current) {
        observer.unobserve(analyticsRef.current);
      }
    };
  }, [loadAnalytics]);

  // Load non-critical scripts when they come into view
  useEffect(() => {
    if (!loadNonCritical) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When non-critical container is visible, load non-critical scripts
            const nonCriticalContainer = document.getElementById('non-critical-scripts');
            if (nonCriticalContainer) {
              nonCriticalContainer.dataset.loaded = 'true';
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (nonCriticalRef.current) {
      observer.observe(nonCriticalRef.current);
    }

    return () => {
      if (nonCriticalRef.current) {
        observer.unobserve(nonCriticalRef.current);
      }
    };
  }, [loadNonCritical]);

  return (
    <>
      {/* These are placeholder scripts that will be replaced in production */}
      {shouldLoadProductionScripts() && (
        <>
          <Script id="critical-script" strategy="beforeInteractive" src={CRITICAL_SCRIPT_PATH} />
          <Script id="theme-script" strategy="afterInteractive" src={THEME_SCRIPT_PATH} />
        </>
      )}
      <div ref={analyticsRef} id="analytics-scripts" data-loaded="false">
        {loadAnalytics && (
          <>
            <Script
              id="google-analytics"
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script
              id="analytics-config"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </div>
      <div ref={nonCriticalRef} id="non-critical-scripts" data-loaded="false">
        {loadNonCritical && (
          <>
            <Script id="social-share" strategy="lazyOnload" src="/scripts/social-share.js" />
            <Script id="feedback-widget" strategy="lazyOnload" src="/scripts/feedback.js" />
          </>
        )}
      </div>
    </>
  );
}

export default ScriptOptimizer;
