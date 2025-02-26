'use client';

import React, { useState, useRef, useEffect } from 'react';

interface FaqAccordionItemProps {
  question: string;
  answer: string;
}

function FaqAccordionItem({ question, answer }: FaqAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

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
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-white/50 dark:bg-midnight-light/10">
          <p className="text-text-secondary dark:text-text-primary/80">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const faqItems = [
    {
      question: 'How does Step Into Story Time work?',
      answer:
        "Our AI-powered platform creates personalized bedtime stories for your child in seconds. Just enter your child's name, select a theme, and we'll generate a unique story tailored to your preferences.",
    },
    {
      question: 'Are the stories appropriate for all ages?',
      answer:
        'Yes! Our stories are designed to be age-appropriate and engaging for children of all ages. You can specify age preferences for more tailored content.',
    },
    {
      question: 'Can I save and print the stories?',
      answer:
        'Absolutely! All stories can be saved to your account library, downloaded as PDFs, or printed directly from the platform to create physical keepsakes.',
    },
    {
      question: 'Is there a limit to how many stories I can create?',
      answer:
        'Free accounts can create up to 5 stories per month. Premium subscribers enjoy unlimited story creation and additional features like audio narration and custom illustrations.',
    },
  ];

  return (
    <section className="py-16 px-8 bg-gradient-to-b from-white to-lavender/10 dark:from-midnight dark:to-midnight-light/10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FaqAccordionItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
