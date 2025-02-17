'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useSession } from '@/hooks/useSession';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Chrome, Github } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useSession();

  // Redirect if already authenticated
  if (isAuthenticated) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Bedtime Stories
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to create magical stories
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
          
          <Button 
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
          >
            <Github className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </Button>
        </div>

        {isLoading && (
          <div className="text-center text-sm text-gray-500">
            Loading...
          </div>
        )}
      </motion.div>
    </div>
  );
}
