'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { Button } from './Button';

export function Navigation() {
  const { user, signOut, loading } = useSupabase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Ensure hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      // No need to manually redirect, the auth state change will trigger 
      // the router refresh in SupabaseAuthProvider
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-primary dark:text-primary-light">Bedtime Stories</span>
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Desktop navigation links */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link 
            href="/" 
            className={`px-3 py-2 rounded-md ${
              pathname === '/' 
                ? 'text-primary dark:text-primary-light font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/story" 
            className={`px-3 py-2 rounded-md ${
              pathname === '/story' 
                ? 'text-primary dark:text-primary-light font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light'
            }`}
          >
            Create Story
          </Link>
          
          {/* Auth buttons */}
          {loading ? (
            <div className="animate-pulse h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link href="/profile">
                <Button variant="outline" size="sm">Profile</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg py-2">
          <Link 
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-4 py-2 ${
              pathname === '/' 
                ? 'text-primary dark:text-primary-light font-medium' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/story"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-4 py-2 ${
              pathname === '/story' 
                ? 'text-primary dark:text-primary-light font-medium' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Create Story
          </Link>
          
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="px-4 py-2">
                <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : user ? (
              <>
                <Link 
                  href="/profile" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300"
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-600 dark:text-gray-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}