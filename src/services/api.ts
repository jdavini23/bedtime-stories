import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios';
import { Story, StoryInput, StoryTheme } from '@/types/story';
import { storyPersonalizationEngine } from './personalizationEngine';
import { logger } from '@/utils/logger';

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

class StoryApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000  // 30 seconds timeout
    });
  }

  // Enhanced story generation without Firebase dependencies
  async generateStory(input: StoryInput): Promise<Story> {
    try {
      // Validate input
      this.validateStoryInput(input);

      // Log input details for debugging
      logger.info('Generating story', { 
        input: {
          childName: input.childName,
          theme: input.theme,
          interests: input.interests
        }
      });

      // Personalize story generation
      const personalizedStory = await storyPersonalizationEngine.generatePersonalizedStory(
        input, 
        null  // Remove user ID dependency
      );

      logger.info('Story generated successfully', { 
        theme: input.theme, 
        interests: input.interests 
      });

      return personalizedStory;
    } catch (error) {
      const errorContext = {
        input,
        error: {
          name: error instanceof Error ? error.name : 'Unknown Error',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : 'No stack trace'
        }
      };

      const apiError = new ApiError(
        'Failed to generate story', 
        500,
        errorContext
      );

      logger.error('Story generation failed', errorContext);
      throw apiError;
    }
  }

  // Input validation method
  private validateStoryInput(input: StoryInput): void {
    const errors: string[] = [];

    if (!input.childName || input.childName.length < 2) {
      errors.push('Child name must be at least 2 characters long');
    }

    if (!input.theme) {
      errors.push('Story theme is required');
    }

    if (input.interests && input.interests.length > 3) {
      errors.push('Maximum of 3 interests allowed');
    }

    if (errors.length > 0) {
      throw new ApiError('Invalid story input', 400, { validationErrors: errors });
    }
  }
}

// Singleton instance
export const storyApi = new StoryApiService();

export default storyApi;
