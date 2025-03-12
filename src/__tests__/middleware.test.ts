import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { vi } from 'vitest';

// Mock Supabase middleware client
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createMiddlewareClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
    },
  })),
}));

export { createMiddlewareClient };
