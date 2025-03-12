import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignInButton } from '@/components/auth/SignInButton';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useSupabase } from '@/providers/SupabaseProvider';
import { describe, beforeEach, it, expect, vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock useUser hook
vi.mock('@/hooks/useUser');

// Mock useSupabase hook
vi.mock('@/providers/SupabaseProvider', () => ({
  useSupabase: vi.fn(),
}));

describe('SignInButton', () => {
  const mockPush = vi.fn();
  const mockSignInWithOAuth = vi.fn();

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup user mock
    (useUser as jest.Mock).mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
      user: null,
    });

    // Setup Supabase mock
    (useSupabase as jest.Mock).mockReturnValue({
      supabase: {
        auth: {
          signInWithOAuth: mockSignInWithOAuth,
        },
      },
    });

    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
      },
      writable: true,
    });
  });

  it('renders with default props', () => {
    render(<SignInButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    render(<SignInButton>Custom Text</SignInButton>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('renders with custom provider', () => {
    render(<SignInButton provider="google" />);
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('handles sign in with GitHub', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });

    render(<SignInButton provider="github" />);
    fireEvent.click(screen.getByRole('button'));

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    });
  });

  it('handles sign in with Google', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });

    render(<SignInButton provider="google" />);
    fireEvent.click(screen.getByRole('button'));

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    });
  });

  it('handles sign in error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSignInWithOAuth.mockResolvedValue({ error: new Error('Sign in failed') });

    render(<SignInButton />);
    fireEvent.click(screen.getByRole('button'));

    expect(mockSignInWithOAuth).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing in:', 'Sign in failed');

    consoleErrorSpy.mockRestore();
  });

  it('applies variant prop correctly', () => {
    render(<SignInButton variant="outline" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-variant', 'outline');
  });
});
