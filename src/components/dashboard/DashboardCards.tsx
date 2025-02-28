'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Book, Star, Moon } from 'lucide-react';

const cards = [
  {
    title: 'Create Story',
    description: 'Create a new bedtime story for your child',
    href: '/story/create',
    icon: Book,
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-500 dark:text-blue-300',
  },
  {
    title: 'Story History',
    description: 'View your previously created stories',
    href: '/story/history',
    icon: Star,
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-500 dark:text-purple-300',
  },
  {
    title: 'Preferences',
    description: 'Customize your story preferences',
    href: '/preferences',
    icon: Moon,
    bgColor: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-500 dark:text-green-300',
  },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.03 }}
          className={`${card.bgColor} rounded-lg shadow-md p-6 transition-all`}
        >
          <Link href={card.href} className="block h-full">
            <div className="flex flex-col h-full">
              <div className={`${card.iconColor} mb-4`}>
                <card.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{card.description}</p>
              <div className="mt-auto">
                <span className="text-sm font-medium hover:underline">Get Started →</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
