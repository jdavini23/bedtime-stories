'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Star, Sparkles, Settings } from 'lucide-react';
import UserPreferencesService from '@/services/userPreferencesService';
import DashboardStatisticsSkeleton from '@/components/dashboard/DashboardStatisticsSkeleton';
import DashboardStatistics from '@/components/dashboard/DashboardStatistics';

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const userPreferences = UserPreferencesService.getUserPreferences(session.user.id);

  const dashboardCards = [
    {
      title: 'Create Story',
      description: 'Start a new magical adventure',
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
      link: '/story/create',
      color: 'bg-purple-50'
    },
    {
      title: 'Story History',
      description: 'View your generated stories',
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      link: '/stories',
      color: 'bg-blue-50'
    },
    {
      title: 'Preferences',
      description: 'Customize your experience',
      icon: <Settings className="w-8 h-8 text-green-600" />,
      link: '/preferences',
      color: 'bg-green-50'
    },
    {
      title: 'Favorites',
      description: 'Your most loved stories',
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      link: '/favorites',
      color: 'bg-yellow-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Welcome, {session.user?.name?.split(' ')[0]}!
              </h2>
              <p className="mt-2 text-gray-600">
                Ready to create magical stories?
              </p>
            </div>
            <Link href="/story/create">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Create New Story
              </Button>
            </Link>
          </div>
        </motion.div>

        <Suspense fallback={<DashboardStatisticsSkeleton />}>
          <DashboardStatistics preferences={userPreferences} />
        </Suspense>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.link}>
              <div className={`
                ${card.color} 
                p-6 rounded-xl shadow-md hover:shadow-lg 
                transition-all duration-300 ease-in-out 
                transform hover:-translate-y-2 
                flex flex-col items-start space-y-4
              `}>
                {card.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Your Story Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-800">Stories Generated</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {userPreferences?.storiesGenerated || 0}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Favorite Themes</h3>
              <p className="text-gray-600">
                {userPreferences?.favoriteThemes?.join(', ') || 'Exploring'}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800">Last Story Created</h3>
              <p className="text-gray-600">
                {userPreferences?.lastStoryDate 
                  ? new Date(userPreferences.lastStoryDate).toLocaleDateString() 
                  : 'No stories yet'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
