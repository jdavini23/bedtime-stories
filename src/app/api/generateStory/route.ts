import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { StoryInput } from '@/types/story';
import { ApiErrorResponse, StoryResponse } from '@/types/api';
import { generateMockStory } from '@/utils/mockStoryGenerator';
import { kv } from '@vercel/kv';
import { logger } from '@/utils/logger';
import {
  processStoryText,
  countWords,
  estimateReadingTime,
  extractTitle,
} from '@/utils/storyUtils';
import { env } from '@/lib/env';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

interface ErrorResponse {
  error: string;
  code: string;
  retryAfter?: number;
  details?: string[];
}

interface ApiError {
  status?: number;
  message: string;
  headers?: Record<string, string>;
  code?: string;
}

/**
 * Checks if caching is available based on environment variables
 */
const isCachingEnabled = (): boolean => {
  return env.ENABLE_CACHING && !!env.KV_REST_API_URL && !!env.KV_REST_API_TOKEN;
};

/**
 * Type guard to check if an error is an API quota error
 */
const isQuotaError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error == null) return false;

  const apiError = error as ApiError;
  return (
    apiError.status === 429 ||
    (typeof apiError.message === 'string' &&
      (apiError.message.includes('quota') || apiError.message.includes('billing')))
  );
};

/**
 * Generates a deterministic cache key from the story input
 */
const generateCacheKey = (input: StoryInput): string => {
  const sortedInterests = input.mostLikedCharacterTypes
    ? [...input.mostLikedCharacterTypes].sort().join(',')
    : '';
  return `story:${input.childName}:${sortedInterests}:${input.theme}:${input.gender}`;
};

/**
 * Validates the story input and returns any validation errors
 */
const validateStoryInput = (input: StoryInput | null): string[] => {
  const validationErrors: string[] = [];

  if (!input) {
    validationErrors.push('Input is required');
    return validationErrors;
  }

  if (!input.childName?.trim()) validationErrors.push('Child name is required');
  if (!input.mostLikedCharacterTypes?.length)
    validationErrors.push('At least one character type is required');
  if (!input.theme?.trim()) validationErrors.push('Story theme is required');
  if (!input.gender?.trim()) validationErrors.push('Child gender is required');

  return validationErrors;
};

/**
 * Attempts to retrieve a story from cache
 */
const getStoryFromCache = async (input: StoryInput): Promise<Record<string, any> | null> => {
  if (!isCachingEnabled()) return null;

  try {
    const cacheKey = generateCacheKey(input);
    const cachedStory = await kv.get<Record<string, any>>(cacheKey);

    if (cachedStory && typeof cachedStory === 'object') {
      logger.info('Cache hit for:', { cacheKey });
      return cachedStory;
    }
  } catch (error) {
    logger.warn('Cache read error:', { error });
  }

  return null;
};

/**
 * Attempts to store a story in cache
 */
const cacheStory = async (input: StoryInput, response: Record<string, any>): Promise<void> => {
  if (!isCachingEnabled()) return;

  try {
    await kv.set(generateCacheKey(input), response, { ex: env.STORY_CACHE_TTL_SECONDS });
  } catch (error) {
    logger.warn('Cache write error:', { error });
  }
};

/**
 * Generates a story using OpenAI API
 */
