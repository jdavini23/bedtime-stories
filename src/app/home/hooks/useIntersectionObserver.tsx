'use client';

import { useState, useEffect, useRef } from 'react';

interface IntersectionObserverOptions extends IntersectionObserverInit {
  // Add any additional options here if needed
}

/**
 * Custom hook for detecting when an element intersects with the viewport
 * @param options IntersectionObserver options
 * @returns Object containing ref to be attached to the target element and isIntersecting state
 */
export function useIntersectionObserver(options: IntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isIntersecting };
}
