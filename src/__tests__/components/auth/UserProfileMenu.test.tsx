import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfileMenu } from '@/components/auth/UserProfileMenu';
import { useUser } from '@/hooks/useUser';
import { getUserDisplayName } from '@/utils/auth';

// Mock the hooks and utilities
jest.mock('@/hooks/useUser');
jest.mock('@/utils/auth', () => ({
  getUserDisplayName: jest.fn(),
}));

// Mock the SignOutButton component
jest.mock('@/components/auth/SignOutButton', () => ({
  SignOutButton: ({ children, ...props }: any) => (
    <button data-testid="mock-sign-out-button" {...props}>
      {children || 'Sign Out'}
    </button>
  ),
}));

describe('UserProfileMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getUserDisplayName as jest.Mock).mockReturnValue('John Doe');
  });

  it('renders loading state when not loaded', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: false,
      isSignedIn: false,
      user: null,
    });

    render(<UserProfileMenu />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders sign in/sign up links when not signed in', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      user: null,
    });

    render(<UserProfileMenu />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders user profile with image when signed in and image available', () => {
    const mockUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
      imageUrl: 'https://example.com/avatar.jpg',
    };

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    });

    render(<UserProfileMenu />);

    const profileImage = screen.getByAltText('Profile');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', mockUser.imageUrl);
    // Use getAllByText since the name appears multiple times
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
  });

  it('renders user profile with initials when signed in but no image', () => {
    const mockUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
    };

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    });

    render(<UserProfileMenu />);

    const initialsAvatar = screen.getByText('J');
    expect(initialsAvatar).toBeInTheDocument();
    // Use getAllByText since the name appears multiple times
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
  });

  it('shows dropdown menu on hover', () => {
    const mockUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
      isAdmin: false,
    };

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    });

    render(<UserProfileMenu />);

    // Get the dropdown element
    const dropdown = screen.getByTestId('user-dropdown');

    // Initially it should have the invisible class
    expect(dropdown).toHaveClass('invisible');

    // We can't actually test the hover state with testing-library
    // since it's CSS-based with group-hover. Instead, we'll verify
    // the dropdown exists and has the right classes for hover behavior
    expect(dropdown).toHaveClass('group-hover:opacity-100');
    expect(dropdown).toHaveClass('group-hover:visible');
  });

  it('includes admin panel link for admin users', () => {
    const mockUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
      isAdmin: true,
    };

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    });

    render(<UserProfileMenu />);

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('does not include admin panel link for non-admin users', () => {
    const mockUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
      isAdmin: false,
    };

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    });

    render(<UserProfileMenu />);

    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('includes sign out button in dropdown', () => {
    const mockUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
    };

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    });

    render(<UserProfileMenu />);

    expect(screen.getByTestId('mock-sign-out-button')).toBeInTheDocument();
  });
});
