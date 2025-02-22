'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StoryInput } from '@/types/story';

interface PreviewStepProps {
  storyInput: StoryInput;
  onBack: () => void;
  onComplete: () => void;
  isLoading?: boolean;
}

export function PreviewStep({ storyInput, onBack, onComplete, isLoading = false }: PreviewStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Preview Your Story Settings</h2>
        <p className="mt-2 text-sm text-gray-600">
          Review your story settings before we create your personalized story
        </p>
      </div>

      <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Theme</h3>
            <p className="mt-1 text-sm text-gray-900">{storyInput.theme}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Character Name</h3>
            <p className="mt-1 text-sm text-gray-900">{storyInput.childName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Gender</h3>
            <p className="mt-1 text-sm text-gray-900">{storyInput.gender}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Reading Level</h3>
            <p className="mt-1 text-sm text-gray-900">{storyInput.readingLevel}</p>
          </div>
          {storyInput.interests && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Interests</h3>
              <p className="mt-1 text-sm text-gray-900">{storyInput.interests}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating Story...' : 'Create Story'}
        </button>
      </div>
    </motion.div>
  );
}