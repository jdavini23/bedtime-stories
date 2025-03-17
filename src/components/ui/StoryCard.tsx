'use client';

import React from 'react';
import { Card } from '@/components/common/Card';
import { cn } from '@/lib/utils';
import { themeClasses } from '@/config/theme';

interface Story {
  title?: string;
  content?: string;
}

interface StoryCardProps {
  story: Story;
  className?: string;
}

export function StoryCard({ story, className }: StoryCardProps) {
  return (
    <Card variant="elevated" className={className}>
      <h3 className={cn('text-lg font-bold', themeClasses.text)}>
        {story.title || 'Untitled Story'}
      </h3>
      <p className={cn('mt-2', themeClasses.textMuted)}>
        {story.content || 'No content available.'}
      </p>
    </Card>
  );
}
