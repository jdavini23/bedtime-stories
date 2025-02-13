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
}

const isQuotaError = (error: any): boolean => {
  return error?.status === 429 || 
    error?.message?.includes('quota') || 
    error?.message?.includes('billing');
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

  // Ensure story has a title
  if (!processedStory.startsWith('#')) {
    const firstLine = processedStory.split('\n')[0];
    processedStory = `# ${firstLine}\n\n${processedStory}`;
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

  return processedStory;
};

export async function POST(request: Request) {
  try {
    const input: StoryInput = await request.json();
    
    // Input validation
    if (!input.childName || !input.interests?.length || !input.theme || !input.gender) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = generateCacheKey(input);
    try {
      const cachedStory = await kv?.get(cacheKey);
      if (cachedStory) {
        console.log('Cache hit for:', cacheKey);
        return NextResponse.json(cachedStory);
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    // Use mock generator if OpenAI API key is not available
    if (!process.env.OPENAI_API_KEY) {
      console.log('Falling back to mock story generator');
      const mockStory = generateMockStory(input);
      const response = {
        id: Math.random().toString(36).substr(2, 9),
        content: processStoryText(mockStory),
        createdAt: new Date().toISOString(),
        input,
      };

      // Try to cache the response
      try {
        await kv?.set(cacheKey, response, { ex: CACHE_TTL });
      } catch (error) {
        console.warn('Cache write error:', error);
      }

      return NextResponse.json(response);
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

      // Try to cache the response
      try {
        await kv?.set(cacheKey, response, { ex: CACHE_TTL });
      } catch (error) {
        console.warn('Cache write error:', error);
      }

      return NextResponse.json(response);

    } catch (error: any) {
      console.error('OpenAI API error:', error);

      if (isQuotaError(error)) {
        const retryAfter = parseInt(error.headers?.['retry-after'] || '60', 10);
        return NextResponse.json(
          {
            error: 'API rate limit exceeded',
            code: 'RATE_LIMIT',
            retryAfter
          } as ErrorResponse,
          { status: 429 }
        );
      }

      // Fall back to mock generator for other errors
      console.log('Falling back to mock story generator due to API error');
      const mockStory = generateMockStory(input);
      return NextResponse.json({
        id: Math.random().toString(36).substr(2, 9),
        content: processStoryText(mockStory),
        createdAt: new Date().toISOString(),
        input,
      });
    }

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR'
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
