import Link from 'next/link';
import ThemeToggleWrapper from './ThemeToggleWrapper';
import { UserProfileMenu } from './auth/UserProfileMenu';
import { SignInButton } from './auth/SignInButton';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const { isLoaded, isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-midnight shadow-sm">
      <Link href="/" className="text-xl font-bold text-text-secondary dark:text-text-primary">
        Step Into Story Time
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        {!isLoaded ? (
          // Loading state - only show theme toggle
          <ThemeToggleWrapper />
        ) : isSignedIn ? (
          // Signed in state
          <>
            <Link
              href="/dashboard"
              className="text-text-secondary dark:text-text-primary hover:text-primary dark:hover:text-primary-light"
            >
              Dashboard
            </Link>
            <Link
              href="/story"
              className="text-text-secondary dark:text-text-primary hover:text-primary dark:hover:text-primary-light"
            >
              Create Story
            </Link>
            <ThemeToggleWrapper />
            <UserProfileMenu />
          </>
        ) : (
          // Signed out state
          <>
            <Link
              href="/story"
              className="text-text-secondary dark:text-text-primary hover:text-primary dark:hover:text-primary-light"
            >
              Try It Out
            </Link>
            <ThemeToggleWrapper />
            <SignInButton />
          </>
        )}
      </div>

      {/* Mobile Menu Button - only visible on small screens */}
      <div className="flex md:hidden items-center gap-2">
        <ThemeToggleWrapper />
        {isLoaded && isSignedIn && <UserProfileMenu />}
        {isLoaded && !isSignedIn && <SignInButton />}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-text-secondary dark:text-text-primary"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-midnight shadow-md z-50">
          <div className="flex flex-col p-4 space-y-4">
            {isLoaded && isSignedIn ? (
              // Signed in mobile links
              <>
                <Link
                  href="/dashboard"
                  className="text-text-secondary dark:text-text-primary hover:text-primary dark:hover:text-primary-light"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/story"
                  className="text-text-secondary dark:text-text-primary hover:text-primary dark:hover:text-primary-light"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Story
                </Link>
              </>
            ) : (
              // Signed out mobile links
              <Link
                href="/story"
                className="text-text-secondary dark:text-text-primary hover:text-primary dark:hover:text-primary-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                Try It Out
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
