'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TypedText } from '@/components/TypedText';
import { OptimizedImage } from '@/components/OptimizedImage';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-midnight dark:text-cloud-light">
              <span className="text-primary">Personalized</span> Bedtime Stories for Your Child
            </h1>
            <p className="text-lg md:text-xl mb-8 text-midnight-light dark:text-dreamy">
              <TypedText
                text="AI-powered stories featuring your child as the main character, crafted in seconds."
                delay={50}
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/story" passHref>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-102 shadow-dreamy"
                >
                  Create Your Story
                </Button>
              </Link>
              <Link href="#how-it-works" passHref>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10 font-medium px-8 py-3 rounded-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] w-full">
              <OptimizedImage
                src="/images/illustrations/book-magic.svg"
                alt="Magical storybook illustration"
                width={500}
                height={500}
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 md:bottom-0 md:right-0 w-32 h-32 md:w-40 md:h-40 animate-float">
              <OptimizedImage
                src="/images/illustrations/stars.svg"
                alt="Magical stars"
                width={160}
                height={160}
                className="object-contain"
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
