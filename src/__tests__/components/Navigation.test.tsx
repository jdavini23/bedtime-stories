import { render, screen } from '@testing-library/react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@clerk/nextjs';

// Mock the hooks and components
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/components/ThemeToggleWrapper', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));
jest.mock('@/components/auth/UserProfileMenu', () => ({
  UserProfileMenu: () => <div data-testid="user-profile-menu">User Profile Menu</div>,
}));
jest.mock('@/components/auth/SignInButton', () => ({
  SignInButton: () => <div data-testid="sign-in-button">Sign In</div>,
}));

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the app name', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });

    render(<Navigation />);

    expect(screen.getByText('Step Into Story Time')).toBeInTheDocument();
  });

  it('renders links for signed-out users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });

    render(<Navigation />);

    expect(screen.getByText('Try It Out')).toBeInTheDocument();
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Create Story')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-profile-menu')).not.toBeInTheDocument();
  });

  it('renders links for signed-in users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });

    render(<Navigation />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Story')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('user-profile-menu')).toBeInTheDocument();
    expect(screen.queryByText('Try It Out')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: false,
      isSignedIn: undefined,
    });

    render(<Navigation />);

    // When not loaded, it should not show any auth-dependent links
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Create Story')).not.toBeInTheDocument();
    expect(screen.queryByText('Try It Out')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument();

    // But it should still show the app name
    expect(screen.getByText('Step Into Story Time')).toBeInTheDocument();
  });
});
