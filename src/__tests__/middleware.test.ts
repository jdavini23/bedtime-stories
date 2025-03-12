import { createServerClient } from '@supabase/ssr';
import { NextResponse, NextRequest } from 'next/server';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { middleware } from '@/middleware';

// Mock Supabase SSR client
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
    },
  })),
}));

describe('Middleware', () => {
  let mockRequest: NextRequest;
  let mockSession: { user: { id: string } } | null;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup default session as null (unauthenticated)
    mockSession = null;

    // Mock the Supabase getSession response
    (createServerClient as any).mockImplementation(() => ({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
      },
    }));
  });

  // Helper function to create request
  const createRequest = (path: string) => {
    return new NextRequest(new URL(`http://localhost${path}`));
  };

  describe('Public Routes', () => {
    it.each([
      '/',
      '/sign-in',
      '/sign-up',
      '/api/story',
      '/about',
      '/contact',
      '/_next/static/chunks/main.js',
      '/favicon.ico',
    ])('allows access to public route: %s', async (path) => {
      mockRequest = createRequest(path);
      const response = await middleware(mockRequest);
      expect(response.status).not.toBe(302); // Not redirected
    });
  });

  describe('Protected Routes', () => {
    beforeEach(() => {
      mockSession = null;
    });

    it('redirects unauthenticated users to sign-in from protected routes', async () => {
      mockRequest = createRequest('/dashboard');
      const response = await middleware(mockRequest);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe('http://localhost/sign-in');
    });

    it('allows authenticated users to access protected routes', async () => {
      mockSession = { user: { id: 'test-user' } };
      mockRequest = createRequest('/dashboard');
      const response = await middleware(mockRequest);
      expect(response.status).not.toBe(302);
    });
  });

  describe('Auth Pages', () => {
    it('redirects authenticated users from auth pages to dashboard', async () => {
      mockSession = { user: { id: 'test-user' } };
      mockRequest = createRequest('/auth/sign-in');
      const response = await middleware(mockRequest);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe('http://localhost/dashboard');
    });

    it('allows unauthenticated users to access auth pages', async () => {
      mockSession = null;
      mockRequest = createRequest('/auth/sign-in');
      const response = await middleware(mockRequest);
      expect(response.status).not.toBe(302);
    });
  });
});
