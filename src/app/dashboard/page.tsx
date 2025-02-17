'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import UserPreferencesService from '@/services/userPreferencesService';
import DashboardStatisticsSkeleton from '@/components/dashboard/DashboardStatisticsSkeleton';
import DashboardStatistics from '@/components/dashboard/DashboardStatistics';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userPreferences = await UserPreferencesService.getUserPreferences(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome, {session.user?.name || 'User'}!
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link href="/story/create">
              <Button className="w-full">
                Create New Story
              </Button>
            </Link>
          </div>
        </div>

        <Suspense fallback={<DashboardStatisticsSkeleton />}>
          <DashboardStatistics preferences={userPreferences} />
        </Suspense>

        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Your Story Stats</h2>
            <p>Stories Generated: 0</p>
            <p>Favorite Themes: None yet</p>
          </div>

          <button 
            onClick={() => session.user && UserPreferencesService.logout()}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}


