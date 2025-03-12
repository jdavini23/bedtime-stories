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

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn(),
  })),
}));

vi.mock('@/utils/logger', () => ({
  logger: mockLogger,
}));

import { describe, it, expect, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { POST } from '@/app/api/gemini/route';
import {
  createAuthenticatedRequest,
  createUnauthenticatedRequest,
  sampleStoryInput,
  sampleStoryResponse,
  resetMocks,
} from '../../utils/test-utils';

describe('Gemini API Route', () => {
  let mockGemini: jest.Mock;

  beforeEach(() => {
    resetMocks();
    // Reset environment variables
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    mockGemini = GoogleGenerativeAI as unknown as jest.Mock;
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
      // Mock successful Gemini response
      const mockGenerateContent = vi.fn().mockResolvedValue({
        response: {
          text: () => sampleStoryResponse.content,
        },
      });

      const mockGetGenerativeModel = vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      });

      mockGemini.mockImplementation(() => ({
        getGenerativeModel: mockGetGenerativeModel,
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
    it('should return 500 when Gemini API key is not configured', async () => {
      process.env.GEMINI_API_KEY = '';
      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Configuration error');
      expect(data.message).toBe('Gemini API key not configured');
    });
  });

  describe('Story Generation', () => {
    it('should successfully generate a story with valid input', async () => {
      // Mock successful Gemini response
      const mockGenerateContent = vi.fn().mockResolvedValue({
        response: {
          text: () => sampleStoryResponse.content,
        },
      });

      const mockGetGenerativeModel = vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      });

      mockGemini.mockImplementation(() => ({
        getGenerativeModel: mockGetGenerativeModel,
      }));

      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe(sampleStoryResponse.content);
      expect(mockGenerateContent).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Story generated successfully',
        expect.any(Object)
      );
    });

    it('should handle story generation errors gracefully', async () => {
      // Mock Gemini error
      const mockError = new Error('Story generation failed');
      const mockGenerateContent = vi.fn().mockRejectedValue(mockError);

      const mockGetGenerativeModel = vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      });

      mockGemini.mockImplementation(() => ({
        getGenerativeModel: mockGetGenerativeModel,
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
    it('should handle network errors', async () => {
      // Mock network error
      const mockError = new TypeError('Failed to fetch');
      const mockGenerateContent = vi.fn().mockRejectedValue(mockError);

      const mockGetGenerativeModel = vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      });

      mockGemini.mockImplementation(() => ({
        getGenerativeModel: mockGetGenerativeModel,
      }));

      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle circuit breaker errors', async () => {
      // Mock circuit breaker error
      const mockError = new Error('circuit breaker opened');
      const mockGenerateContent = vi.fn().mockRejectedValue(mockError);

      const mockGetGenerativeModel = vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      });

      mockGemini.mockImplementation(() => ({
        getGenerativeModel: mockGetGenerativeModel,
      }));

      const request = createAuthenticatedRequest(sampleStoryInput);
      const response = (await POST(request)) as NextResponse;

      expect(response).toBeDefined();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe('Service temporarily unavailable');
      expect(data.message).toBe('Please try again later');
    });
  });
});
