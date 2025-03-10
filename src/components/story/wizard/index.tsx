'use client';

import React, { useRef, useEffect } from 'react';
import { WizardProvider } from './WizardContext';
import { WelcomeStep } from './steps/WelcomeStep';
import { NameStep } from './steps/NameStep';
import { GenderStep } from './steps/GenderStep';
import { InterestsStep } from './steps/InterestsStep';
import { TraitsStep } from './steps/TraitsStep';
import { ReadingLevelStep } from './steps/ReadingLevelStep';
import { useWizardState } from './useWizardState';
import { ConversationalWizardProps } from './types';
import { MessageBubble } from './components/MessageBubble';
import { StepTransition } from './components/StepTransition';
import { ErrorBoundary } from './components/ErrorBoundary';
import { trapFocus, announceMessage } from './utils/accessibility';
import { canProceedToNextStep } from './utils/validation';

function ConversationalWizard({ onComplete, isLoading = false }: ConversationalWizardProps) {
  const {
    currentQuestion,
    messages,
    isTyping,
    storyInput,
    selectedInterests,
    selectedTraits,
    lastTransitionTimestamp,
  } = useWizardState();

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);
  const prevQuestionRef = useRef(currentQuestion);

  // Track component mount
  useEffect(() => {
    console.log('[Wizard] Component mounted', {
      currentQuestion,
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
    });

    return () => {
      console.log('[Wizard] Component unmounting', {
        currentQuestion,
        messageCount: messages.length,
        timestamp: new Date().toISOString(),
      });
    };
  }, []);

  // Track message changes
  useEffect(() => {
    if (messages.length !== prevMessageCountRef.current) {
      console.log('[Wizard] Messages updated', {
        previousCount: prevMessageCountRef.current,
        newCount: messages.length,
        currentQuestion,
        isTyping,
        timestamp: new Date().toISOString(),
      });
      prevMessageCountRef.current = messages.length;
    }
  }, [messages.length, currentQuestion, isTyping]);

  // Track question changes
  useEffect(() => {
    if (currentQuestion !== prevQuestionRef.current) {
      console.log('[Wizard] Question changed', {
        from: prevQuestionRef.current,
        to: currentQuestion,
        messageCount: messages.length,
        isTyping,
        timestamp: new Date().toISOString(),
      });
      prevQuestionRef.current = currentQuestion;
    }
  }, [currentQuestion, messages.length, isTyping]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !isTyping) {
      console.log('[Wizard] Processing new message', {
        messageType: lastMessage.type,
        sender: lastMessage.sender,
        currentQuestion,
        timestamp: new Date().toISOString(),
      });

      announceMessage(
        `New message from ${lastMessage.sender}: ${
          typeof lastMessage.content === 'string' ? lastMessage.content : 'Content available'
        }`
      );

      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, currentQuestion]);

  // Track typing state changes
  useEffect(() => {
    console.log('[Wizard] Typing state changed', {
      isTyping,
      currentQuestion,
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
    });

    const container = containerRef.current;
    if (container) {
      container.style.pointerEvents = isTyping ? 'none' : 'auto';
    }
  }, [isTyping, currentQuestion, messages.length]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (containerRef.current && !isTyping) {
      trapFocus(event, { current: containerRef.current });
    }
  };

  const renderStep = () => {
    const validation = canProceedToNextStep(
      currentQuestion,
      storyInput,
      selectedInterests,
      selectedTraits
    );

    const stepContent = (() => {
      switch (currentQuestion) {
        case 'welcome':
        case 'theme-question':
          return <WelcomeStep />;
        case 'name-question':
          return <NameStep />;
        case 'gender-question':
          return <GenderStep />;
        case 'interests-question':
          return <InterestsStep />;
        case 'traits-question':
          return <TraitsStep />;
        case 'reading-level-question':
          return <ReadingLevelStep />;
        default:
          return null;
      }
    })();

    return (
      <StepTransition isVisible={!isTyping} key={`${currentQuestion}-${lastTransitionTimestamp}`}>
        {stepContent}
        {!validation.canProceed && validation.error && (
          <p className="text-sm text-red-500 mt-2" role="alert">
            {validation.error}
          </p>
        )}
      </StepTransition>
    );
  };

  return (
    <ErrorBoundary>
      <div
        ref={containerRef}
        className="w-full bg-white/80 dark:bg-midnight-light/30 rounded-xl shadow-xl p-6 backdrop-blur-sm space-y-4 overflow-y-auto max-h-[80vh]"
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-label="Story Creation Wizard"
      >
        <div className="flex items-center gap-3 bg-[#1e3a4f] p-4 rounded-2xl">
          <div className="text-2xl">✨</div>
          <div>
            <h1 className="text-xl font-semibold text-white">Story Assistant</h1>
            <p className="text-sky-100/70">Creating magical stories just for you</p>
          </div>
        </div>

        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 dark:bg-gray-800">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {renderStep()}
      </div>
    </ErrorBoundary>
  );
}

export function ConversationalWizardWithProvider(props: ConversationalWizardProps) {
  return (
    <WizardProvider>
      <ConversationalWizard {...props} />
    </WizardProvider>
  );
}

export { useWizardState };
export type { ConversationalWizardProps };
