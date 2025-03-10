'use client';

import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isSystem = message.sender === 'system';

  return (
    <div className={`flex ${isSystem ? 'justify-start' : 'justify-end'} mb-4`}>
      {isSystem && (
        <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-lg">✨</span>
        </div>
      )}
      <div
        className={`rounded-2xl p-4 max-w-[80%] ${
          isSystem
            ? 'bg-sky-900/90 text-white'
            : 'bg-white/10 backdrop-blur-sm text-gray-800 dark:text-white'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
