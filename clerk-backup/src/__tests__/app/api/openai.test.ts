import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { POST } from '@/app/api/openai/route';

// Mock the external dependencies
vi.mock('@clerk/nextjs/server', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Create a more comprehensive OpenAI mock
vi.mock('openai', () => {
  // Mock implementation for successful responses
  const successfulMock = vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Test story content' } }],
          model: 'gpt-3.5-turbo',
          usage: { total_tokens: 100 },
        }),
      },
    },
  }));

  // Create a function that can be used to simulate errors
  const mockWithError = (errorStatus, errorMessage) => {
    return vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockRejectedValue({
            name: 'OpenAIError',
            message: errorMessage,
            status: errorStatus,
            type: 'api_error',
          }),
        },
      },
    }));
  };

  // Return the default mock but expose methods to change its behavior
  const mock = successfulMock;
  mock.mockWithError = mockWithError;

  return {
    default: mock,
  };
});

describe('OpenAI API Route', () => {
  const mockUserId = 'user_123';

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset OpenAI mock to successful state
    const OpenAI = require('openai').default;
    vi.mocked(OpenAI).mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: 'Test story content' } }],
            model: 'gpt-3.5-turbo',
            usage: { total_tokens: 100 },
          }),
        },
      },
    }));
  });

  it('should return 401 when user is not authenticated', async () => {
    // Mock unauthenticated user
    vi.mocked(getAuth).mockReturnValue({ userId: null } as any);

    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'generateStory',
        params: { childName: 'Test', theme: 'adventure' },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  });

  it('should handle generateStory operation successfully', async () => {
    // Mock authenticated user
    vi.mocked(getAuth).mockReturnValue({ userId: mockUserId } as any);

    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'generateStory',
        params: {
          childName: 'Test Child',
          theme: 'adventure',
          gender: 'neutral',
          interests: ['dragons', 'magic'],
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('content', 'Test story content');
    expect(data).toHaveProperty('model', 'gpt-3.5-turbo');
    expect(data).toHaveProperty('usage');
  });

  it('should handle OpenAI authentication errors gracefully', async () => {
    // Mock authenticated user
    vi.mocked(getAuth).mockReturnValue({ userId: mockUserId } as any);

    // Mock OpenAI authentication error
    const OpenAI = require('openai').default;
    vi.mocked(OpenAI).mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockRejectedValue({
            name: 'OpenAIError',
            message: 'Invalid API key',
            status: 401,
            type: 'api_error',
          }),
        },
      },
    }));

    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'generateStory',
        params: {
          childName: 'Test Child',
          theme: 'adventure',
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error', 'OpenAI API authentication error');
    expect(data).toHaveProperty('message', 'Invalid API key or unauthorized access');
  });

  it('should handle OpenAI rate limit errors gracefully', async () => {
    // Mock authenticated user
    vi.mocked(getAuth).mockReturnValue({ userId: mockUserId } as any);

    // Mock OpenAI rate limit error
    const OpenAI = require('openai').default;
    vi.mocked(OpenAI).mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockRejectedValue({
            name: 'OpenAIError',
            message: 'Rate limit exceeded',
            status: 429,
            type: 'api_error',
          }),
        },
      },
    }));

    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'generateStory',
        params: {
          childName: 'Test Child',
          theme: 'adventure',
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data).toHaveProperty('error', 'OpenAI API rate limit exceeded');
    expect(data).toHaveProperty('message', 'Too many requests, please try again later');
  });

  it('should handle chatCompletion operation successfully', async () => {
    // Mock authenticated user
    vi.mocked(getAuth).mockReturnValue({ userId: mockUserId } as any);

    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'chatCompletion',
        params: {
          messages: [{ role: 'user', content: 'Hello' }],
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('content');
    expect(data).toHaveProperty('model');
    expect(data).toHaveProperty('usage');
  });

  it('should return 400 for missing operation', async () => {
    // Mock authenticated user
    vi.mocked(getAuth).mockReturnValue({ userId: mockUserId } as any);

    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Missing required parameter: operation',
    });
  });

  it('should return 400 for invalid operation', async () => {
    // Mock authenticated user
    vi.mocked(getAuth).mockReturnValue({ userId: mockUserId } as any);

    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'invalidOperation',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Unsupported operation: invalidOperation',
    });
  });

  it('should handle generateStory validation errors', async () => {
    // Mock authenticated user
    vi.mocked(getAuth).mockReturnValue({ userId: mockUserId } as any);

    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'generateStory',
        params: {},
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Missing required parameters for story generation',
    });
  });
});
