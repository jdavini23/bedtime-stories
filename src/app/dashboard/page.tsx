'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardCards from '@/components/dashboard/DashboardCards';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Dashboard: Starting authentication check');

    if (isLoaded) {
      console.log(
        'Dashboard: User authentication result:',
        isSignedIn ? `Authenticated as ${user?.id}` : 'Not authenticated'
      );

      // If no user is found, redirect to sign-in page
      if (!isSignedIn) {
        console.log('Dashboard: No user found, redirecting to sign-in');
        router.push('/sign-in');
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded || isLoading) {
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
