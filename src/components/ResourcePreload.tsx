'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface ResourcePreloadProps {
  resources: {
    href: string;
    as: 'script' | 'style' | 'image' | 'font' | 'fetch';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }[];
}

export function ResourcePreload({ resources }: ResourcePreloadProps) {
  // Preload resources when component mounts
  useEffect(() => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
      }
      if (resource.crossOrigin) {
        link.crossOrigin = resource.crossOrigin;
      }
      document.head.appendChild(link);

      // Clean up when component unmounts
      return () => {
        document.head.removeChild(link);
      };
    });
  }, [resources]);

  return (
    <Head>
      {resources.map((resource, index) => (
        <link
          key={`${resource.href}-${index}`}
          rel="preload"
          href={resource.href}
          as={resource.as}
          type={resource.type}
          crossOrigin={resource.crossOrigin}
        />
      ))}
    </Head>
  );
}
