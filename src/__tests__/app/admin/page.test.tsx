import { render, screen } from '@testing-library/react';
import AdminDashboardPage from '@/app/admin/page';
import { auth, getAuth } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/utils/auth';

// Mock the Clerk auth and Next.js navigation
jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(() => ({
    userId: 'test-user-id',
  })),
  currentUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('@/utils/auth', () => ({
  isAdmin: jest.fn(),
}));

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to sign-in if not authenticated', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: null });

    await AdminDashboardPage();

    expect(redirect).toHaveBeenCalledWith('/sign-in?redirect_url=/admin');
  });

  it('shows access denied for non-admin users', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 'user_123' });
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
    });
    (isAdmin as jest.Mock).mockReturnValue(false);

    const { container } = render(await AdminDashboardPage());

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText('You do not have permission to access the admin dashboard.')
    ).toBeInTheDocument();
    expect(screen.getByText('Return to Dashboard')).toBeInTheDocument();
  });

  it('renders admin dashboard for admin users', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 'user_123' });
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
    });
    (isAdmin as jest.Mock).mockReturnValue(true);

    const { container } = render(await AdminDashboardPage());

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();

    // Check for all admin cards
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Content Management')).toBeInTheDocument();
    expect(screen.getByText('System Settings')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('API Management')).toBeInTheDocument();
    expect(screen.getByText('System Logs')).toBeInTheDocument();

    // Check for links
    expect(screen.getByText('View Users →')).toBeInTheDocument();
    expect(screen.getByText('Manage Content →')).toBeInTheDocument();
    expect(screen.getByText('System Settings →')).toBeInTheDocument();
    expect(screen.getByText('View Analytics →')).toBeInTheDocument();
    expect(screen.getByText('Manage API Keys →')).toBeInTheDocument();
    expect(screen.getByText('View Logs →')).toBeInTheDocument();
    expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument();
  });
});
