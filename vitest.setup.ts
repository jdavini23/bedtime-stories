import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { User, Session } from '@supabase/supabase-js';

// Mock user data
const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    role: 'user',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

// Mock session data
const mockSession: Session = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: mockUser,
};

// Mock Supabase client
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: mockSession },
        error: null,
      }),
      getUser: vi.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      }),
    },
  })),
}));

// Mock Next.js headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  })),
  headers: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

// Global setup for testing
vi.stubGlobal('console', {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
});

// Mock IntersectionObserver API for testing
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
};
