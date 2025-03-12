'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { logger } from '@/utils/logger';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { signUp, user } = useSupabase();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { user, session } = await signUp(email, password);
      
      if (user) {
        if (user.identities?.length === 0) {
          // User already exists
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          // Check if email confirmation is required
          if (session) {
            logger.info('User signed up and logged in successfully');
            router.push('/');
          } else {
            logger.info('User signed up successfully, email confirmation required');
            setSuccessMessage('Registration successful! Please check your email to confirm your account.');
          }
        }
      }
    } catch (error: any) {
      logger.error('Registration error', { error });
      setError(error?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-dreamy p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-midnight dark:text-text-primary">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join us and start creating personalized stories
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}