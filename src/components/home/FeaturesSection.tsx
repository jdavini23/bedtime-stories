'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/OptimizedImage';
import { LazyLoad } from '@/components/LazyLoad';

// Custom hook for intersection observer
function useOnScreen(ref: React.RefObject<HTMLElement>, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { rootMargin, threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-cloud-light dark:bg-midnight-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <SectionHeader
            title="Magical Features"
            subtitle="Discover the enchanting capabilities that make our stories special"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, '-100px');

  return (
    <div ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-4 text-midnight dark:text-cloud"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-lg text-midnight-light dark:text-dreamy max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, '-100px');

  return (
    <LazyLoad>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 * index }}
        className="bg-white dark:bg-midnight p-6 rounded-xl shadow-dreamy hover:shadow-lg transition-shadow duration-300"
      >
        <div className="w-16 h-16 mb-4 relative">
          <OptimizedImage
            src={feature.icon}
            alt={feature.title}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-midnight dark:text-cloud">
          {feature.title}
        </h3>
        <p className="text-midnight-light dark:text-dreamy">{feature.description}</p>
      </motion.div>
    </LazyLoad>
  );
}

const features: Feature[] = [
  {
    title: 'Personalized Characters',
    description: 'Stories feature your child as the main character with their name and traits',
    icon: '/images/icons/character.svg',
  },
  {
    title: 'Multiple Themes',
    description: 'Choose from fantasy, space adventure, underwater, and many more themes',
    icon: '/images/icons/theme.svg',
  },
  {
    title: 'Age-Appropriate Content',
    description: "Stories tailored to your child's age and reading level",
    icon: '/images/icons/age.svg',
  },
  {
    title: 'Beautiful Illustrations',
    description: 'Each story comes with charming illustrations that bring the tale to life',
    icon: '/images/icons/illustration.svg',
  },
  {
    title: 'Text-to-Speech',
    description: 'Listen to stories with our built-in audio narration feature',
    icon: '/images/icons/audio.svg',
  },
  {
    title: 'Save & Share',
    description: 'Save your favorite stories and share them with family and friends',
    icon: '/images/icons/share.svg',
  },
];
