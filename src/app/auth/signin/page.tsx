'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Chrome, Github, Loader2 as Loader } from 'lucide-react';
import { logger } from '@/utils/loggerInstance';

import { Button } from '@/components/ui/Button';

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState({
    google: false,
    github: false,
  });

  const handleGoogleLogin = async () => {
    setIsLoading((prev) => ({ ...prev, google: true }));
    try {
      // TODO: Implement proper Google OAuth login
      // For now, throwing error to indicate missing implementation
      logger.error('Google login not implemented');
      router.push('/dashboard');
    } catch (error) {
      logger.error('Google Login Failed', { error });
      router.push('/auth/error?error=OAuthSignin');
    } finally {
      setIsLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading((prev) => ({ ...prev, github: true }));
    try {
      // TODO: Implement proper GitHub OAuth login
      // For now, throwing error to indicate missing implementation
      logger.error('GitHub login not implemented');
      router.push('/dashboard');
    } catch (error) {
      logger.error('GitHub Login Failed', { error });
      router.push('/auth/error?error=OAuthSignin');
    } finally {
      setIsLoading((prev) => ({ ...prev, github: false }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome to Bedtime Stories</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to create magical stories</p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading.google}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            {isLoading.google ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-5 w-5" />
            )}
            Continue with Google
          </Button>

          <Button
            onClick={handleGithubLogin}
            disabled={isLoading.github}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            {isLoading.github ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-5 w-5" />
            )}
            Continue with GitHub
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
