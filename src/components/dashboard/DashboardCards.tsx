'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Book, Star, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { themeClasses } from '@/config/theme';

const cards = [
  {
    title: 'Create Story',
    description: 'Create a new bedtime story for your child',
    href: '/story/create',
    icon: Book,
    variant: 'primary',
  },
  {
    title: 'Story History',
    description: 'View your previously created stories',
    href: '/story/history',
    icon: Star,
    variant: 'secondary',
  },
  {
    title: 'Preferences',
    description: 'Customize your story preferences',
    href: '/preferences',
    icon: Moon,
    variant: 'accent',
  },
] as const;

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Link key={card.title} href={card.href}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
              'p-6 rounded-xl',
              themeClasses.card,
              'border-2',
              card.variant === 'primary' && 'border-primary/30',
              card.variant === 'secondary' && 'border-teal/30',
              card.variant === 'accent' && 'border-golden/30',
              'hover:shadow-lg transition-all duration-300'
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                card.variant === 'primary' && 'bg-primary/10 text-primary',
                card.variant === 'secondary' && 'bg-teal/10 text-teal',
                card.variant === 'accent' && 'bg-golden/10 text-golden'
              )}
            >
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className={cn('text-lg font-semibold mb-2', themeClasses.text)}>{card.title}</h3>
            <p className={cn('text-sm', themeClasses.textMuted)}>{card.description}</p>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
