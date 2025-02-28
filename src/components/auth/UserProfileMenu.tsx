'use client';

import { User, useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { SignOutButton } from './SignOutButton';
import { getUserDisplayName } from '@/utils/auth';

export function UserProfileMenu() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div
        data-testid="loading-skeleton"
        className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"
      ></div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="flex space-x-2">
        <Link
          href="/sign-in"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div data-testid="profile-container" className="flex items-center space-x-2 cursor-pointer">
        {user.imageUrl ? (
          <img src={user.imageUrl} alt="Profile" className="h-10 w-10 rounded-full" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
            {user.firstName?.[0] || user.lastName?.[0] || 'U'}
          </div>
        )}
        <span className="text-sm font-medium hidden md:block">{getUserDisplayName(user)}</span>
      </div>

      {/* Dropdown menu */}
      <div
        data-testid="user-dropdown"
        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
      >
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium">{getUserDisplayName(user)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.id}</p>
        </div>

        <Link
          href="/dashboard"
          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/profile"
          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Profile
        </Link>

        {user.isAdmin && (
          <Link
            href="/admin"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Admin Panel
          </Link>
        )}

        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
          <div className="px-4 py-2">
            <SignOutButton
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-0"
            >
              Sign Out
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
}
