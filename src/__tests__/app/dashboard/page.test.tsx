import { render, screen } from '@testing-library/react';
import { createBrowserClient } from '@supabase/ssr';
import { describe, expect, it, vi } from 'vitest';
import DashboardPage from '@/app/dashboard/page';

// Mock the Supabase auth and Next.js navigation
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {
              full_name: 'Test User',
              avatar_url: 'https://example.com/avatar.png',
            },
          },
        },
        error: null,
      }),
    },
  })),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}));

describe('DashboardPage', () => {
  it('renders dashboard content for authenticated user', async () => {
    render(<DashboardPage />);
    expect(await screen.findByText(/Welcome/i)).toBeInTheDocument();
  });
});
