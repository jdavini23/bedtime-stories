'use client';

import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { trackSectionVisibility, trackInteraction } from '../utils/analytics';
import { measureRenderTime } from '../utils/performance';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How are the stories personalized?',
    answer:
      "Our AI technology creates unique stories based on your child's name, interests, reading level, and personality traits that you provide. Each story is crafted to be engaging and educational while reflecting your child's preferences.",
  },
  {
    question: 'What age group are the stories suitable for?',
    answer:
      "Our stories are designed for children aged 3-12 years old. The reading level and complexity are automatically adjusted based on your child's age and reading ability.",
  },
  {
    question: 'How long does it take to generate a story?',
    answer:
      'Stories are typically generated within 30-60 seconds. The exact time may vary depending on the complexity and length of the story requested.',
  },
  {
    question: 'Can I save and revisit stories?',
    answer:
      'Yes! All generated stories are saved to your account and can be accessed at any time. You can also share them with family members or print them for offline reading.',
  },
];

function FaqAccordionItem({ question, answer }: FaqItem) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
  });

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    trackInteraction(`FAQ: ${question}`, 'click');
  };

  return (
    <div
      ref={ref}
      className={`border-b border-border dark:border-border-dark transition-colors ${
        isIntersecting ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        className="flex justify-between items-center w-full py-4 text-left"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold">{question}</span>
        <span
          className="text-2xl transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-white/50 dark:bg-midnight-light/10">
          <p className="text-text-secondary dark:text-text-primary/80">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    const startTime = performance.now();
    return () => measureRenderTime('FaqSection', startTime);
  }, []);

  useEffect(() => {
    trackSectionVisibility('FAQ', isIntersecting);
  }, [isIntersecting]);

  return (
    <section ref={ref} className="py-20 bg-background dark:bg-midnight">
      <div className="container px-4 md:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-primary/80 md:text-xl">
            Everything you need to know about our personalized stories
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqAccordionItem key={index} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
