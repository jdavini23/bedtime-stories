import React, { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface FaqAccordionItemProps {
  question: string;
  answer: string;
}

export function FaqAccordionItem({ question, answer }: FaqAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  return (
    <div
      ref={ref}
      className={`border border-lavender/30 dark:border-lavender/10 rounded-lg overflow-hidden transition-opacity duration-500 ${
        isIntersecting ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        className="w-full p-4 flex justify-between items-center bg-dreamy-light/50 dark:bg-midnight hover:bg-dreamy-light dark:hover:bg-midnight-light transition-colors text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-primary text-lg font-medium">{question}</h3>
        <div
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="p-4 bg-white/50 dark:bg-midnight-light/10">
          <p className="text-text-secondary dark:text-text-primary/80">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default FaqAccordionItem;
