import { v4 as uuidv4 } from 'uuid';
import { Redis } from '@upstash/redis';
import { StoryInput, StoryTheme, Story } from '@/types/story';
import { THEME_DESCRIPTIONS, THEME_ELEMENTS } from './themes';
import { generateFallbackStory } from '@/utils/fallback-generator';
import { geminiCircuitBreaker } from '@/utils/error-handlers';
import { storyLogger } from '@/utils/logging/logUtils';
import { PreferencesManager } from './preferences';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Handle story generation errors
function handleStoryGenerationError(error: Error, input: StoryInput): Story {
  storyLogger.error('Story generation error', {
    error,
    input,
  });
  return generateFallbackStory(input);
}

export class StoryGenerator {
  private userId: string | undefined;
  private preferencesManager: PreferencesManager;

  constructor(userId: string | undefined) {
    this.userId = userId;
    this.preferencesManager = new PreferencesManager(userId);
    storyLogger.info('StoryGenerator initialized', { userId });
  }

  /**
   * Generate a unique ID for a story
   */
  private generateUniqueId(): string {
    return uuidv4();
  }

  /**
   * Generate a cache key for a story
   *
   * This method creates a deterministic cache key based on the story input parameters.
   * The key format is: story:{childName}:{theme}:{readingLevel}:{length}
   *
   * @param input Story generation input parameters
   * @returns Cache key string
   */
  private generateCacheKey(input: StoryInput): string {
    const { childName, theme, readingLevel, length } = input;
    return `story:${childName}:${theme}:${readingLevel}:${length}`;
  }

  /**
   * Validate story input parameters
   *
   * @param input Story generation input parameters
   * @throws Error if any required parameters are missing
   */
  private validateInput(input: StoryInput): void {
    const requiredFields = [
      'childName',
      'childAge',
      'theme',
      'characters',
      'setting',
      'length',
      'readingLevel',
    ];
    const missingFields = requiredFields.filter((field) => !input[field as keyof StoryInput]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required story parameters: ${missingFields.join(', ')}`);
    }

    if (!Array.isArray(input.characters) || input.characters.length === 0) {
      throw new Error('At least one character is required for the story');
    }
  }

  /**
   * Call the Gemini API endpoint to generate a story
   *
   * This method makes a request to the Gemini API endpoint with the story input parameters.
   * It includes error handling and detailed logging.
   *
   * @param input Story generation input parameters
   * @returns Generated story content
   */
  private async callGeminiEndpoint(input: StoryInput): Promise<string> {
    try {
      // Validate input before making the API call
      this.validateInput(input);

      storyLogger.info('Calling Gemini API endpoint for story generation', {
        childName: input.childName,
        theme: input.theme,
        readingLevel: input.readingLevel,
        length: input.length,
      });

      // Prepare the API request
      const themeDescription = THEME_DESCRIPTIONS[input.theme as StoryTheme] || input.theme;
      const themeElements = THEME_ELEMENTS[input.theme as StoryTheme];

      // Construct a detailed prompt for the story
      const prompt = `
        Create a bedtime story for a child named ${input.childName} who is ${input.childAge} years old.

        The story should be about ${themeDescription}.
        The story should be set in ${input.setting}.
        Include these characters: ${input.characters.join(', ')}.

        ${
          themeElements
            ? `
        You can use these settings: ${themeElements.settings.join(', ')}.
        You can include these character types: ${themeElements.characters.join(', ')}.
        You can incorporate these challenges: ${themeElements.challenges.join(', ')}.
        `
            : ''
        }
        
        Make the story ${input.length} in length and appropriate for a ${input.readingLevel} reading level.
        The story should be engaging, with a positive message.

        Format the story with a title at the beginning using a single # markdown heading.
      `;

      storyLogger.debug('Making request to Gemini API', {
        apiUrl:
          typeof window !== 'undefined' ? `${window.location.origin}/api/gemini` : '/api/gemini',
      });

      // Make the API request to Gemini
      const response = await fetch(
        typeof window !== 'undefined' ? `${window.location.origin}/api/gemini` : '/api/gemini',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'story',
            input,
            prompt,
          }),
        }
      );

      storyLogger.debug('Received response from Gemini API', {
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorData = await response.json();
        storyLogger.error('API request failed', {
          status: response.status,
          errorData,
        });
        throw new Error(`Gemini API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      storyLogger.info('Successfully received story content', {
        contentLength: data.content?.length || 0,
      });

      return data.content;
    } catch (error) {
      storyLogger.error('Error calling Gemini API endpoint', { error });
      throw error;
    }
  }

