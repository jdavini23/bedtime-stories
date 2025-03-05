'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggleWrapper from '@/components/ThemeToggleWrapper';
import { SignInButton } from '@/components/auth/SignInButton';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';

interface NavBarProps {
  isScrolled: boolean;
  scrollProgress: number;
}

export function NavBar({ isScrolled, scrollProgress }: NavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 dark:bg-midnight/90 shadow-md backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/illustrations/book-magic.svg"
                alt="Step Into Story Time"
                width={32}
                height={32}
                className="mr-2"
              />
              <span className={`font-bold text-lg ${
                isScrolled ? 'text-primary' : 'text-midnight dark:text-text-primary'
              }`}>
                Step Into Story Time
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#how-it-works"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-text-secondary hover:text-primary dark:text-text-primary/70 dark:hover:text-primary'
                  : 'text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary'
              }`}
            >
              How It Works
            </a>
            <a
              href="#features"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-text-secondary hover:text-primary dark:text-text-primary/70 dark:hover:text-primary'
                  : 'text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary'
              }`}
            >
              Features
            </a>
            <ThemeToggleWrapper />
            {isLoaded ? (
              isSignedIn ? (
                <SignOutButton variant="outline" size="sm" className="mr-2">
                  Sign Out
                </SignOutButton>
              ) : (
                <SignInButton variant="outline" size="sm" className="mr-2">
                  Sign In
                </SignInButton>
              )
            ) : (
              <SignInButton variant="outline" size="sm" className="mr-2">
                Sign In
              </SignInButton>
            )}
            <Link href="/story">
              <Button size="sm" className="ml-2">
                Start Your Story
              </Button>
            </Link>
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-primary' : 'text-midnight dark:text-text-primary'}`}
              aria-label="Open main menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="h-1 w-full bg-lavender/10 dark:bg-lavender/20">
          <div
            className="h-1 bg-gradient-to-r from-primary to-golden transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:!hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="fixed inset-0 bg-black/25 backdrop-blur-sm md:!hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-midnight p-6 shadow-xl md:!hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-primary">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-text-secondary"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
                <a
                  href="#how-it-works"
                  className="px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <div className="flex justify-center my-2">
                  <ThemeToggleWrapper />
                </div>
                {isLoaded ? (
                  isSignedIn ? (
                    <SignOutButton variant="outline" fullWidth className="mb-2">
                      Sign Out
                    </SignOutButton>
                  ) : (
                    <SignInButton variant="outline" fullWidth className="mb-2">
                      Sign In
                    </SignInButton>
                  )
                ) : (
                  <SignInButton variant="outline" fullWidth className="mb-2">
                    Sign In
                  </SignInButton>
                )}
                <Link href="/story" className="mt-2" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Start Your Story</Button>
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}