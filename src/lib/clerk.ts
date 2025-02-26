import { ClerkProvider, User } from '@clerk/nextjs';

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
}

interface UserPublicMetadata {
  role?: 'admin' | 'user';
}

export const clerkConfig = {
  publishableKey: clerkPubKey,
};

// Removed isAdmin function - moved to utils/auth.ts

export { ClerkProvider };
