import React, { ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { cn } from '@/lib/utils';
import { themeClasses } from '@/config/theme';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4',
        themeClasses.backgroundGradient
      )}
      role="main"
      aria-labelledby="auth-title"
    >
      <Container size="small">
        <motion.div
          className={cn(
            'w-full bg-white shadow-2xl rounded-2xl overflow-hidden',
            themeClasses.card
          )}
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
              <h1 id="auth-title" className={cn('text-3xl font-bold', themeClasses.text)}>
                {title}
              </h1>
              {description && (
                <p className={cn('mt-2', themeClasses.textMuted)} role="doc-subtitle">
                  {description}
                </p>
              )}
            </header>
            <main role="main">{children}</main>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};
