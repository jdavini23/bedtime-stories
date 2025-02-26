'use client';

import React, { useEffect } from 'react';

export function PreloadResources() {
  useEffect(() => {
    // Preload critical images
    const imagesToPreload = [
      '/images/illustrations/book-magic.svg',
      '/images/illustrations/space-rocket.svg',
    ];

    imagesToPreload.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    });

    // Preload critical fonts if not already loaded by Next.js
    const fontsToPreload = [
      'https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap',
      'https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap',
    ];

    fontsToPreload.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // DNS prefetch for external resources
    const dnsPrefetch = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

    dnsPrefetch.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"][rel="dns-prefetch"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = href;
        document.head.appendChild(link);
      }
    });

    return () => {
      // Clean up preloaded resources when component unmounts
      // This is mostly for development to prevent duplicates during hot reloading
      document.querySelectorAll('link[rel="preload"][data-generated="true"]').forEach((el) => {
        el.remove();
      });
    };
  }, []);

  return null;
}
