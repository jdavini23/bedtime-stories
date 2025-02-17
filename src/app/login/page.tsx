'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useSession } from '@/hooks/useSession';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Chrome, Book, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          type: "spring", 
          stiffness: 120 
        }}
        className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl border border-gray-100"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-4 text-sm rounded-lg bg-red-50 text-red-600 flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>There was an error signing in. Please try again.</span>
          </motion.div>
        )}

        <div className="text-center">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Bedtime Stories
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Create magical stories for your children
          </p>
        </div>
        
        <div className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleSignIn}
              variant="default" 
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Chrome className="mr-2 h-6 w-6" />
              Sign in with Google
            </Button>
          </motion.div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="/terms" className="underline hover:text-purple-600">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-purple-600">
            Privacy Policy
          </a>
        </div>
      </motion.div>
    </div>
  );
}
