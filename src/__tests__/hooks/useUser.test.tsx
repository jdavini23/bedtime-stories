import { renderHook, act } from '@testing-library/react';
import { useUser, User } from '@/hooks/useUser';
import { useUser as useClerkUser, useAuth } from '@clerk/nextjs';
import { isAdmin } from '@/utils/auth';

// Mock Clerk hooks
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  useAuth: jest.fn(),
}));

// Mock auth utilities
jest.mock('@/utils/auth', () => ({
  isAdmin: jest.fn(),
}));

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns loading state when Clerk is loading', () => {
    (useClerkUser as jest.Mock).mockReturnValue({
      isLoaded: false,
      user: null,
    });
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: false,
      isSignedIn: false,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('returns signed out state when user is not signed in', () => {
    (useClerkUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: null,
    });
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('transforms Clerk user data correctly when signed in', () => {
    const mockClerkUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
      imageUrl: 'https://example.com/avatar.jpg',
      emailAddresses: [
        {
          emailAddress: 'john@example.com',
          verification: { status: 'verified' },
        },
      ],
      publicMetadata: { isAdmin: true },
    };

    (useClerkUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: mockClerkUser,
    });
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });
    (isAdmin as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useUser());

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.user).toEqual({
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
      imageUrl: 'https://example.com/avatar.jpg',
      email: 'john@example.com',
      isAdmin: true,
    } as User);
  });

  it('handles users with no email addresses', () => {
    const mockClerkUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
      imageUrl: 'https://example.com/avatar.jpg',
      emailAddresses: [],
      publicMetadata: {},
    };

    (useClerkUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: mockClerkUser,
    });
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });
    (isAdmin as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useUser());

    expect(result.current.user?.email).toBeUndefined();
    expect(result.current.user?.isAdmin).toBe(false);
  });

  it('handles users with unverified email addresses', () => {
    const mockClerkUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
      emailAddresses: [
        {
          emailAddress: 'john@example.com',
          verification: { status: 'unverified' },
        },
      ],
    };

    (useClerkUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: mockClerkUser,
    });
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });
    (isAdmin as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useUser());

    // Should still include the email even if unverified
    expect(result.current.user?.email).toBe('john@example.com');
  });
});
