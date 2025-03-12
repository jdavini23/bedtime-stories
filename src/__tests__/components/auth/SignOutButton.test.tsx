import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';

// Mock the hooks
jest.mock('@/providers/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SignOutButton', () => {
  const mockSignOut = jest.fn();
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSupabase as jest.Mock).mockReturnValue({
      supabase: {
        auth: {
          signOut: mockSignOut,
        },
      },
    });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, refresh: mockRefresh });
  });

  it('renders with default props', () => {
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: 'Sign Out' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-variant', 'ghost');
  });

  it('renders with custom text', () => {
    render(<SignOutButton>Logout</SignOutButton>);

    const button = screen.getByRole('button', { name: 'Logout' });
    expect(button).toBeInTheDocument();
  });

  it('applies custom variant', () => {
    render(<SignOutButton variant="primary" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'primary');
  });

  it('calls signOut when clicked', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    render(<SignOutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText('Signing out...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles sign out error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSignOut.mockResolvedValue({ error: new Error('Sign out failed') });

    render(<SignOutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));
      expect(button).not.toBeDisabled();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });
});
