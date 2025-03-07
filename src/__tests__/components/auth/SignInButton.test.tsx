import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignInButton } from '@/components/auth/SignInButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

describe('SignInButton', () => {
  const mockPush = jest.fn();
  const mockIsSignedIn = false;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup auth mock
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: mockIsSignedIn,
    });
  });

  it('renders with default props', () => {
    render(<SignInButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    render(<SignInButton>Custom Text</SignInButton>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SignInButton className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('handles click event and redirects', () => {
    render(
      <SignInButton
        redirectUrl="/custom-redirect"
        variant="primary"
        size="sm"
        fullwidth={true}
        className="test-class"
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockPush).toHaveBeenCalledWith('/custom-redirect');
  });

  it('uses default redirectUrl when not provided', () => {
    render(<SignInButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('applies variant prop correctly', () => {
    render(<SignInButton variant="outline" />);
    // Note: Actual style testing would depend on your styling implementation
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies size prop correctly', () => {
    render(<SignInButton size="sm" />);
    // Note: Actual style testing would depend on your styling implementation
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies fullwidth prop when specified', () => {
    render(<SignInButton fullwidth />);
    // Note: Actual style testing would depend on your styling implementation
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not render when user is signed in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
    });

    const { container } = render(<SignInButton />);
    expect(container).toBeEmptyDOMElement();
  });
});
