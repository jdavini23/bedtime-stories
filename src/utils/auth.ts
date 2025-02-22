import type { User } from '@clerk/nextjs/server';

export const isAdmin = (user: User | null | undefined): boolean => {
  return user?.publicMetadata?.role === 'admin';
};
