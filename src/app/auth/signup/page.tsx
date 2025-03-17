'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Spinner from '@/components/ui/Spinner';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { logger } from '@/utils/logger';

interface FormData {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  acceptTerms?: string;
  general?: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms of Service and Privacy Policy';
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
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        logger.error('Sign up error:', error);
        setErrors({
          general: error.message || 'Unable to create account. Please try again.',
        });
        return;
      }

      logger.info('User signed up successfully');
      router.push('/auth/verify-email');
    } catch (error) {
      logger.error('Unexpected error during sign up:', error);
      setErrors({
        general: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and app icon */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">Step Into Storytime</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
          <p className="text-gray-400">Start your storytelling journey today</p>
        </div>

        {/* Sign-up form */}
        <div className="bg-[#14181F] rounded-2xl p-8 mb-6">
          {errors.general && (
            <div className="p-3 mb-6 text-sm text-red-500 bg-red-950/50 rounded-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Full name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`h-12 bg-[#1C2027] border-0 text-white placeholder-gray-400 ${
                  errors.name ? 'ring-1 ring-red-500' : ''
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
                required
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`h-12 bg-[#1C2027] border-0 text-white placeholder-gray-400 ${
                  errors.password ? 'ring-1 ring-red-500' : ''
                }`}
                placeholder="Create a password"
                disabled={isLoading}
                required
              />
              <p className={`text-xs ${errors.password ? 'text-red-500' : 'text-gray-400'}`}>
                Must be at least 8 characters long
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))
                }
                className={`mt-1 ${errors.acceptTerms ? 'ring-1 ring-red-500' : ''}`}
                disabled={isLoading}
              />
              <Label
                htmlFor="acceptTerms"
                className={`text-sm ${
                  errors.acceptTerms ? 'text-red-500' : 'text-gray-400'
                } font-normal cursor-pointer`}
              >
                I agree to the{' '}
                <Link href="/terms" className="text-violet-400 hover:text-violet-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-violet-400 hover:text-violet-300">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500 mt-1">{errors.acceptTerms}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" /> Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </div>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
