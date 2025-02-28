import Link from 'next/link';
import ThemeToggleWrapper from './ThemeToggleWrapper';
import { UserProfileMenu } from './auth/UserProfileMenu';
import { SignInButton } from './auth/SignInButton';
import { useAuth } from '@clerk/nextjs';

export default function Navigation() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-midnight shadow-sm">
      <Link href="/" className="text-xl font-bold text-text-secondary dark:text-text-primary">
        Step Into Story Time
      </Link>

      <div className="flex items-center gap-4">
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
    </nav>
  );
}
