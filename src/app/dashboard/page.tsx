'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Book, Wand, Settings } from 'lucide-react';

import DashboardStatisticsSkeleton from '@/components/dashboard/DashboardStatisticsSkeleton';
import DashboardStatistics from '@/components/dashboard/DashboardStatistics';

// Client-side authentication check
export default function DashboardPage() {
  const { userId } = useAuth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <DashboardClientContent userId={userId} />;
}

// Client-side rendering of dashboard
function DashboardClientContent({
  userId,
}: {
  userId: string | null;
}) {
  const dashboardCards = [
    {
      title: 'Create Story',
      description: 'Start a new magical adventure',
      icon: <Wand className="w-8 h-8 text-purple-600" />,
      link: '/story/create',
      color: 'bg-purple-50',
    },
    {
      title: 'Story History',
      description: 'View your generated stories',
      icon: <Book className="w-8 h-8 text-blue-600" />,
      link: '/stories',
      color: 'bg-blue-50',
    },
    {
      title: 'Preferences',
      description: 'Customize your experience',
      icon: <Settings className="w-8 h-8 text-green-600" />,
      link: '/preferences',
      color: 'bg-green-50',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <Suspense fallback={<DashboardStatisticsSkeleton />}>
        <DashboardStatistics userId={userId} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`${card.color} p-6 rounded-lg shadow-md hover:shadow-lg transition-all`}
          >
            <div className="flex items-center mb-4">
              {card.icon}
              <h3 className="ml-4 text-lg font-semibold">{card.title}</h3>
            </div>
            <p className="text-gray-600">{card.description}</p>
            <motion.a
              href={card.link}
              whileHover={{ scale: 1.05 }}
              className="block mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore
            </motion.a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
