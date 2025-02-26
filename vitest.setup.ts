import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Clerk dependencies
vi.mock('@clerk/nextjs/server', () => ({
  clerkClient: {
    users: {
      getUser: vi.fn().mockResolvedValue(mockUser),
      updateUser: vi.fn().mockImplementation(({ publicMetadata }) => {
        // Simulate updating user preferences
        mockUser = {
          ...mockUser,
          publicMetadata: {
            preferences: {
              ...(mockUser.publicMetadata?.preferences || {}),
              ...(publicMetadata.preferences || {}),
            },
          },
        };
        this.getUser.mockResolvedValue(mockUser);
        return Promise.resolve(mockUser);
      }),
    },
  },
}));

// Mock OpenAI to prevent actual API calls during testing
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Mocked story content',
              },
            },
          ],
        }),
      },
    },
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
