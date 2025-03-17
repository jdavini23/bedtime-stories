'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

interface PlaceholderProps {
  width: number;
  height: number;
  text?: string;
  className?: string;
  useImage?: boolean;
}

export function Placeholder({
  width,
  height,
  text,
  className = '',
  useImage = false,
}: PlaceholderProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const aspectRatio = width / height;

  if (process.env.NODE_ENV !== 'production') {
    console.log('[Placeholder] Rendering with props:', {
      width,
      height,
      text,
      className,
      aspectRatio,
      useImage,
    });
  }

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Placeholder] Mounted with dimensions:', {
        calculatedWidth: `${width}px`,
        calculatedHeight: `${height}px`,
        aspectRatio,
      });

      if (elementRef.current) {
        const { clientWidth, clientHeight, offsetWidth, offsetHeight } = elementRef.current;
        console.log('[Placeholder] Actual rendered dimensions:', {
          clientWidth,
          clientHeight,
          offsetWidth,
          offsetHeight,
        });

        // Check for significant size mismatches
        const widthMismatch = Math.abs(clientWidth - width) > 1;
        const heightMismatch = Math.abs(clientHeight - height) > 1;

        if (widthMismatch || heightMismatch) {
          console.warn('[Placeholder] Size mismatch detected:', {
            expectedWidth: width,
            actualWidth: clientWidth,
            expectedHeight: height,
            actualHeight: clientHeight,
          });
        }
      }
    }
  }, [width, height, aspectRatio]);

  // Validate dimensions
  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid dimensions: width=${width}, height=${height}`);
  }

  if (useImage) {
    return (
      <div
        ref={elementRef}
        className={`relative overflow-hidden ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          aspectRatio,
        }}
      >
        <Image
          src={`/placeholder.svg?width=${width}&height=${height}${text ? `&text=${text}` : ''}`}
          alt={text || `Placeholder ${width}x${height}`}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      role="img"
      aria-label={text || `Placeholder ${width}x${height}`}
      className={`relative bg-gray-200 dark:bg-gray-800 overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        aspectRatio,
      }}
    >
      {text && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{text}</span>
        </div>
      )}
    </div>
  );
}
