import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <Link href="/" className="text-xl font-bold">
        Step Into Story Time
      </Link>

      <div className="flex items-center gap-4">
        <SignedIn>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/stories">My Stories</Link>
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
          <Link href="/sign-in" className="px-4 py-2 rounded-md bg-blue-500 text-white">
            Sign in
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
}
