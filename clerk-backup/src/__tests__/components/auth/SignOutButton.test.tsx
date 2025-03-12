import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Mock the hooks
jest.mock('@clerk/nextjs', () => ({
  useClerk: jest.fn(),
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
    (useClerk as jest.Mock).mockReturnValue({ signOut: mockSignOut });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, refresh: mockRefresh });
  });

  it('renders with default props', () => {
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: 'Sign Out' });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('border-primary');
    expect(button.className).toContain('text-primary');
  });

  it('renders with custom text', () => {
    render(<SignOutButton>Logout</SignOutButton>);

    const button = screen.getByRole('button', { name: 'Logout' });
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SignOutButton className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies custom variant and size', () => {
    render(<SignOutButton variant="primary" size="sm" />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-primary');
    expect(button.className).toContain('text-sm');
  });

  it('calls signOut when clicked', async () => {
    mockSignOut.mockImplementation((callback) => {
      if (callback) callback();
      return Promise.resolve();
    });

    render(<SignOutButton redirectUrl="/custom-redirect" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText('Signing out...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/custom-redirect');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles sign out error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSignOut.mockRejectedValue(new Error('Sign out failed'));

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
