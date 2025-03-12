'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/auth/SignOutButton';

export function Header() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();

  // Don't show header on auth pages
  if (pathname?.startsWith('/sign-')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Bedtime Stories</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/stories">Stories</Link>
            <Link href="/about">About</Link>
            {isSignedIn && <Link href="/dashboard">Dashboard</Link>}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isLoaded && !isSignedIn && (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
          {isSignedIn && (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <SignOutButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
