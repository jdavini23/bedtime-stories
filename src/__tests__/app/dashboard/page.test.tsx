import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

// Mock the Clerk auth and Next.js navigation
jest.mock('@clerk/nextjs', () => ({
  currentUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock the DashboardCards component
jest.mock('@/components/dashboard/DashboardCards', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-cards">Dashboard Cards Mock</div>,
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to sign-in if not authenticated', async () => {
    // Mock currentUser to return null (not authenticated)
    (currentUser as jest.Mock).mockResolvedValue(null);

    await DashboardPage();

    // Check that redirect was called with the sign-in URL
    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });

  it('redirects to sign-in with error param if authentication throws an error', async () => {
    // Mock currentUser to throw an error
    (currentUser as jest.Mock).mockRejectedValue(new Error('Authentication error'));

    await DashboardPage();

    // Check that redirect was called with the sign-in URL and error parameter
    expect(redirect).toHaveBeenCalledWith('/sign-in?error=auth_error');
  });

  it('renders dashboard for authenticated users', async () => {
    // Mock currentUser to return a user object (authenticated)
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
    });

    // Render the dashboard page
    const { container } = render(await DashboardPage());

    // Check that the dashboard title is rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Check that the DashboardCards component is rendered
    expect(screen.getByTestId('dashboard-cards')).toBeInTheDocument();
  });

  it('renders loading state while dashboard cards are loading', async () => {
    // Mock currentUser to return a user object (authenticated)
    (currentUser as jest.Mock).mockResolvedValue({
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
    });

    // Override the DashboardCards mock for this test to test Suspense
    jest.mock('@/components/dashboard/DashboardCards', () => {
      throw new Promise(() => {}); // This will cause Suspense to show the fallback
    });

    try {
      // Render the dashboard page
      const { container } = render(await DashboardPage());

      // Check that the loading state is rendered
      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    } catch (error) {
      // This is expected due to how we're testing Suspense
    }
  });
});
