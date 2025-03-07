'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TypedText } from '@/components/TypedText';

interface HowItWorksProps {
  initialChildName?: string;
}

export function HowItWorks({ initialChildName = 'Joey' }: HowItWorksProps) {
  const [selectedTheme, setSelectedTheme] = useState('fantasy');
  const [childName, setChildName] = useState(initialChildName);

  // Theme-specific story previews
  const getThemePreview = (theme: string, name: string) => {
    switch (theme) {
      case 'space':
        return [
          `Far beyond the stars, in a galaxy of wonders, a brave space explorer named ${name} piloted their shimmering starship.`,
          `${name} had always dreamed of discovering new planets, and today was the day their wish would come true.`,
          `As ${name} approached the mysterious nebula, the ship's sensors detected something extraordinary...`,
        ];
      case 'pirates':
        return [
          `Across the seven seas, aboard the mighty ship "The Golden Adventure," sailed the courageous Captain ${name}.`,
          `${name} had always dreamed of finding hidden treasure, and today was the day their map would lead to fortune.`,
          `As ${name} followed the ancient map to the mysterious island, strange birds with colorful feathers guided the way...`,
        ];
      case 'fantasy':
      default:
        return [
          `Once upon a time, in a magical kingdom filled with enchanted creatures and whispering trees, there lived a brave hero named ${name}.`,
          `${name} had always dreamed of magical adventures, and today was the day their wish would come true.`,
          `As ${name} was exploring near the ancient castle, a tiny dragon with shimmering scales appeared...`,
        ];
    }
  };

  // Get the appropriate story preview based on the selected theme
  const getActiveStoryPreview = (name: string) => {
    return getThemePreview(selectedTheme, name).join('\n\n');
  };

  return (
    <section
      id="how-it-works"
      className="py-20 px-8 bg-white dark:bg-midnight-dark relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-golden"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-primary text-center mb-4">The Magic Behind Your Stories</h2>
          <p className="text-lg text-text-secondary dark:text-text-primary/80 max-w-2xl mx-auto">
            Creating personalized stories for your child is simple and magical. Just follow these
            three easy steps to bring imagination to life.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-lavender via-primary to-golden transform -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-lavender to-primary rounded-full flex items-center justify-center mb-6 shadow-dreamy">
                <span className="text-2xl text-white font-bold">1</span>
              </div>
              <Card
                hover
                className="w-full space-y-4 text-center p-6 bg-sky-50 dark:bg-midnight border-t-4 border-lavender"
              >
                <h3 className="text-primary">Choose Your Adventure</h3>
                <p className="text-text-secondary dark:text-text-primary/80">
                  Select from magical worlds like enchanted forests, space odysseys, or underwater
                  kingdoms.
                </p>
                <div className="flex gap-2 flex-wrap mt-4 justify-center">
                  <Button
                    variant={selectedTheme === 'space' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTheme('space')}
                    className={selectedTheme === 'space' ? 'bg-primary' : ''}
                  >
                    <Image
                      src="/images/illustrations/space-rocket.svg"
                      alt="Space"
                      width={20}
                      height={20}
                      className="mr-1"
                    />
                    Space
                  </Button>
                  <Button
                    variant={selectedTheme === 'fantasy' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTheme('fantasy')}
                    className={selectedTheme === 'fantasy' ? 'bg-primary' : ''}
                  >
                    <Image
                      src="/images/illustrations/fairy.svg"
                      alt="Fantasy"
                      width={20}
                      height={20}
                      className="mr-1"
                    />
                    Fantasy
                  </Button>
                  <Button
                    variant={selectedTheme === 'pirates' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTheme('pirates')}
                    className={selectedTheme === 'pirates' ? 'bg-primary' : ''}
                  >
                    <Image
                      src="/images/illustrations/pirate.svg"
                      alt="Pirates"
                      width={20}
                      height={20}
                      className="mr-1"
                    />
                    Pirates
                  </Button>
                </div>
              </Card>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center md:mt-12">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-dreamy rounded-full flex items-center justify-center mb-6 shadow-dreamy">
                <span className="text-2xl text-white font-bold">2</span>
              </div>
              <Card
                hover
                className="w-full space-y-4 text-center p-6 bg-sky-50 dark:bg-midnight border-t-4 border-dreamy"
              >
                <h3 className="text-primary">Create Your Hero</h3>
                <p className="text-text-secondary dark:text-text-primary/80">
                  Personalize with your child&apos;s name, age, and favorite things to make them the
                  star.
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <Input
                    placeholder="Child's name"
                    className="text-center text-midnight dark:text-text-primary"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                  />
                  <div className="flex gap-2 justify-center mt-2">
                    <Button variant="outline" size="sm">
                      <Image
                        src="/images/illustrations/superhero.svg"
                        alt="Brave"
                        width={20}
                        height={20}
                        className="mr-1"
                      />
                      Brave
                    </Button>
                    <Button variant="outline" size="sm">
                      <Image
                        src="/images/illustrations/brain.svg"
                        alt="Clever"
                        width={20}
                        height={20}
                        className="mr-1"
                      />
                      Clever
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-dreamy to-golden rounded-full flex items-center justify-center mb-6 shadow-dreamy">
                <span className="text-2xl text-white font-bold">3</span>
              </div>
              <Card
                hover
                className="w-full space-y-4 text-center p-6 bg-sky-50 dark:bg-midnight border-t-4 border-golden"
              >
                <h3 className="text-primary">Watch the Magic Happen</h3>
                <p className="text-text-secondary dark:text-text-primary/80">
                  Our AI crafts a unique tale in seconds. Save, print, or read it together at
                  bedtime.
                </p>
                <div className="relative h-48 mt-4 overflow-hidden rounded-lg bg-white/50 dark:bg-midnight-light/50 shadow-sm">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center px-4 w-full">
                      <Image
                        src={
                          selectedTheme === 'space'
                            ? '/images/illustrations/space-rocket.svg'
                            : selectedTheme === 'pirates'
                              ? '/images/illustrations/pirate.svg'
                              : '/images/illustrations/fairy.svg'
                        }
                        alt="Story theme"
                        width={60}
                        height={60}
                        className="object-contain mx-auto mb-3"
                      />
                      <h4 className="text-primary font-medium text-sm mb-2">
                        {childName}&apos;s{' '}
                        {selectedTheme === 'space'
                          ? 'Space Adventure'
                          : selectedTheme === 'pirates'
                            ? 'Pirate Quest'
                            : 'Magical Journey'}
                      </h4>

                      <div className="h-20 overflow-y-auto text-xs text-text-secondary dark:text-text-primary/70 max-w-xs mx-auto text-left story-text">
                        <TypedText
                          key={`theme-preview-${selectedTheme}-${childName}`}
                          text={getActiveStoryPreview(childName)}
                          className="whitespace-pre-line text-midnight dark:text-text-primary"
                          delay={300}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-text-secondary dark:text-text-primary/80 mb-6 italic">
            &quot;From theme selection to story creation in less than a minute!&quot;
          </p>
          <Link href="/story">
            <Button size="lg" className="px-8">
              Create Your First Story
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
