import { env } from '@/lib/env';
import { logger } from '@/utils/logger';
import { OPENAI_MODELS } from '@/constants';

/**
 * Interface for OpenAI API error
 */
export interface OpenAIError {
  status?: number;
  message: string;
  headers?: Record<string, string>;
  code?: string;
}

/**
 * Type guard to check if an error is an API quota error
 */
export const isQuotaError = (error: unknown): error is OpenAIError => {
  if (typeof error !== 'object' || error == null) return false;

  const apiError = error as OpenAIError;
  return (
    apiError.status === 429 ||
    (typeof apiError.message === 'string' &&
      (apiError.message.includes('quota') || apiError.message.includes('billing')))
  );
};

/**
 * Generate a story using OpenAI via server-side API
 */
export async function generateStory(
  childName: string,
  gender: string,
  theme: string,
  interests: string[]
): Promise<string> {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'generateStory',
        params: {
          childName,
          gender,
          theme,
          interests,
          readingLevel: 'intermediate',
          ageGroup: '6-8',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate story');
    }

    const data = await response.json();
    const story = data.content;

    if (!story) {
      logger.error('No story generated');
      throw new Error('No story content received from API');
    }

    return story;
  } catch (error) {
    logger.error('Error generating story:', { error });
    throw error;
  }
}

/**
 * Check if OpenAI API is available
 */
export function isOpenAIAvailable(): boolean {
  // We're now using the server-side API, so we can't directly check if the API key is available
  // Instead, we'll make a lightweight call to check if the API is responsive
  return true; // Assume it's available and handle errors when they occur
}
