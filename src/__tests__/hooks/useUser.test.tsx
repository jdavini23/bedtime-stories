import { renderHook, act } from '@testing-library/react';
import { useUser } from '@/hooks/useUser';
import { useSupabase } from '@/providers/SupabaseProvider';
import { type User } from '@supabase/supabase-js';

// Mock Supabase provider
jest.mock('@/providers/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}));

describe('useUser', () => {
  const mockUser: User = {
    id: 'user_123',
    email: 'test@example.com',
    email_confirmed_at: '2024-03-12T00:00:00.000Z',
    phone: '',
    created_at: '2024-03-12T00:00:00.000Z',
    user_metadata: {
      firstName: 'John',
      lastName: 'Doe',
      avatar_url: 'https://example.com/avatar.jpg',
      isAdmin: false,
    },
    app_metadata: {},
    aud: 'authenticated',
    role: '',
  };

  const mockGetUser = jest.fn();
  const mockOnAuthStateChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });

    (useSupabase as jest.Mock).mockReturnValue({
      supabase: {
        auth: {
          getUser: mockGetUser,
          onAuthStateChange: mockOnAuthStateChange,
        },
      },
    });
  });

  it('initializes with loading state', () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { result } = renderHook(() => useUser());

    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('handles successful user fetch', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    const { result } = renderHook(() => useUser());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      firstName: mockUser.user_metadata.firstName,
      lastName: mockUser.user_metadata.lastName,
      imageUrl: mockUser.user_metadata.avatar_url,
      isAdmin: mockUser.user_metadata.isAdmin,
    });
  });

  it('handles user fetch error', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Failed to fetch user'),
    });

    const { result } = renderHook(() => useUser());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('updates user state on auth state change', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const { result } = renderHook(() => useUser());

    await act(async () => {
      const authStateCallback = mockOnAuthStateChange.mock.calls[0][0];
      authStateCallback('SIGNED_IN', { user: mockUser });
    });

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      firstName: mockUser.user_metadata.firstName,
      lastName: mockUser.user_metadata.lastName,
      imageUrl: mockUser.user_metadata.avatar_url,
      isAdmin: mockUser.user_metadata.isAdmin,
    });
  });

  it('cleans up subscription on unmount', () => {
    const mockUnsubscribe = jest.fn();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    const { unmount } = renderHook(() => useUser());
    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
