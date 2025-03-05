'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How are the stories generated?',
    answer: 'Our stories are crafted using advanced AI technology that combines your child\'s interests, age, and name to create unique, personalized adventures. Each story is generated in real-time and is never exactly the same twice.'
  },
  {
    question: 'Is it safe for children?',
    answer: 'Absolutely! We have robust content filters and AI safety measures in place to ensure all stories are age-appropriate and family-friendly. Our AI is specifically trained to create wholesome, educational content suitable for children.'
  },
  {
    question: 'Can I save or print the stories?',
    answer: 'Yes! After a story is generated, you can save it to your library, download it as a PDF, or print it directly. Premium members can also access illustrated versions of their stories.'
  },
  {
    question: 'How many stories can I create?',
    answer: 'Free users can create up to 3 stories per month. Premium members get unlimited story generation, plus access to special themes, illustrations, and audio narration features.'
  },
  {
    question: 'Can I customize the story themes?',
    answer: 'Yes! You can choose from various themes like space adventures, fairy tales, pirate quests, and more. Premium members get access to additional special themes and can even create custom theme combinations.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-8 bg-gradient-to-b from-white to-lavender/10 dark:from-midnight dark:to-primary/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-primary text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-text-secondary dark:text-text-primary/80 text-center mb-12 max-w-2xl mx-auto">
          Have questions about our story generation? Find answers to common questions below.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-midnight dark:text-text-primary">
                    {faq.question}
                  </h3>
                  <button
                    className="flex items-center justify-center w-6 h-6 text-primary transition-transform duration-200"
                    aria-expanded={openIndex === index}
                    aria-label={openIndex === index ? 'Collapse answer' : 'Expand answer'}
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="mt-4 text-text-secondary dark:text-text-primary/80">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}