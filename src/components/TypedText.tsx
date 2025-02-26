'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Utility function to create typing animation elements
export interface TypedTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  speed?: number;
}

export const TypedText = ({
  text,
  delay = 0,
  className = '',
  onComplete,
  speed = 30,
}: TypedTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Cleanup function to clear all timers and animation frames
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Set visibility after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    timersRef.current.push(timer);

    return clearAllTimers;
  }, [delay, clearAllTimers]);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // For better performance, we'll use a simpler approach
    // that doesn't create as many DOM elements
    const textNode = document.createElement('span');
    textNode.className = 'typed-text-content';
    container.appendChild(textNode);

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    cursor.style.animation = 'blink 1s step-end infinite';
    container.appendChild(cursor);

    // Add CSS for cursor blinking only, remove the text color styling
    if (!document.getElementById('cursor-style')) {
      const style = document.createElement('style');
      style.id = 'cursor-style';
      style.textContent = `
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    let charIndex = 0;
    const totalChars = text.length;

    const typeNextChar = () => {
      if (charIndex < totalChars) {
        // Add next character
        textNode.textContent = text.substring(0, charIndex + 1);
        charIndex++;

        // Schedule next character with variable timing for natural feel
        const nextCharDelay = speed + Math.random() * 10;
        const timer = setTimeout(() => {
          animationFrameRef.current = requestAnimationFrame(typeNextChar);
        }, nextCharDelay);

        timersRef.current.push(timer);
      } else {
        // Animation complete
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    // Start typing
    animationFrameRef.current = requestAnimationFrame(typeNextChar);

    return clearAllTimers;
  }, [isVisible, text, onComplete, clearAllTimers, speed]);

  return <div ref={containerRef} className={`typing-animation ${className}`}></div>;
};
