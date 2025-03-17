'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/Spinner';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { logger } from '@/utils/logger';

interface FormErrors {
  email?: string;
  general?: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { supabase } = useSupabase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear errors when user starts typing
    if (errors.email || errors.general) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        logger.error('Password reset error:', error);
        setErrors({
          general: 'Unable to send reset link. Please try again.',
        });
        return;
      }

      setIsSuccess(true);
      logger.info('Password reset email sent successfully');
    } catch (error) {
      logger.error('Unexpected error during password reset:', error);
      setErrors({
        general: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#14181F] rounded-2xl p-8">
      {errors.general && (
        <div className="p-3 mb-6 text-sm text-red-500 bg-red-950/50 rounded-md">
          {errors.general}
        </div>
      )}

      {isSuccess ? (
        <div className="p-3 text-sm text-green-500 bg-green-950/50 rounded-md">
          Reset link sent! Please check your email to continue.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              className={`h-12 bg-[#1C2027] border-0 text-white placeholder-gray-400 ${
                errors.email ? 'ring-1 ring-red-500' : ''
              }`}
              placeholder="Enter your email address"
              disabled={isLoading}
              required
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" /> Sending reset link...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
