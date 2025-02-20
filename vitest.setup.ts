require('@testing-library/jest-dom');
const { vi } = require('vitest');

// Mock Clerk dependencies
vi.mock('@clerk/nextjs/server', () => ({
  clerkClient: {
    users: {
      getUser: vi.fn().mockResolvedValue({
        publicMetadata: {
          preferences: {
            themes: [],
            interests: [],
            generatedStories: 0,
          },
        },
      }),
      updateUser: vi.fn().mockResolvedValue(true),
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
