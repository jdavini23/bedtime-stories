'use client';

import { SignUp } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us to start creating magical bedtime stories
          </p>
        </div>

        <div className="mt-8">
          <SignUp
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
            redirectUrl="/dashboard"
            routing="path"
            path="/sign-up"
          />
        </div>
      </motion.div>
    </div>
  );
}
