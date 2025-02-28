import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardCards from '@/components/dashboard/DashboardCards';

export default async function DashboardPage() {
  try {
    console.log('Dashboard: Starting authentication check');

    // Get the current user using Clerk's currentUser function
    // This doesn't require middleware detection like auth() does
    const user = await currentUser();

    console.log(
      'Dashboard: User authentication result:',
      user ? `Authenticated as ${user.id}` : 'Not authenticated'
    );

    // If no user is found, redirect to sign-in page
    if (!user) {
      console.log('Dashboard: No user found, redirecting to sign-in');
      redirect('/sign-in');
    }

    console.log('Dashboard: User authenticated, rendering dashboard');

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <DashboardCards />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Dashboard authentication error:', error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unknown error type:', typeof error);
    }

    // Redirect to sign-in page if there's an authentication error
    console.log('Dashboard: Redirecting to sign-in with error parameter');
    redirect('/sign-in?error=auth_error');
  }
}
