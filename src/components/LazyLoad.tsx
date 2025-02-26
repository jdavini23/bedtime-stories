'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  placeholder?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyLoad({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '200px',
  className = '',
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can disconnect the observer
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, threshold, rootMargin]);

  // Set hasLoaded after a short delay once visible
  // This allows for a smooth transition
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <div ref={setElement} className={className}>
      {isVisible ? (
        <div
          className={`transition-opacity duration-500 ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {children}
        </div>
      ) : (
        placeholder || (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md h-32"></div>
        )
      )}
    </div>
  );
}
