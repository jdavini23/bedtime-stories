'use client';

import Link from 'next/link';
import ThemeToggleWrapper from '@/components/ThemeToggleWrapper';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Menu, X } from 'lucide-react';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NavigationProps {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrollProgress: number;
}

export default function Navigation({
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollProgress,
}: NavigationProps) {
  const pathname = usePathname();
  const { user, signOut } = useSupabase();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderNavLinks = (isMobile: boolean) => {
    const links = [
      { href: '/#how-it-works', label: 'How It Works' },
      { href: '/#features', label: 'Features' },
      { href: '/#pricing', label: 'Pricing' },
    ];

    return links.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className={`${
          pathname === href
            ? 'text-primary font-medium'
            : 'text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary'
        } transition-colors ${isMobile ? 'text-2xl py-2' : ''}`}
        onClick={() => isMobile && setMobileMenuOpen(false)}
      >
        {label}
      </Link>
    ));
  };

  const renderAuthButtons = (isMobile: boolean) => (
    <>
      {user ? (
        <Button
          variant="primary"
          onClick={handleSignOut}
          className={isMobile ? 'w-full justify-center text-xl py-6' : ''}
        >
          Sign Out
        </Button>
      ) : (
        <Link href="/sign-in" className={isMobile ? 'w-full' : ''}>
          <Button
            variant="primary"
            className={isMobile ? 'w-full justify-center text-xl py-6' : ''}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Sign In
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-midnight/80 backdrop-blur-md shadow-sm' : ''
      }`}
    >
      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-golden to-dreamy"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            StoryTime
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {renderNavLinks(false)}
            {renderAuthButtons(false)}
          </div>

          {/* Theme Toggle - Visible on all screens */}
          <div className="flex items-center">
            <ThemeToggleWrapper />
            {/* Mobile Menu Button - Only visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-4"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-0 top-[73px] z-50 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="min-h-screen bg-white/95 dark:bg-midnight/95 backdrop-blur-md p-6">
            <div className="flex flex-col items-center space-y-6">
              {renderNavLinks(true)}
              {renderAuthButtons(true)}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
