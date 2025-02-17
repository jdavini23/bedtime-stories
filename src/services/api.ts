import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios';
import { Story, StoryInput, StoryTheme } from '@/types/story';
import { storyPersonalizationEngine } from './personalizationEngine';
import { logger } from '@/utils/logger';
import { getCurrentUser } from '@/lib/firebaseAuth';
import { firestoreService } from './firestoreService';

// Enhanced error handling
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

// Rate limiting configuration
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Story generation configuration
interface StoryGenerationConfig {
  maxTokens: number;
  temperature: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

class StoryApiService {
  private api: AxiosInstance;
  private rateLimitConfig: RateLimitConfig;
  private storyGenerationConfig: StoryGenerationConfig;
  private requestCount: Map<string, number> = new Map();

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000  // 30 seconds timeout
    });

    // Rate limiting configuration
    this.rateLimitConfig = {
      maxRequests: 10,  // 10 requests per window
      windowMs: 60 * 60 * 1000  // 1 hour window
    };

    // Story generation configuration
    this.storyGenerationConfig = {
      maxTokens: 600,
      temperature: 0.8,
      frequencyPenalty: 0.5,
      presencePenalty: 0.2
    };

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for rate limiting
    this.api.interceptors.request.use(async (config) => {
      const userId = getCurrentUser()?.uid;
      if (!userId) {
        throw new ApiError('Authentication required', 401);
      }

      const currentTime = Date.now();
      const userRequestCount = this.requestCount.get(userId) || 0;

      if (userRequestCount >= this.rateLimitConfig.maxRequests) {
        throw new ApiError(
          'Rate limit exceeded. Please try again later.', 
          429,
          { 
            maxRequests: this.rateLimitConfig.maxRequests, 
            windowMs: this.rateLimitConfig.windowMs 
          }
        );
      }

      this.requestCount.set(userId, userRequestCount + 1);
      
      // Reset counter after window
      setTimeout(() => {
        this.requestCount.delete(userId);
      }, this.rateLimitConfig.windowMs);

      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const apiError = new ApiError(
          error.response?.data?.message || 'An unexpected error occurred',
          error.response?.status,
          { 
            url: error.config?.url,
            method: error.config?.method 
          }
        );

        logger.error('API Request Failed', {
          message: apiError.message,
          code: apiError.code,
          details: apiError.details
        });

        return Promise.reject(apiError);
      }
    );
  }

  // Enhanced story generation with more context
  async generateStory(input: StoryInput): Promise<Story> {
    try {
      const userId = getCurrentUser()?.uid;
      
      // Validate input
      this.validateStoryInput(input);

      // Log input details for debugging
      logger.info('Generating story', { 
        userId, 
        input: {
          childName: input.childName,
          theme: input.theme,
          interests: input.interests
        }
      });

      // Personalize story generation
      const personalizedStory = await storyPersonalizationEngine.generatePersonalizedStory(
        input, 
        userId
      );

      // Record story generation
      await firestoreService.recordStory(userId!, {
        content: personalizedStory.content,
        theme: personalizedStory.input.theme,
        interests: personalizedStory.input.interests
      });

      logger.info('Story generated successfully', { 
        userId, 
        theme: input.theme, 
        interests: input.interests 
      });

      return personalizedStory;
    } catch (error) {
      const errorContext = {
        input,
        userId: getCurrentUser()?.uid,
        error: {
          name: error instanceof Error ? error.name : 'Unknown Error',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : 'No stack trace'
        }
      };

      if (error instanceof ApiError) {
        logger.error('API Error during story generation', errorContext);
        throw error;
      }

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

  // Method to get recommended themes based on user preferences
  async getRecommendedThemes(userId?: string): Promise<StoryTheme[]> {
    try {
      if (!userId) {
        userId = getCurrentUser()?.uid;
      }

      if (!userId) {
        throw new ApiError('Authentication required', 401);
      }

      const userPreferences = await firestoreService.getUserPreferences(userId);

      // Default themes if no preferences
      if (!userPreferences || userPreferences.preferredThemes.length === 0) {
        return ['adventure', 'friendship', 'curiosity', 'creativity'];
      }

      // Prioritize user's preferred themes
      return userPreferences.preferredThemes;
    } catch (error) {
      logger.error('Failed to get recommended themes', { userId, error });
      throw new ApiError('Could not retrieve recommended themes', 500);
    }
  }
}

// Singleton instance
export const storyApi = new StoryApiService();

export default storyApi;