  /**
   * Generate personalized story using Gemini API endpoint
   *
   * This method generates a story using the Gemini API, with caching and fallback mechanisms.
   * It includes comprehensive error handling, circuit breaking, and detailed logging.
   *
   * @param input Story generation input parameters
   * @returns Generated story content
   */
  async generatePersonalizedStory(input: StoryInput): Promise<Story> {
    try {
      // Validate input before proceeding
      this.validateInput(input);

      storyLogger.info('Starting personalized story generation', { input });

      // Create a unique ID for this story
      const storyId = this.generateUniqueId();

      // Create a cache key based on the input parameters
      const cacheKey = this.generateCacheKey(input);

      try {
        // Check if we have a cached story for these parameters
        const cachedStory = await redis.get<string>(cacheKey);

        if (cachedStory) {
          storyLogger.info('Using cached story', {
            cacheKey,
            userId: this.userId,
            contentLength: cachedStory.length,
          });

          // Parse the cached story to extract title and content
          const titleMatch = cachedStory.match(/^#\s*(.+?)(?:\n|$)/m);
          const title = titleMatch ? titleMatch[1].trim() : 'Untitled Story';
          const content = cachedStory.replace(/^#\s*(.+?)(?:\n|$)/m, '').trim();

          return {
            id: storyId,
            title,
            content,
            metadata: {
              input,
              fallback: false,
              timestamp: Date.now(),
            },
          };
        }

        // No cached story found, generate a new one
        storyLogger.info('No cached story found, generating new story', {
          cacheKey,
          userId: this.userId,
        });

        // Define the API call function to be passed to the circuit breaker
        const apiCallFunction = async () => {
          const storyContent = await this.callGeminiEndpoint(input);
          return storyContent;
        };

        try {
          // Try to generate story with circuit breaker
          const storyContent = await geminiCircuitBreaker.fire(apiCallFunction);

          // Parse the story to extract title and content
          const titleMatch = storyContent.match(/^#\s*(.+?)(?:\n|$)/m);
          const title = titleMatch ? titleMatch[1].trim() : 'Untitled Story';
          const content = storyContent.replace(/^#\s*(.+?)(?:\n|$)/m, '').trim();

          // Cache the generated story
          const cacheTTL = 60 * 60 * 24; // 24 hours
          await redis.set(cacheKey, storyContent, { ex: cacheTTL });

          storyLogger.info('Successfully generated and cached story', {
            userId: this.userId,
            title,
            contentLength: content.length,
            cacheTTL,
          });

          return {
            id: storyId,
            title,
            content,
            metadata: {
              input,
              fallback: false,
              timestamp: Date.now(),
            },
          };
        } catch (error) {
          // Handle error and return fallback story
          storyLogger.error('Error generating story with circuit breaker', { error });
          return handleStoryGenerationError(error as Error, input);
        }
      } catch (error) {
        // Handle Redis error and return fallback story
        storyLogger.error('Error with Redis cache', { error });
        return handleStoryGenerationError(error as Error, input);
      }
    } catch (error) {
      // Handle validation error and return fallback story
      storyLogger.error('Error validating story input', { error });
      return handleStoryGenerationError(error as Error, input);
    }
  }
}
