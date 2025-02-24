'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { Story, StoryInput, StoryTheme } from '@/types/story';
import { logger } from '@/utils/logger';
import { useClientAuth } from './clientAuth';
import { useMemo } from 'react';

// Simplified error handling
export class ApiError extends Error {
  constructor(
    public message: string,
    public code?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    // Type assertion to handle potential undefined message property
    const responseData = error.response.data as { message?: string } | undefined;
    const errorMessage = responseData?.message || error.response.statusText || 'An error occurred';
    const errorDetails = error.response.data || {};
    logger.error('API Error:', {
      status: error.response.status,
      message: errorMessage,
      details: errorDetails,
    });
    throw new ApiError(errorMessage, error.response.status, errorDetails);
  }
  logger.error('Network Error:', { message: error.message });
  throw new ApiError(error.message || 'Network error occurred');
};

export const useStoryApi = () => {
  const { getToken } = useClientAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Update auth interceptor
    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error: unknown) {
        logger.error('Error getting auth token:', { error: error as Record<string, unknown> });
      }
      return config;
    });

    return instance;
  }, [getToken]);

  return {
    async generateStory(input: StoryInput): Promise<Story> {
      // Input validation
      if (!input.childName || input.childName.trim() === '') {
        throw new ApiError('Child name is required', 400, { field: 'childName' });
      }

      if (!input.mostLikedCharacterTypes || input.mostLikedCharacterTypes.length === 0) {
        throw new ApiError('At least one character type is required', 400, {
          field: 'mostLikedCharacterTypes',
        });
      }

      if (!input.theme) {
        throw new ApiError('Story theme is required', 400, { field: 'theme' });
      }

      if (!input.gender) {
        throw new ApiError('Child gender is required', 400, { field: 'gender' });
      }

      try {
        const response: AxiosResponse<Story> = await api.post('/story/generate', input);
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          return handleApiError(error);
        }
        throw new ApiError('Unexpected error generating story', 500);
      }
    },

    async getStoryThemes(): Promise<StoryTheme[]> {
      try {
        const response: AxiosResponse<StoryTheme[]> = await api.get('/story/themes');
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          return handleApiError(error);
        }
        throw new ApiError('Failed to fetch story themes', 500);
      }
    },
  };
};
