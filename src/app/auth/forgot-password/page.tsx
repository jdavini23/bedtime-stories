'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ForgotPassword from '@/components/auth/ForgotPassword';

export default function ForgotPasswordPage() {
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
          <h2 className="text-3xl font-bold text-white mb-2">Reset your password</h2>
          <p className="text-gray-400">We'll send you a link to reset your password</p>
        </div>

        {/* Forgot password form */}
        <div className="mb-6">
          <ForgotPassword />
        </div>

        {/* Back to sign in */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-violet-400 hover:text-violet-300 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
