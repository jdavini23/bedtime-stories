'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { colorOpacityClasses } from '@/utils/colors';

interface MessageBubbleProps {
  message: string;
  isUser?: boolean;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser = false, className }) => {
  return (
    <div className={cn('flex items-start mb-4', className)}>
      {/* Icon container */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0',
          colorOpacityClasses.subtle.primary
        )}
      >
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%]',
          isUser
            ? cn(colorOpacityClasses.overlay.midnight, 'text-text-primary')
            : cn('bg-background', 'text-text-secondary')
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;
