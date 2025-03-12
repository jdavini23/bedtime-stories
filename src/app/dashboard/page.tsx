'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import DashboardCards from '@/components/dashboard/DashboardCards';

export default function DashboardPage() {
  const { user, loading } = useSupabase();
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    console.log('Dashboard: Starting authentication check');

    if (!loading) {
      console.log(
        'Dashboard: User authentication result:',
        user ? `Authenticated as ${user.id}` : 'Not authenticated'
      );

      // If no user is found, redirect to login page
      if (!user) {
        console.log('Dashboard: No user found, redirecting to login');
        router.push('/login');
      } else {
        setIsPageLoading(false);
      }
    }
  }, [loading, user, router]);

  if (loading || isPageLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  console.log('Dashboard: User authenticated, rendering dashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardCards />
    </div>
  );
}
