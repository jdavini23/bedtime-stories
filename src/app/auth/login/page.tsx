'use client';

import Link from 'next/link';
import { Book } from 'lucide-react';
import SignInForm from '@/components/auth/sign-in-form';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseAuthProvider';

export default function LoginPage() {
  const { user, loading } = useSupabase();
  const searchParams = useSearchParams();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    // Log auth state changes
    console.log('Auth state in login page', {
      hasUser: !!user,
      loading,
      pathname: window.location.pathname,
      timestamp: new Date().toISOString(),
    });

    // Let middleware handle initial redirect
    // Only attempt client-side redirect as fallback after 1 second
    if (user && !loading && !redirectAttempted) {
      const timeoutId = setTimeout(() => {
        console.log('Client-side redirect fallback triggered after timeout');
        setRedirectAttempted(true);

        // Check if we're still on the login page before redirecting
        if (window.location.pathname === '/auth/login') {
          const redirectUrl = searchParams?.get('redirect_url');
          const targetPath = redirectUrl || '/dashboard';
          console.log('Performing client-side redirect to:', targetPath);
          window.location.replace(targetPath);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [user, loading, searchParams, redirectAttempted]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show redirecting message
  if (user) {
    return (
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Show login form for unauthenticated users
  return (
    <div className="w-full max-w-md">
      {/* Logo and branding */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mr-3 shadow-md">
            <Book className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white dark:text-white">Step Into Storytime</span>
        </Link>
        <h1 className="text-3xl font-bold text-white dark:text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 dark:text-gray-400">
          Sign in to continue your storytelling journey
        </p>
      </div>

      {/* Sign-in form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-dreamy p-8 mb-6">
        <SignInForm />
      </div>

      {/* Sign up link */}
      <div className="text-center">
        <p className="text-gray-400 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
