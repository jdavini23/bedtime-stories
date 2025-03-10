'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction?: 'left' | 'right';
}

export function StepTransition({ children, isVisible, direction = 'right' }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: direction === 'right' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'right' ? -20 : 20 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
