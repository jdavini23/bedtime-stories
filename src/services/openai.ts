import OpenAI from 'openai';
import { env } from '@/lib/env';
import { logger } from '@/utils/logger';
import { OPENAI_MODELS } from '@/constants';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
});

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
 * Generate a story using OpenAI
 */
export async function generateStory(
  childName: string,
  gender: string,
  theme: string,
  interests: string[]
): Promise<string> {
  // Set up a timeout for the OpenAI request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.API_TIMEOUT_MS);

  try {
    const completion = await openai.chat.completions.create(
      {
        model: OPENAI_MODELS.GPT_3_5_TURBO,
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
            content: `Create a ${theme} bedtime story for ${childName} who is a ${gender} and loves ${interests.join(', ')}.`,
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

    return story;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Check if OpenAI API is available
 */
export function isOpenAIAvailable(): boolean {
  return !!env.NEXT_PUBLIC_OPENAI_API_KEY;
}
