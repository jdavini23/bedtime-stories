'use client';

import { useCallback } from 'react';
import { MotionProps } from 'framer-motion';

type AnimationVariant = {
  initial: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: MotionProps['transition'];
  };
  animate: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: MotionProps['transition'];
  };
};

/**
 * Hook containing animation variants and utility functions for the home page
 * @returns Object containing animation variants and utility functions
 */
export function useAnimations() {
  // Fade in animation variant
  const fadeInVariant: AnimationVariant = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // Slide in from left animation variant
  const slideInLeftVariant: AnimationVariant = {
    initial: { opacity: 0, x: -50 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Slide in from right animation variant
  const slideInRightVariant: AnimationVariant = {
    initial: { opacity: 0, x: 50 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Scale up animation variant
  const scaleUpVariant: AnimationVariant = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  // Stagger children animation utility
  const getStaggerContainerVariant = useCallback(
    (staggerDuration = 0.1): AnimationVariant => ({
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDuration,
        },
      },
    }),
    []
  );

  return {
    fadeInVariant,
    slideInLeftVariant,
    slideInRightVariant,
    scaleUpVariant,
    getStaggerContainerVariant,
  };
}
