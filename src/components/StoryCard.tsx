'use client';

import React from 'react';

interface Story {
  id: string;
  title?: string;
  content?: string;
}

interface StoryCardProps {
  story: Story;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h3 className="text-lg font-bold">{story.title || 'Untitled Story'}</h3>
      <p className="mt-2 text-gray-600">{story.content || 'No content available.'}</p>
    </div>
  );
};