const generateStoryWithOpenAI = async (input: StoryInput): Promise<StoryResponse> => {
  // Set up a timeout for the OpenAI request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.API_TIMEOUT_MS);

  try {
    const completion = await openai.chat.completions.create(
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a creative storyteller crafting short, engaging bedtime stories for young children (ages 2-8).
            The story should be imaginative, warm, and simple to understand.
            
            FORMATTING INSTRUCTIONS:
            - Start with a captivating title
            - Use paragraph breaks to improve readability
            - Start each paragraph on a new line
            - Use clear, short sentences
            - Avoid long, complex paragraphs
            - Use dialogue and descriptive language
            
            Story Requirements:
            - Keep the story under 300 words
            - Include a clear beginning, middle, and end
            - Make the story age-appropriate
            - Use descriptive language children can understand
            - End with a positive message or moral lesson
            
            THEME-SPECIFIC GUIDELINES:
            - Adventure: Focus on exciting discoveries and overcoming challenges
            - Fantasy: Create magical, imaginative worlds with wonder
            - Educational: Subtly teach a lesson or introduce a new concept
            - Friendship: Highlight the importance of kindness and teamwork
            - Courage: Showcase bravery in facing fears or helping others
            - Kindness: Demonstrate empathy and compassion
            - Curiosity: Encourage exploration and asking questions
            - Creativity: Inspire imagination and unique problem-solving
            - Nature: Connect with the beauty and wonder of the natural world
            - Science: Introduce simple scientific concepts through storytelling
            
            GENDER CONSIDERATIONS:
            - If gender is specified as 'boy', use he/him pronouns
            - If gender is specified as 'girl', use she/her pronouns
            - If gender is 'neutral', use they/them pronouns
            - Adapt story language to be inclusive and respectful`,
          },
          {
            role: 'user',
            content: `Create a ${input.theme} bedtime story for ${input.childName} who is a ${input.gender} and loves ${input.mostLikedCharacterTypes ? input.mostLikedCharacterTypes.join(', ') : 'various things'}.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 600,
        presence_penalty: 0.2,
        frequency_penalty: 0.5,
      },
      {
        signal: controller.signal,
        timeout: env.API_TIMEOUT_MS,
      }
    );

    const story = completion.choices[0]?.message?.content;
    if (!story) {
      logger.error('No story generated');
      throw new Error('No story content received from OpenAI');
    }

    const processedStory = processStoryText(story);

    return {
      id: completion.id,
      content: processedStory,
      createdAt: new Date().toISOString(),
      input,
      generatedWith: 'openai',
      metadata: {
        wordCount: countWords(processedStory),
        readingTime: estimateReadingTime(processedStory),
        title: extractTitle(processedStory),
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Generates a mock story as a fallback
 */
const generateFallbackStory = (input: StoryInput): StoryResponse => {
  logger.info('Generating mock story as fallback');
  const mockStory = generateMockStory(input);
  const processedStory = processStoryText(mockStory);

  return {
    id: Math.random().toString(36).substr(2, 9),
    content: processedStory,
    createdAt: new Date().toISOString(),
    input,
    generatedWith: 'mock',
    metadata: {
      wordCount: countWords(processedStory),
      readingTime: estimateReadingTime(processedStory),
      title: extractTitle(processedStory),
    },
  };
};

/**
 * Main API handler for story generation
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const input: StoryInput | null = await request.json();

    // Validate input
    const validationErrors = validateStoryInput(input);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationErrors,
          code: 'VALIDATION_ERROR',
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // At this point we know input is not null
    const validInput = input as StoryInput;

    // Check cache
    const cachedStory = await getStoryFromCache(validInput);
    if (cachedStory) {
      return NextResponse.json(cachedStory);
    }

    // Check if OpenAI API key is available or if mock stories are enabled
    const hasOpenAIKey = !!env.OPENAI_API_KEY;

    // If no API key or mock stories are enabled, generate mock story
    if (!hasOpenAIKey || env.ENABLE_MOCK_STORIES) {
      logger.warn(
        !hasOpenAIKey
          ? 'No OpenAI API key provided. Generating mock story.'
          : 'Mock stories enabled. Generating mock story.'
      );
      return NextResponse.json(generateFallbackStory(validInput));
    }

    try {
      // Generate story with OpenAI
      const response = await generateStoryWithOpenAI(validInput);

      // Cache the response
      await cacheStory(validInput, response);

      return NextResponse.json(response);
    } catch (error: unknown) {
      logger.error('OpenAI API error:', { error });

      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json(
          {
            error: 'Story generation timed out',
            code: 'TIMEOUT_ERROR',
            message: 'Please try again',
          } as ErrorResponse,
          { status: 408 }
        );
      }

      if (isQuotaError(error)) {
        const retryAfter = parseInt((error as ApiError).headers?.['retry-after'] || '60', 10);
        return NextResponse.json(
          {
            error: 'API rate limit exceeded',
            code: 'RATE_LIMIT',
            retryAfter,
          } as ErrorResponse,
          { status: 429 }
        );
      }

      // Fall back to mock story generator for other errors
      return NextResponse.json(generateFallbackStory(validInput));
    }
  } catch (error: unknown) {
    logger.error('Unexpected error in story generation:', { error });

    // Comprehensive error response
    const errorResponse = {
      error: 'Story generation failed',
      code: 'GENERATION_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
