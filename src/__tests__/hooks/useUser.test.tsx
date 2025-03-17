import { renderHook } from '@testing-library/react';
import { useUser } from '@/hooks/useUser';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { User } from '@supabase/supabase-js';

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: () => ({
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      }),
      signOut: () => Promise.resolve({ error: null }),
    },
  }),
}));

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default values', async () => {
    const { result } = renderHook(() => useUser());

    expect(result.current.user).toBe(null);
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isSignedIn).toBe(false);
    expect(typeof result.current.signOut).toBe('function');
  });

  it('updates state when session is available', async () => {
    const mockUser: User = {
      id: '123',
      email: 'test@example.com',
      created_at: '2024-03-14',
      app_metadata: {},
      user_metadata: {
        firstName: 'Test',
        lastName: 'User',
        isAdmin: false,
      },
      aud: 'authenticated',
      confirmed_at: '2024-03-14',
    };

    vi.mock('@supabase/ssr', () => ({
      createBrowserClient: () => ({
        auth: {
          getSession: () =>
            Promise.resolve({
              data: { session: { user: mockUser } },
              error: null,
            }),
          onAuthStateChange: () => ({
            data: {
              subscription: {
                unsubscribe: vi.fn(),
              },
            },
          }),
          signOut: () => Promise.resolve({ error: null }),
        },
      }),
    }));

    const { result } = renderHook(() => useUser());

    // Wait for state updates
    await vi.waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.user?.id).toBe(mockUser.id);
    expect(result.current.isSignedIn).toBe(true);
  });

  it('handles sign out successfully', async () => {
    const { result } = renderHook(() => useUser());

    await result.current.signOut();

    expect(result.current.user).toBe(null);
    expect(result.current.isSignedIn).toBe(false);
  });

  it('cleans up subscription on unmount', () => {
    const unsubscribeMock = vi.fn();

    vi.mock('@supabase/ssr', () => ({
      createBrowserClient: () => ({
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({
            data: {
              subscription: {
                unsubscribe: unsubscribeMock,
              },
            },
          }),
        },
      }),
    }));

    const { unmount } = renderHook(() => useUser());
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
