'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

function FeatureCard({ title, description, icon, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-midnight-light rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start">
        <div className="mr-4 bg-dreamy-light dark:bg-midnight p-3 rounded-lg">
          <Image src={icon} alt={title} width={32} height={32} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-primary">{title}</h3>
          <p className="text-text-secondary dark:text-text-primary/80">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      title: 'Personalized Stories',
      description:
        'Each story features your child as the main character, making them the hero of their own adventure.',
      icon: '/images/icons/magic-wand.svg',
    },
    {
      title: 'Multiple Themes',
      description: 'Choose from fantasy, space, underwater, and many more exciting story themes.',
      icon: '/images/icons/palette.svg',
    },
    {
      title: 'AI-Powered',
      description:
        "Our advanced AI creates unique, engaging stories tailored to your child's interests and reading level.",
      icon: '/images/icons/robot.svg',
    },
    {
      title: 'Beautiful Illustrations',
      description: 'Each story comes with charming illustrations that bring the narrative to life.',
      icon: '/images/icons/picture.svg',
    },
    {
      title: 'Read Aloud',
      description: 'Listen to stories with our text-to-speech feature, perfect for bedtime.',
      icon: '/images/icons/volume.svg',
    },
    {
      title: 'Save & Print',
      description: 'Save your favorite stories to read again or print them as keepsakes.',
      icon: '/images/icons/printer.svg',
    },
  ];

  return (
    <section
      id="features"
      className="py-16 bg-gradient-to-b from-white to-dreamy-light dark:from-midnight dark:to-midnight-deep"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Magical Features
          </motion.h2>
          <motion.p
            className="text-lg text-text-secondary dark:text-text-primary/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover all the ways our platform makes storytelling special for you and your child.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={0.1 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
