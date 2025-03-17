'use client';

import Link from 'next/link';
import { Book } from 'lucide-react';
import SignInForm from '@/components/auth/sign-in-form';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseAuthProvider';

export default function LoginPage() {
  const { user } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      const redirectUrl = searchParams?.get('redirect_url');
      router.push(redirectUrl || '/dashboard');
    }
  }, [user, router, searchParams]);

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
