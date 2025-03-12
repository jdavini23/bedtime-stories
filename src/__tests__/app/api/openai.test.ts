import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { POST } from '@/app/api/openai/route';
import { Mock } from 'vitest';

// Mock the external dependencies
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: vi.fn(),
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
  const mockWithError = (errorStatus: number, errorMessage: string) => {
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
  const mock = successfulMock as Mock & { mockWithError: typeof mockWithError };
  mock.mockWithError = mockWithError;

  return {
    default: mock,
  };
});

describe('OpenAI API Route', () => {
  const mockUserId = 'user_123';
  const mockSession = {
    user: {
      id: mockUserId,
      email: 'test@example.com',
    },
  };

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

    // Mock Supabase auth
    vi.mocked(createRouteHandlerClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
      },
    } as any);
  });

  it('should return 401 when user is not authenticated', async () => {
    // Mock unauthenticated user
    vi.mocked(createRouteHandlerClient).mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      },
    } as any);

    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'generateStory',
        params: { childName: 'Test', theme: 'adventure' },
      }),
    });

    const response = await POST(request);
    expect(response).toBeDefined();
    if (!response) throw new Error('Response should be defined');

    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toEqual({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  });

  it('should handle generateStory operation successfully', async () => {
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
    expect(response).toBeDefined();
    if (!response) throw new Error('Response should be defined');

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('content', 'Test story content');
    expect(data).toHaveProperty('model', 'gpt-3.5-turbo');
    expect(data).toHaveProperty('usage');
  });

  it('should handle OpenAI authentication errors gracefully', async () => {
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
    expect(response).toBeDefined();
    if (!response) throw new Error('Response should be defined');

    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error', 'OpenAI API authentication error');
    expect(data).toHaveProperty('message', 'Invalid API key or unauthorized access');
  });

  it('should handle OpenAI rate limit errors gracefully', async () => {
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
    expect(response).toBeDefined();
    if (!response) throw new Error('Response should be defined');

    const data = await response.json();
    expect(response.status).toBe(429);
    expect(data).toHaveProperty('error', 'OpenAI API rate limit exceeded');
    expect(data).toHaveProperty('message', 'Too many requests, please try again later');
  });

  it('should handle chatCompletion operation successfully', async () => {
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
    expect(response).toBeDefined();
    if (!response) throw new Error('Response should be defined');

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('content');
    expect(data).toHaveProperty('model');
    expect(data).toHaveProperty('usage');
  });

  it('should return 400 for missing operation', async () => {
    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response).toBeDefined();
    if (!response) throw new Error('Response should be defined');

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Missing required parameter: operation',
    });
  });

  it('should return 400 for invalid operation', async () => {
    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'invalidOperation',
        params: {},
      }),
    });

    const response = await POST(request);
    expect(response).toBeDefined();
    if (!response) throw new Error('Response should be defined');

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Invalid operation: invalidOperation',
    });
  });

  it('should return 400 for missing parameters', async () => {
    const request = new NextRequest('http://localhost/api/openai', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'generateStory',
      }),
    });

    const response = await POST(request);
    expect(response).toBeDefined();
    if (!response) throw new Error('Response should be defined');

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Missing required parameter: params',
    });
  });

  it('should handle Supabase auth errors gracefully', async () => {
    // Mock Supabase auth error
    vi.mocked(createRouteHandlerClient).mockReturnValue({
      auth: {
        getSession: vi
          .fn()
          .mockResolvedValue({ data: { session: null }, error: new Error('Auth error') }),
      },
    } as any);

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
    expect(response).toBeDefined();
    if (!response) throw new Error('Response should be defined');

    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toEqual({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  });
});
