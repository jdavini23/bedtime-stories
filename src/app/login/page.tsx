'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithGoogle, signInWithGithub } from '@/lib/firebaseAuth';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setError(null);
      const loginMethod = provider === 'google' ? signInWithGoogle : signInWithGithub;
      
      const user = await loginMethod();
      
      if (user) {
        // Redirect to home or dashboard after successful login
        router.push('/');
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed`;
      
      setError(errorMessage);
      console.error(`${provider} login error:`, err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <motion.div 
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          Welcome Back
        </h2>

        {error && (
          <motion.div 
            className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <motion.button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FcGoogle className="text-2xl" />
            <span className="font-semibold text-gray-700">
              Continue with Google
            </span>
          </motion.button>

          <motion.button
            onClick={() => handleSocialLogin('github')}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white rounded-lg py-3 px-4 hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGithub className="text-2xl" />
            <span className="font-semibold">
              Continue with GitHub
            </span>
          </motion.button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-indigo-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-indigo-600 hover:underline">
            Privacy Policy
          </a>
        </div>
      </motion.div>
    </div>
  );
}
