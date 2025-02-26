// Temporarily mocking the useUser hook for development
// import { useUser as useClerkUser } from '@clerk/nextjs';
// import type { User as ClerkUser } from '@clerk/nextjs/server';
// import { isAdmin } from '../utils/auth';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  isAdmin?: boolean;
}

export const useUser = () => {
  // Mock user data for development
  const mockUser: User = {
    id: 'mock-user-id',
    firstName: 'Test',
    lastName: 'User',
    imageUrl: 'https://via.placeholder.com/150',
    isAdmin: false,
  };

  return {
    isLoaded: true,
    isSignedIn: true,
    user: mockUser,
  };
};
