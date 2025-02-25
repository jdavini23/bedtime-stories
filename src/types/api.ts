import { Story, StoryInput } from './story';

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: string;
  code: string;
  message?: string;
  retryAfter?: number;
  details?: string[];
}

/**
 * Story generation API response
 */
export interface StoryResponse {
  id: string;
  content: string;
  createdAt: string;
  input: StoryInput;
  generatedWith?: 'openai' | 'mock';
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    title?: string;
  };
}

/**
 * Type guard to check if a response is an error
 */
export function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' && response !== null && 'error' in response && 'code' in response
  );
}
