import { render, screen } from '@testing-library/react';
import { ProtectedRoute, AdminRoute } from '@/components/auth/ProtectedRoute';
import { useUser, type User } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { describe, beforeEach, it, expect } from 'vitest';

// Mock the hooks
jest.mock('@/hooks/useUser');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };
  const mockChildren = <div data-testid="protected-content">Protected Content</div>;
  const mockFallback = <div data-testid="fallback-content">Fallback Content</div>;

  const createMockUser = (overrides = {}): User => ({
    id: 'user_123',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    imageUrl: 'https://example.com/avatar.jpg',
    isAdmin: false,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should show fallback while loading', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: false,
      isSignedIn: false,
      user: null,
    });

    render(<ProtectedRoute>{mockChildren}</ProtectedRoute>);

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText('Loading authentication...')).toBeInTheDocument();
  });

  it('should redirect to sign-in if not signed in', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      user: null,
    });

    render(<ProtectedRoute>{mockChildren}</ProtectedRoute>);

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/sign-in?redirect_url='));
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should render children if signed in', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: createMockUser(),
    });

    render(<ProtectedRoute>{mockChildren}</ProtectedRoute>);

    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should render custom fallback if provided', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: false,
      isSignedIn: false,
      user: null,
    });

    render(<ProtectedRoute fallback={mockFallback}>{mockChildren}</ProtectedRoute>);

    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should redirect non-admin users when adminOnly is true', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: createMockUser({ isAdmin: false }),
    });

    render(<ProtectedRoute adminOnly>{mockChildren}</ProtectedRoute>);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should render children for admin users when adminOnly is true', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: createMockUser({ isAdmin: true }),
    });

    render(<ProtectedRoute adminOnly>{mockChildren}</ProtectedRoute>);

    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };
  const mockChildren = <div data-testid="admin-content">Admin Content</div>;

  const createMockUser = (overrides = {}): User => ({
    id: 'user_123',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    imageUrl: 'https://example.com/avatar.jpg',
    isAdmin: false,
    ...overrides,
  });
  beforeEach(() => {
    jest.resetAllMocks();
    (useRouter as jest.Mocked<typeof useRouter>).mockReturnValue(mockRouter);
  });

  it('should render admin content for admin users', () => {
    (useUser as jest.Mocked<typeof useUser>).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: createMockUser({ isAdmin: true }),
    });

    render(<AdminRoute>{mockChildren}</AdminRoute>);

    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });

  it('should show admin access denied message for non-admin users', () => {
    (useUser as jest.Mocked<typeof useUser>).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: createMockUser({ isAdmin: false }),
    });

    render(<AdminRoute>{mockChildren}</AdminRoute>);

    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    expect(screen.getByText('This page requires administrator privileges.')).toBeInTheDocument();
  });
});
