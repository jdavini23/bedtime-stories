'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PlanFeature {
  text: string;
}

interface SubscriptionPlan {
  name: string;
  price: string;
  period: string;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant?: 'outline' | 'primary';
  popular?: boolean;
}

interface SubscriptionPlansProps {
  className?: string;
}

export function SubscriptionPlans({ className = '' }: SubscriptionPlansProps) {
  const plans: SubscriptionPlan[] = [
    {
      name: 'Free Plan',
      price: '0',
      period: 'month',
      features: [
        { text: '3 stories per month' },
        { text: '5 basic themes' },
        { text: 'Basic customization' },
        { text: 'PDF downloads' },
      ],
      buttonText: 'Start for Free',
      buttonVariant: 'outline',
    },
    {
      name: 'Premium Plan',
      price: '4.99',
      period: 'month',
      features: [
        { text: 'Unlimited stories' },
        { text: '100+ premium themes' },
        { text: 'Advanced customization' },
        { text: 'Priority support' },
        { text: 'Audio narration' },
        { text: 'Offline access' },
      ],
      buttonText: 'Go Premium',
      buttonVariant: 'primary',
      popular: true,
    },
  ];

  return (
    <section className={`py-20 px-8 bg-gradient-to-b from-cloud to-sky-50 dark:from-midnight dark:to-teal-900 relative overflow-hidden ${className}`}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-16 h-16 rounded-full bg-teal animate-float"></div>
        <div className="absolute top-40 right-1/3 w-12 h-12 rounded-full bg-golden animate-float delay-150"></div>
        <div className="absolute bottom-20 left-1/5 w-20 h-20 rounded-full bg-dreamy animate-float delay-300"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-primary text-center mb-4">Start Your Story Journey</h2>
          <p className="text-center text-lg mb-6 max-w-2xl mx-auto text-text-secondary dark:text-text-primary/80">
            Begin creating magical stories for your little ones today. No credit card needed to get started!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-golden mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant={plan.popular ? 'magical' : 'outline'}
              hover={true}
              className={`p-8 ${
                plan.popular ? 'pt-14' : ''
              } space-y-6 relative overflow-hidden ${
                plan.popular
                  ? 'bg-gradient-to-br from-white to-dreamy-light dark:from-midnight dark:to-teal-800 border-2 border-golden/30 shadow-glow'
                  : 'bg-white/90 dark:bg-midnight/90 backdrop-blur-sm border-2 border-lavender/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-teal-500/90 text-text-primary font-medium py-2 px-4 text-center shadow-md">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.5 12.5C8.5 10.5 12 10 15.5 12.5C19 15 20.5 19 20.5 19C20.5 19 18.5 18.5 16.5 18.5C14.5 18.5 12 19 9.5 21.5C7 24 4 24 4 24C4 24 4 21.5 6 18.5C8 15.5 9.5 14 9.5 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11 12.5C11 12.5 13.5 11 15 8.5C16.5 6 16 3 16 3C16 3 13 3.5 11.5 5.5C10 7.5 9 10 9 12.5C9 15 11 17.5 11 17.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Most Popular
                  </div>
                </div>
              )}

              {/* Decorative corner */}
              <div className={`absolute ${plan.popular ? '-bottom-10 -right-10' : '-top-10 -left-10'} w-20 h-20 rounded-full ${
                plan.popular ? 'bg-golden/20' : 'bg-lavender/20'
              }`}></div>

              <div className="relative">
                <h3 className="text-primary text-center mb-2">{plan.name}</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-text-secondary dark:text-text-primary/80 ml-1">/{plan.period}</span>
                </div>

                <div className={`${
                  plan.popular ? 'bg-golden/10 dark:bg-golden/20' : 'bg-lavender/10 dark:bg-lavender/20'
                } rounded-xl p-5 mb-6`}>
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full ${
                          plan.popular ? 'bg-golden/20' : 'bg-teal/20'
                        } flex items-center justify-center`}>
                          <span className={plan.popular ? 'text-golden-500' : 'text-teal-500'}>✓</span>
                        </span>
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/story">
                  <Button
                    variant={plan.buttonVariant}
                    fullWidth
                    className={`group relative overflow-hidden ${
                      plan.popular ? 'bg-golden hover:bg-golden/90' : ''
                    }`}
                  >
                    <span className="relative z-10">{plan.buttonText}</span>
                    <span className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 opacity-20"></span>
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SubscriptionPlans;
