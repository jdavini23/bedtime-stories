import React, { useState } from 'react';
import { TypedText } from '@/components/TypedText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface StoryPreviewProps {
  isSignedIn: boolean;
}

export function StoryPreview({ isSignedIn }: StoryPreviewProps) {
  const [childName, setChildName] = useState('Joey');
  const [selectedTheme, setSelectedTheme] = useState('fantasy');
  const [showPreview, setShowPreview] = useState(false);

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
      id="preview"
      className="py-16 bg-gradient-to-b from-dreamy-light to-white dark:from-midnight-deep dark:to-midnight"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
          Create Your Own Story
        </h2>
        <p className="text-center text-text-secondary dark:text-text-primary/80 mb-12 max-w-2xl mx-auto">
          Enter your child&apos;s name and select a theme to see a preview of what our personalized
          stories look like.
        </p>

        <div className="max-w-4xl mx-auto bg-white dark:bg-midnight-light rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label
                  htmlFor="childName"
                  className="block text-sm font-medium text-text-secondary dark:text-text-primary/80 mb-2"
                >
                  Child&apos;s Name
                </label>
                <Input
                  id="childName"
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="themeSelect"
                  className="block text-sm font-medium text-text-secondary dark:text-text-primary/80 mb-2"
                >
                  Story Theme
                </label>
                <select
                  id="themeSelect"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full p-2 rounded-md border border-lavender/30 dark:border-lavender/10 bg-white dark:bg-midnight focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="fantasy">Fantasy Adventure</option>
                  <option value="space">Space Exploration</option>
                  <option value="pirates">Pirate Treasure</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <Button onClick={() => setShowPreview(true)} className="px-8">
                Generate Preview
              </Button>
            </div>

            {showPreview && (
              <div className="bg-dreamy-light/50 dark:bg-midnight/50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Story Preview</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <TypedText text={getActiveStoryPreview(childName)} speed={20} />
                </div>
              </div>
            )}

            <div className="text-center">
              {isSignedIn ? (
                <Link href="/story/create" passHref>
                  <Button size="lg" className="px-8">
                    Create Your Story
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-in" passHref>
                  <Button size="lg" className="px-8">
                    Sign In to Create Stories
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoryPreview;
