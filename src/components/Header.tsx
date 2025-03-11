'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggleWrapper from '@/components/ThemeToggleWrapper';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { useAuth } from '@clerk/nextjs';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const isMounted = { current: true };

    const handleScroll = () => {
      if (!isMounted.current) return;

      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollPosition / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      isMounted.current = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-background/80 dark:bg-midnight/80 backdrop-blur-sm shadow-sm' : ''
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          <span className="text-xl font-bold">Bedtime Stories</span>
        </div>

        <nav className={`md:flex items-center space-x-8 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <ThemeToggleWrapper />
          {isLoaded && isSignedIn && <SignOutButton />}
        </nav>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 bg-primary dark:bg-primary-light transition-all duration-200"
        style={{ width: `${scrollProgress}%` }}
      />
    </header>
  );
}
