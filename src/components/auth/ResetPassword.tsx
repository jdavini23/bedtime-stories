'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { logger } from '@/utils/logger';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { supabase } = useSupabase();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      logger.info('Password reset successful');
      router.push(
        '/auth/login?message=Password reset successful. Please sign in with your new password.'
      );
    } catch (error: any) {
      logger.error('Password reset error', { error });
      setError(error?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-dreamy p-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-midnight dark:text-text-primary">Reset Password</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your new password</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            New Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Confirm New Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90"
          disabled={isLoading}
        >
          {isLoading ? 'Resetting password...' : 'Reset Password'}
        </Button>
      </form>
    </motion.div>
  );
}
