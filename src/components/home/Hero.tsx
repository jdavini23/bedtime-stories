'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TypedText } from '@/components/TypedText';

interface HeroProps {
  initialChildName?: string;
}

export function Hero({ initialChildName = 'Joey' }: HeroProps) {
  const [childName, setChildName] = useState(initialChildName);
  const [showPreview, setShowPreview] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const getStoryPreview = (name: string) => [
    `Once upon a time, in a magical forest filled with talking animals and whispering trees, there lived a brave child named ${name}.`,
    `${name} had always dreamed of adventure, and today was the day their wish would come true.`,
    `As ${name} was exploring near the old oak tree, a tiny woodland fairy with shimmering wings appeared...`,
  ];

  return (
    <section className="relative py-20 px-8 overflow-hidden bg-hero-pattern">
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/images/hero-bg.webp"
          alt="Background pattern"
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
          quality={60}
        />
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-dreamy animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-golden animate-float delay-150"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-primary animate-float delay-300"></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 rounded-full bg-sky animate-float delay-200"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-midnight dark:text-text-primary leading-tight">
            Step Into Story Time, <span className="text-primary">Instantly!</span>
          </h1>
          <p className="text-xl text-text-secondary dark:text-text-primary/80">
            Personalized, AI-powered bedtime stories for your child—crafted in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/story">
              <Button size="lg" className="animate-float delay-300 w-full sm:w-auto">
                Start Your Story
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See How It Works
            </Button>
          </div>
        </div>

        <div className="md:w-1/2 relative">
          <div className="relative w-full h-[300px] md:h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-golden/20 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="w-full h-full flex flex-col">
                <div className="bg-primary/30 dark:bg-primary/50 p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-golden"></div>
                    <div className="w-3 h-3 rounded-full bg-dreamy"></div>
                    <div className="w-3 h-3 rounded-full bg-teal"></div>
                  </div>
                  <span className="text-sm font-medium">{childName}&apos;s Magical Adventure</span>
                  <div className="flex items-center gap-1">
                    <span className="twinkling-star text-sm">✨</span>
                  </div>
                </div>

                <div className="flex-1 bg-white/90 dark:bg-midnight-light/90 p-4 overflow-hidden relative">
                  {showPreview ? (
                    <div className="h-full overflow-y-auto story-text pr-2">
                      <TypedText
                        key={`story-preview-${refreshKey}`}
                        text={getStoryPreview(childName).join('\n\n')}
                        className="whitespace-pre-line text-midnight dark:text-text-primary"
                        onComplete={() => {
                          /* Story preview complete */
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                      <Image
                        src="/images/illustrations/book-magic.svg"
                        alt="Magical storybook"
                        width={100}
                        height={100}
                        className="object-contain"
                        priority
                        loading="eager"
                        sizes="(max-width: 768px) 100px, 100px"
                        quality={90}
                      />
                      <p className="text-text-secondary dark:text-text-primary/80">
                        See a personalized story preview!
                      </p>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/80 dark:bg-midnight/80 backdrop-blur-sm border-t border-lavender/20">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Child's name"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="text-sm text-midnight dark:text-text-primary"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          setShowPreview(true);
                          setRefreshKey((prev) => prev + 1);
                        }}
                        className="whitespace-nowrap"
                      >
                        {showPreview ? 'Refresh Preview' : 'Show Preview'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white/80 dark:bg-midnight/80 backdrop-blur-sm rounded-lg p-3 flex justify-around items-center shadow-dreamy">
            <div className="text-center">
              <p className="font-bold text-primary text-xl">10,000+</p>
              <p className="text-xs text-text-secondary dark:text-text-primary/70">
                Stories Created
              </p>
            </div>
            <div className="h-10 border-r border-lavender/30"></div>
            <div className="text-center">
              <p className="font-bold text-primary text-xl">4.9/5</p>
              <p className="text-xs text-text-secondary dark:text-text-primary/70">Parent Rating</p>
            </div>
            <div className="h-10 border-r border-lavender/30"></div>
            <div className="text-center">
              <p className="font-bold text-primary text-xl">5,000+</p>
              <p className="text-xs text-text-secondary dark:text-text-primary/70">
                Happy Families
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
