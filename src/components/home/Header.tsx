import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggleWrapper from '@/components/ThemeToggleWrapper';
import { SignInButton } from '@/components/auth/SignInButton';
import { SignOutButton } from '@/components/auth/SignOutButton';

interface HeaderProps {
  isScrolled: boolean;
  scrollProgress: number;
  isSignedIn: boolean;
}

export function Header({ isScrolled, scrollProgress, isSignedIn }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop size
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-midnight/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      {/* Progress bar */}
      <div
        className="h-1 bg-gradient-to-r from-lavender via-primary to-dreamy transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            Bedtime Stories
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#preview"
              className="text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Preview
            </Link>
            <Link
              href="#faq"
              className="text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary transition-colors"
            >
              FAQ
            </Link>
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <SignOutButton />
              </>
            ) : (
              <SignInButton />
            )}
            <ThemeToggleWrapper />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggleWrapper />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-4 p-2 text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-midnight shadow-lg transition-transform duration-300 transform ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link
            href="#features"
            className="py-2 text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#preview"
            className="py-2 text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Preview
          </Link>
          <Link
            href="#faq"
            className="py-2 text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </Link>
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="py-2 text-text-secondary dark:text-text-primary/80 hover:text-primary dark:hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="py-2">
                <SignOutButton />
              </div>
            </>
          ) : (
            <div className="py-2">
              <SignInButton />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
