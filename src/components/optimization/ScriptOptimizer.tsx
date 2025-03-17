'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import {
  ANALYTICS_SCRIPT_PATH,
  NON_CRITICAL_SCRIPT_PATH,
  CRITICAL_SCRIPT_PATH,
  THEME_SCRIPT_PATH,
  SOCIAL_SHARE_SCRIPT_PATH,
  FEEDBACK_WIDGET_SCRIPT_PATH,
} from '@/constants/scriptPaths';

function useIntersectionObserver(
  ref: React.RefObject<HTMLDivElement>,
  rootMargin: string,
  callback: () => void
) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, rootMargin, callback]);
}

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

  useIntersectionObserver(
    analyticsRef,
    '200px',
    useCallback(() => {
      if (!loadAnalytics) return;
      const analyticsContainer = document.querySelector<HTMLDivElement>('#analytics-scripts');
      if (analyticsContainer) {
        analyticsContainer.dataset.loaded = 'true';
      }
    }, [loadAnalytics])
  );

  useIntersectionObserver(
    nonCriticalRef,
    '200px',
    useCallback(() => {
      if (!loadNonCritical) return;
      const nonCriticalContainer = document.querySelector<HTMLDivElement>('#non-critical-scripts');
      if (nonCriticalContainer) {
        nonCriticalContainer.dataset.loaded = 'true';
      }
    }, [loadNonCritical])
  );

  return (
    <>
      {/* These are placeholder scripts that will be replaced in production */}
      {shouldLoadProductionScripts() && (
        <>
          <Script id="theme-script" strategy="afterInteractive" src={THEME_SCRIPT_PATH} />
        </>
      )}
      <div ref={analyticsRef} id="analytics-scripts" data-loaded="false">
        {loadAnalytics && process.env.NEXT_PUBLIC_GA_ID && (
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
            <Script id="social-share" strategy="lazyOnload" src={SOCIAL_SHARE_SCRIPT_PATH} />
            <Script id="feedback-widget" strategy="lazyOnload" src={FEEDBACK_WIDGET_SCRIPT_PATH} />
          </>
        )}
      </div>
    </>
  );
}

export default ScriptOptimizer;
