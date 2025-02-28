'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your storytelling journey
          </p>
        </div>

        <div className="mt-8">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-white/80 backdrop-blur-sm shadow-xl border-0',
                headerTitle: 'text-2xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-600',
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                footerAction: 'text-gray-600',
                footerActionLink: 'text-blue-600 hover:text-blue-700',
              },
            }}
            routing="path"
            path="/sign-in"
            redirectUrl="/dashboard"
          />
        </div>
      </motion.div>
    </div>
  );
}
