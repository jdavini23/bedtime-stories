'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  isSignedIn: boolean;
}

export function HeroSection({ isSignedIn }: HeroSectionProps) {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-b from-white to-dreamy-light dark:from-midnight dark:to-midnight-deep">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Personalized Bedtime Stories for Your Child
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-text-secondary dark:text-text-primary/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create magical, personalized stories featuring your child as the hero. Our AI-powered
              storyteller crafts unique adventures that inspire imagination and make bedtime
              special.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {isSignedIn ? (
                <Link href="/story/create" passHref>
                  <Button size="lg" className="px-8">
                    Create a Story
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-up" passHref>
                  <Button size="lg" className="px-8">
                    Get Started
                  </Button>
                </Link>
              )}
              <Link href="#preview" passHref>
                <Button variant="outline" size="lg" className="px-8">
                  See Preview
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="lg:w-1/2">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Image
                src="/images/illustrations/reading-time.svg"
                alt="Child reading a magical storybook"
                width={600}
                height={500}
                className="mx-auto"
                priority
              />
              <div className="absolute -bottom-4 -right-4 -left-4 h-4 bg-gradient-to-t from-dreamy-light to-transparent dark:from-midnight-deep dark:to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
