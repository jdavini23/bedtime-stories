// Temporarily mocking the auth utilities for development
// import type { User } from '@clerk/nextjs/server';

export const isAdmin = (user: any): boolean => {
  return user?.isAdmin === true;
};
