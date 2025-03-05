'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';

// Dynamically import StoryFeatureGrid
const StoryFeatureGrid = dynamic(
  () => import('@/components/StoryFeatureCard').then((mod) => mod.StoryFeatureGrid),
  {
    loading: () => (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-lavender/20 dark:bg-lavender/10 h-64 rounded-lg"></div>
        ))}
      </div>
    ),
    ssr: false,
  }
);

export function WhyParentsLoveIt() {
  return (
    <section className="py-16 px-8 bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900 dark:to-sky-900">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-primary text-center mb-12">Why Parents Love It</h2>
        <StoryFeatureGrid />
        
        {/* Testimonial */}
        <Card variant="magical" className="mt-12 p-8 text-center bg-white/80 dark:bg-midnight/80 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-lavender rounded-full mb-4"></div>
            <p className="text-lg italic mb-4">
              &quot;My daughter asks for a new story every night! It&apos;s become our special
              bedtime ritual, and I love how each story incorporates her interests.&quot;
            </p>
            <p className="font-bold">Sarah T., Parent of 6-year-old</p>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-golden text-xl">★</span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}