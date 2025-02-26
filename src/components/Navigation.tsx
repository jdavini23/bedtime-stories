import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import ThemeToggleWrapper from './ThemeToggleWrapper';

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-midnight shadow-sm">
      <Link href="/" className="text-xl font-bold text-text-secondary dark:text-text-primary">
        Step Into Story Time
      </Link>

      <div className="flex items-center gap-4">
        <SignedIn>
          <Link
            href="/dashboard"
            className="text-text-secondary dark:text-text-primary hover:text-primary dark:hover:text-primary-light"
          >
            Dashboard
          </Link>
          <Link
            href="/stories"
            className="text-text-secondary dark:text-text-primary hover:text-primary dark:hover:text-primary-light"
          >
            My Stories
          </Link>
          <ThemeToggleWrapper />
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <ThemeToggleWrapper />
          <Link href="/sign-in" className="px-4 py-2 rounded-md bg-blue-500 text-white">
            Sign in
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
}
