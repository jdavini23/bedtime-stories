import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { SignOutButton } from './SignOutButton';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfileMenu() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) {
    return <Skeleton data-testid="loading-skeleton" className="h-10 w-10 rounded-full" />;
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const displayName = user
    ? `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim() ||
      user.email ||
      'User'
    : 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = displayName?.charAt(0) || 'U';

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar>
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="Profile" />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{displayName}</span>
      </button>

      <div
        data-testid="user-dropdown"
        className={cn(
          'absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5',
          'transition-all duration-200 ease-in-out transform',
          'invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0'
        )}
      >
        <div className="px-4 py-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Profile
          </Link>
          {user?.user_metadata?.isAdmin && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Admin Panel
            </Link>
          )}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
