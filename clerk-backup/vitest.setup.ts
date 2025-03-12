import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Define mockUser for use in tests
let mockUser = {
  id: 'mock-user-id',
  publicMetadata: {
    preferences: {},
  },
};

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
  getAuth: vi.fn().mockReturnValue({ userId: 'mock-user-id' }),
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
          model: 'gpt-3.5-turbo',
          usage: { total_tokens: 100 },
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
