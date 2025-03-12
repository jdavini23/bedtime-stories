import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { vi } from 'vitest';

// Mock Supabase hooks
vi.mock('@/providers/SupabaseAuthProvider', () => ({
  useSupabase: vi.fn(() => ({
    user: null,
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  })),
}));

export { useSupabase };
