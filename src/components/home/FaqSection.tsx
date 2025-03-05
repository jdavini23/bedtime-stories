import React, { useMemo } from 'react';
import FaqAccordionItem from './FaqAccordionItem';

export function FaqSection() {
  const faqs = useMemo(
    () => [
      {
        question: 'How much does it cost?',
        answer:
          'We offer a free tier with 3 stories per month. Our premium plan at $4.99/month gives you unlimited stories, more themes, and the ability to save and print your creations.',
      },
      {
        question: 'Can I edit my stories?',
        answer:
          'Yes! All stories can be edited after generation. Premium users get access to advanced editing features including custom illustrations.',
      },
      {
        question: 'What age group is this for?',
        answer:
          "Our stories are designed for children ages 2-10. You can select the appropriate reading level during story creation to match your child's abilities.",
      },
      {
        question: 'Can I print the stories?',
        answer:
          'Absolutely! All stories can be downloaded as PDFs for easy printing. Premium users get access to special formatting options and illustration quality.',
      },
    ],
    []
  );

  return (
    <section
      id="faq"
      className="py-16 bg-gradient-to-b from-white to-dreamy-light dark:from-midnight dark:to-midnight-deep"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FaqAccordionItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
