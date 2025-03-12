import { render, screen } from '@testing-library/react';
import { createServerClient } from '@supabase/ssr';
import { describe, expect, it, vi } from 'vitest';
import AdminPage from '@/app/admin/page';
import { redirect } from 'next/navigation';

// Mock the Supabase auth and Next.js navigation
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-admin-id',
            email: 'admin@example.com',
            user_metadata: {
              full_name: 'Admin User',
              avatar_url: 'https://example.com/admin-avatar.png',
              role: 'admin',
            },
          },
        },
        error: null,
      }),
      admin: {
        getUserById: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'test-admin-id',
              email: 'admin@example.com',
              user_metadata: {
                full_name: 'Admin User',
                avatar_url: 'https://example.com/admin-avatar.png',
                role: 'admin',
              },
            },
          },
          error: null,
        }),
      },
    },
  })),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('AdminPage', () => {
  it('renders admin dashboard for admin users', async () => {
    render(await AdminPage());
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  it('redirects non-admin users to home', async () => {
    vi.mocked(createServerClient).mockImplementationOnce(() => ({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'test-user-id',
              email: 'user@example.com',
              user_metadata: {
                full_name: 'Regular User',
                role: 'user',
              },
            },
          },
          error: null,
        }),
        admin: {
          getUserById: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'test-user-id',
                email: 'user@example.com',
                user_metadata: {
                  full_name: 'Regular User',
                  role: 'user',
                },
              },
            },
            error: null,
          }),
        },
      },
    }));

    await AdminPage();
    expect(vi.mocked(redirect)).toHaveBeenCalledWith('/');
  });
});
