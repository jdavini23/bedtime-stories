declare module 'framer-motion' {
  import * as React from 'react';

  export interface MotionProps {
    initial?: Record<string, unknown>;
    animate?: Record<string, unknown>;
    transition?: Record<string, unknown>;
    whileHover?: Record<string, unknown>;
    whileTap?: Record<string, unknown>;
  }

  type HTMLMotionComponents = {
    [K in keyof JSX.IntrinsicElements]: React.ForwardRefExoticComponent<
      MotionProps & JSX.IntrinsicElements[K]
    >;
  };

  export const motion: HTMLMotionComponents;
}
