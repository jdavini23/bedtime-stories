'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Book } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MagicalPortalProps {
  className?: string;
  imageUrl?: string;
  title?: string;
}

export const MagicalPortal = ({
  className,
  imageUrl = '/storybook-portal.jpg',
  title = 'Magical Storybook',
}: MagicalPortalProps) => {
  const [sparkles, setSparkles] = useState<
    Array<{
      id: string;
      x: string;
      y: string;
      size: number;
      delay: number;
    }>
  >([]);

  const [books, setBooks] = useState<
    Array<{
      id: string;
      x: string;
      y: string;
      rotation: number;
      delay: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    // Generate sparkles
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: `sparkle-${i}`,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 3,
    }));
    setSparkles(newSparkles);

    // Generate floating books
    const newBooks = Array.from({ length: 5 }, (_, i) => ({
      id: `book-${i}`,
      x: `${20 + Math.random() * 60}%`,
      y: `${20 + Math.random() * 60}%`,
      rotation: Math.random() * 30 - 15,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
    }));
    setBooks(newBooks);
  }, []);

  return (
    <div
      className={cn(
        'relative w-full aspect-square max-w-md mx-auto overflow-hidden rounded-lg',
        className
      )}
    >
      {/* Portal background */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Storybook background"
            className="w-full h-full object-cover opacity-70"
          />
        )}
      </div>

      {/* Glowing border */}
      <div className="absolute inset-0 rounded-lg border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse" />

      {/* Floating books */}
      {books.map((book) => (
        <motion.div
          key={book.id}
          className="absolute z-10"
          initial={{
            x: book.x,
            y: book.y,
            rotate: book.rotation,
            opacity: 0,
          }}
          animate={{
            y: [
              `${parseFloat(book.y) - 5}%`,
              `${parseFloat(book.y) + 5}%`,
              `${parseFloat(book.y) - 5}%`,
            ],
            opacity: [0, 1, 0.8, 1],
            rotate: [book.rotation - 5, book.rotation + 5, book.rotation - 5],
          }}
          transition={{
            y: {
              duration: book.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            opacity: {
              duration: 2,
              delay: book.delay,
              repeat: Infinity,
              repeatType: 'reverse',
            },
            rotate: {
              duration: book.duration * 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <Book className="text-foreground/80 drop-shadow-md" size={30 + Math.random() * 20} />
        </motion.div>
      ))}

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute z-20 text-amber-200"
          initial={{
            x: sparkle.x,
            y: sparkle.y,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, sparkle.size, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        >
          <Star size={10 + Math.random() * 8} />
        </motion.div>
      ))}

      {/* Portal content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold text-foreground drop-shadow-md">{title}</h3>
          <div className="mt-2 text-sm text-foreground/80">Enter a world of imagination</div>
        </motion.div>
      </div>
    </div>
  );
};
