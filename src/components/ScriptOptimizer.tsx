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

export function ScriptOptimizer() {
  const analyticsRef = useRef<HTMLDivElement>(null);
  const nonCriticalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const script = document.createElement('script');
            script.src =
              entry.target === analyticsRef.current
                ? ANALYTICS_SCRIPT_PATH
                : NON_CRITICAL_SCRIPT_PATH;
            script.async = true;
            document.body.appendChild(script);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px 0px', // Load scripts 200px before they enter the viewport
      }
    );

    if (analyticsRef.current) {
      observer.observe(analyticsRef.current);
    }
    if (nonCriticalRef.current) {
      observer.observe(nonCriticalRef.current);
    }

    return () => {
      if (analyticsRef.current) {
        observer.unobserve(analyticsRef.current);
      }
      if (nonCriticalRef.current) {
        observer.unobserve(nonCriticalRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* These are placeholder scripts that will be replaced in production */}
      {shouldLoadProductionScripts() && (
        <>
          <Script id="critical-script" strategy="beforeInteractive" src={CRITICAL_SCRIPT_PATH} />
          <Script id="theme-script" strategy="afterInteractive" src={THEME_SCRIPT_PATH} />
        </>
      )}
      <div ref={analyticsRef} />
      <div ref={nonCriticalRef} />
    </>
  );
}
