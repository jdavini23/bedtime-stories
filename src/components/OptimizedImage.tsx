'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  sizes?: string;
  fill?: boolean;
}

/**
 * OptimizedImage component that wraps Next.js Image with additional optimizations
 * - Adds blur-up loading effect
 * - Handles loading states
 * - Provides fallback for loading errors
 * - Optimizes quality settings
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  quality = 75, // Default quality setting
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  sizes,
  fill,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate a simple blur data URL if not provided
  const defaultBlurDataURL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  // Handle image load complete
  const handleImageLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Handle image load error
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Show loading state */}
      {isLoading && !priority && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}

      {/* Show error state */}
      {hasError ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
          <span>Image failed to load</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes={sizes}
          className={cn(
            'transition-opacity duration-300',
            isLoading && !priority ? 'opacity-0' : 'opacity-100'
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
