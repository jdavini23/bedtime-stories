import { vi } from 'vitest';

const mockLogger = vi.hoisted(() => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
}));

vi.mock('@clerk/nextjs', () => ({
  auth: vi.fn(),
}));

vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  })),
}));

vi.mock('@/utils/logger', () => ({
  logger: mockLogger,
}));

import { describe, it, expect, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { POST } from '@/app/api/openai/route';
import {
  createAuthenticatedRequest,
  createUnauthenticatedRequest,
  sampleStoryInput,
  sampleStoryResponse,
  resetMocks,
} from '../../utils/test-utils';

describe('OpenAI API Route', () => {
  let mockOpenAI: jest.Mock;

  beforeEach(() => {
    resetMocks();
    // Reset environment variables
    process.env.OPENAI_API_KEY = 'test-openai-key';
    mockOpenAI = OpenAI as unknown as jest.Mock;
    // Reset logger mocks
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 for unauthenticated requests', async () => {
      const request = createUnauthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
      expect(data.message).toBe('Authentication required');
    });

    it('should process authenticated requests', async () => {
      // Mock successful OpenAI response
      const mockCreateChatCompletion = vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: sampleStoryResponse.content,
            },
          },
        ],
        usage: sampleStoryResponse.usage,
      });

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreateChatCompletion,
          },
        },
      }));

      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe(sampleStoryResponse.content);
    });
  });

  describe('API Key Validation', () => {
    it('should return 500 when OpenAI API key is not configured', async () => {
      process.env.OPENAI_API_KEY = '';
      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Configuration error');
      expect(data.message).toBe('OpenAI API key not configured');
    });
  });

  describe('Story Generation', () => {
    it('should successfully generate a story with valid input', async () => {
      // Mock successful OpenAI response
      const mockCreateChatCompletion = vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: sampleStoryResponse.content,
            },
          },
        ],
        usage: sampleStoryResponse.usage,
      });

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreateChatCompletion,
          },
        },
      }));

      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe(sampleStoryResponse.content);
      expect(mockCreateChatCompletion).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Story generated successfully',
        expect.any(Object)
      );
    });

    it('should handle story generation errors gracefully', async () => {
      // Mock OpenAI error
      const mockError = new Error('Story generation failed');
      const mockCreateChatCompletion = vi.fn().mockRejectedValue(mockError);

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreateChatCompletion,
          },
        },
      }));

      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Story generation failed');
      expect(mockLogger.error).toHaveBeenCalledWith('Story generation failed', expect.any(Object));
    });

    it('should validate required story parameters', async () => {
      const invalidInput = {
        type: 'story',
        input: {
          // Missing required fields
        },
        prompt: '',
      };

      const request = createAuthenticatedRequest(invalidInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Unsupported content type');
    });
  });

  describe('Error Handling', () => {
    it('should handle rate limit errors', async () => {
      // Mock rate limit error
      const mockError = new Error('Rate limit exceeded');
      mockError.name = 'RateLimitError';
      const mockCreateChatCompletion = vi.fn().mockRejectedValue(mockError);

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreateChatCompletion,
          },
        },
      }));

      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Rate limit exceeded');
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      // Mock network error
      const mockError = new TypeError('Failed to fetch');
      const mockCreateChatCompletion = vi.fn().mockRejectedValue(mockError);

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreateChatCompletion,
          },
        },
      }));

      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle invalid API key errors', async () => {
      // Mock invalid API key error
      const mockError = new Error('Invalid API key');
      mockError.name = 'AuthenticationError';
      const mockCreateChatCompletion = vi.fn().mockRejectedValue(mockError);

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreateChatCompletion,
          },
        },
      }));

      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Configuration error');
      expect(data.message).toBe('Invalid OpenAI API key');
    });
  });
});
