'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { safeFirebaseOperation } from '@/lib/firebase/client';
import { motion } from 'framer-motion';
import { 
  Book,
  Star, 
  Wand,
  Settings,
  WifiOff as WifiOffIcon
} from 'lucide-react';
import UserPreferencesService from '@/services/userPreferencesService';
import DashboardStatisticsSkeleton from '@/components/dashboard/DashboardStatisticsSkeleton';
import DashboardStatistics from '@/components/dashboard/DashboardStatistics';

// Define a more specific type for user preferences
interface UserPreferences {
  id?: string;
  userId: string;
  preferredThemes?: string[];
  generatedStoryCount?: number;
  ageGroup?: string;
  learningInterests?: string[];
  lastStoryDate?: Date;
}

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    // Check and update online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    async function fetchUserPreferences() {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const preferences = await safeFirebaseOperation(
          () => UserPreferencesService.getUserPreferences(session.user.id),
          null,
          3  // Number of retry attempts
        );

        setUserPreferences(preferences ?? null);
      } catch (err) {
        console.error('Error fetching user preferences:', err);
        setError('Failed to load user preferences');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserPreferences();
  }, [session?.user?.id]);

  if (status === 'loading' || isLoading) {
    return <DashboardStatisticsSkeleton />;
  }

  if (isOffline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-100">
        <WifiOff className="w-16 h-16 text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">You're Offline</h2>
        <p className="text-gray-600 mb-4">
          Some features may be limited while you're offline. 
          Please check your internet connection.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Something Went Wrong</h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'Create Story',
      description: 'Start a new magical adventure',
      icon: <WandSparkles className="w-8 h-8 text-purple-600" />,
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
      icon: <Cog className="w-8 h-8 text-green-600" />,
      link: '/preferences',
      color: 'bg-green-50'
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        Logged in as: {session?.user?.email}
      </div>
      
      <Suspense fallback={<DashboardStatisticsSkeleton />}>
        <DashboardStatistics preferences={userPreferences ?? undefined} />
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
