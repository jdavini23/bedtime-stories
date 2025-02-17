'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useSession } from '@/hooks/useSession';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Chrome } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useSession();

  // Redirect if already authenticated
  if (isAuthenticated) {
    redirect('/dashboard');
  }

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
        <div className="text-center">
          <Image 
            src="/logo.png" 
            alt="Bedtime Stories Logo" 
            width={100} 
            height={100} 
            className="mx-auto mb-6 rounded-full shadow-lg"
          />
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
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
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
