import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { StoryInput } from '@/types/story';
import { generateMockStory } from '@/utils/mockStoryGenerator';
import { kv } from '@vercel/kv';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache TTL in seconds (24 hours)
const CACHE_TTL = 24 * 60 * 60;

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

// Check if caching is available
const isCachingEnabled = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

const isQuotaError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null) return false;

  const apiError = error as ApiError;
  return (
    apiError.status === 429 || 
    (typeof apiError.message === 'string' && 
      (apiError.message.includes('quota') || apiError.message.includes('billing')))
  );
};

const generateCacheKey = (input: StoryInput): string => {
  // Create a deterministic cache key from the input
  const sortedInterests = [...input.interests].sort().join(',');
  return `story:${input.childName}:${sortedInterests}:${input.theme}:${input.gender}`;
};

// Improved story text processing
const processStoryText = (story: string): string => {
  // Remove leading/trailing whitespace
  let processedStory = story.trim();

  // Extract title if it exists in markdown format
  const titleMatch = processedStory.match(/^#\s*(.+)$/m);
  if (titleMatch) {
    // Remove the markdown title line and any "Title:" prefix in the content
    processedStory = processedStory
      .replace(/^#\s*.+\n+/, '') // Remove markdown title
      .replace(/^Title:\s*(.+)\n+/m, '') // Remove "Title:" prefix if present
      .trim();
  }

  // Ensure paragraphs are separated by double newlines
  processedStory = processedStory.replace(/\n\s*\n/g, '\n\n');

  // If no paragraphs exist, split into paragraphs every 3-4 sentences
  if (!processedStory.includes('\n\n')) {
    const sentences = processedStory.split(/(?<=[.!?])\s+/);
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 4) {
      paragraphs.push(sentences.slice(i, i + 4).join(' '));
    }
    processedStory = paragraphs.join('\n\n');
  }

  // Ensure proper spacing around dialogue
  processedStory = processedStory.replace(/([.!?])"(\s*)([A-Z])/g, '$1"\n\n$3');
  
  // Add emphasis to character dialogue
  processedStory = processedStory.replace(/"([^"]+)"/g, '*"$1"*');

  // If we found a title, add it back at the beginning with markdown formatting
  if (titleMatch) {
    processedStory = `# ${titleMatch[1]}\n\n${processedStory}`;
  }

  return processedStory;
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const input: StoryInput = await request.json();
    
    // Enhanced input validation
    const validationErrors: string[] = [];
    if (!input.childName?.trim()) validationErrors.push('Child name is required');
    if (!input.interests?.length) validationErrors.push('At least one interest is required');
    if (!input.theme?.trim()) validationErrors.push('Story theme is required');
    if (!input.gender?.trim()) validationErrors.push('Child gender is required');

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: validationErrors,
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      );
    }

    // Check cache if enabled
    if (isCachingEnabled()) {
      const cacheKey = generateCacheKey(input);
      try {
        const cachedStory = await kv.get(cacheKey);
        if (cachedStory) {
          console.log('Cache hit for:', cacheKey);
          return NextResponse.json(cachedStory);
        }
      } catch (error) {
        console.warn('Cache read error:', error);
        // Continue without cache
      }
    }

    // Check if OpenAI API key is available
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    // If no API key, generate mock story
    if (!hasOpenAIKey) {
      console.warn('No OpenAI API key provided. Generating mock story.');
      const mockStory = generateMockStory(input);
      
      return NextResponse.json({
        id: Math.random().toString(36).substr(2, 9),
        content: processStoryText(mockStory),
        createdAt: new Date().toISOString(),
        input,
        generatedWith: 'mock'
      });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
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
              - Adapt story language to be inclusive and respectful`
          },
          {
            role: "user",
            content: `Create a ${input.theme} bedtime story for ${input.childName} who is a ${input.gender} and loves ${input.interests.join(', ')}.`
          }
        ],
        temperature: 0.8,
        max_tokens: 600,
        presence_penalty: 0.2,
        frequency_penalty: 0.5,
      });

      const story = completion.choices[0]?.message?.content;
      if (!story) {
        throw new Error('No story generated');
      }

      const response = {
        id: completion.id,
        content: processStoryText(story),
        createdAt: new Date().toISOString(),
        input,
      };

      // Try to cache the response if caching is enabled
      if (isCachingEnabled()) {
        try {
          await kv.set(generateCacheKey(input), response, { ex: CACHE_TTL });
        } catch (error) {
          console.warn('Cache write error:', error);
          // Continue without cache
        }
      }

      return NextResponse.json(response);

    } catch (error: unknown) {
      console.error('OpenAI API error:', error);
      
      if (isQuotaError(error)) {
        const retryAfter = parseInt((error as ApiError).headers?.['retry-after'] || '60', 10);
        return NextResponse.json(
          {
            error: 'API rate limit exceeded',
            code: 'RATE_LIMIT',
            retryAfter
          } as ErrorResponse,
          { status: 429 }
        );
      }

      // Fall back to mock story generator for other errors
      console.log('Falling back to mock story generator due to API error');
      const mockStory = generateMockStory(input);
      return NextResponse.json({
        id: Math.random().toString(36).substr(2, 9),
        content: processStoryText(mockStory),
        createdAt: new Date().toISOString(),
        input,
        generatedWith: 'mock'
      });
    }

  } catch (error: unknown) {
    console.error('Unexpected error in story generation:', error);
    
    // Comprehensive error response
    const errorResponse = {
      error: 'Story generation failed',
      code: 'GENERATION_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}


