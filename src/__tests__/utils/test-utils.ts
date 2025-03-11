import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs';
import { vi } from 'vitest';

// Mock Clerk's auth
vi.mock('@clerk/nextjs', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
  clerkClient: {
    users: {
      getUser: vi.fn(),
    },
  },
}));

// Mock environment variables
process.env.GEMINI_API_KEY = 'test-gemini-key';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Helper to create authenticated request
export function createAuthenticatedRequest(body: any, userId: string = 'test-user-id') {
  // Mock auth to return a user ID
  const mockAuth = {
    userId,
    sessionId: 'test-session-id',
    getToken: async () => 'test-token',
    isPublicRoute: false,
    isApiRoute: true,
    debug: true,
  };

  (auth as jest.Mock).mockReturnValue(mockAuth);

  // Create request with body
  return new NextRequest('http://localhost:3000/api/gemini', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
    },
  });
}

// Helper to create unauthenticated request
export function createUnauthenticatedRequest(body: any) {
  // Mock auth to return no user
  const mockAuth = {
    userId: null,
    sessionId: null,
    getToken: async () => null,
    isPublicRoute: false,
    isApiRoute: true,
    debug: true,
  };

  (auth as jest.Mock).mockReturnValue(mockAuth);

  return new NextRequest('http://localhost:3000/api/gemini', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Sample story input for testing
export const sampleStoryInput = {
  type: 'story',
  input: {
    childName: 'Test Child',
    childAge: 6,
    theme: 'adventure',
    characters: ['Brave Knight'],
    setting: 'Magical Forest',
    length: 'medium',
    readingLevel: 'intermediate',
    mainCharacter: {
      traits: ['brave', 'kind'],
      appearance: ['friendly smile', 'bright eyes'],
      skills: ['problem-solving', 'creativity'],
    },
    supportingCharacters: [
      {
        name: 'Wise Owl',
        type: 'animal',
        role: 'mentor',
        traits: ['wise', 'helpful'],
      },
    ],
    ageGroup: '6-8',
  },
  prompt: 'Generate a story about a brave knight in a magical forest...',
};

// Sample story response for mocking
export const sampleStoryResponse = {
  content: 'Once upon a time in a magical forest...',
  model: 'gemini-1.5-pro',
  usage: {
    promptTokens: 100,
    completionTokens: 200,
    totalTokens: 300,
  },
};

// Error response helper
export function createErrorResponse(status: number, message: string) {
  return {
    error: status === 401 ? 'Unauthorized' : 'Error',
    message,
    status,
  };
}

// Mock logger to prevent console spam during tests
export const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
};

// Reset all mocks between tests
export function resetMocks() {
  vi.clearAllMocks();
  mockLogger.info.mockClear();
  mockLogger.error.mockClear();
  mockLogger.warn.mockClear();
  mockLogger.debug.mockClear();
}
