'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';

export default function SignInPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithGithub } = useAuth();
  const [isLoading, setIsLoading] = useState({
    google: false,
    github: false
  });

  const handleGoogleLogin = async () => {
    setIsLoading(prev => ({ ...prev, google: true }));
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Google Login Failed', error);
      router.push('/auth/error?error=OAuthSignin');
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(prev => ({ ...prev, github: true }));
    try {
      await loginWithGithub();
      router.push('/dashboard');
    } catch (error) {
      console.error('GitHub Login Failed', error);
      router.push('/auth/error?error=OAuthSignin');
    } finally {
      setIsLoading(prev => ({ ...prev, github: false }));
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Bedtime Stories
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to create magical stories
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button 
            onClick={handleGoogleLogin}
            disabled={isLoading.google}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            {isLoading.google ? (
              <LucideIcons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LucideIcons.Chrome className="mr-2 h-5 w-5" />
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
              <LucideIcons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LucideIcons.GithubIcon className="mr-2 h-5 w-5" />
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
