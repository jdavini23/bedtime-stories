import React, { ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4"
      role="main"
      aria-labelledby="auth-title"
    >
      <motion.div
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        role="region"
        aria-label="Authentication Form"
      >
        <div className="p-8">
          <header className="text-center mb-6" role="banner">
            <Image
              src="/logo.png"
              alt="Bedtime Stories Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <h1 id="auth-title" className="text-3xl font-bold text-gray-800">
              {title}
            </h1>
            {description && (
              <p className="text-gray-600 mt-2" role="doc-subtitle">
                {description}
              </p>
            )}
          </header>
          <main role="main">{children}</main>
        </div>
      </motion.div>
    </div>
  );
};
