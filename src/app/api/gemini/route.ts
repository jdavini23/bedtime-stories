import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { logger } from '@/utils/logger';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StoryInput } from '@/types/story';
import { serializeError, handleGeminiError, validateGeminiApiKey } from '@/utils/error-handlers';
import { generateFallbackStory } from '@/utils/fallback-generator';

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_MODEL = 'gemini-1.5-pro';

// Log API key format for debugging (safely)
if (GEMINI_API_KEY) {
  const maskedKey =
    GEMINI_API_KEY.substring(0, 3) + '...' + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 3);
  logger.info('Gemini API key configured', { keyFormat: maskedKey });
} else {
  logger.error('Gemini API key is not defined in environment variables');
}

/**
 * Direct call to Gemini API
 */
async function callGeminiAPI(prompt: string, model: string = DEFAULT_MODEL) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  if (!prompt) {
    throw new Error('Prompt is required for Gemini API call');
  }

  try {
    logger.debug('Making Gemini API call', { model });

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const geminiModel = genAI.getGenerativeModel({ model });

    const result = await geminiModel.generateContent(prompt);

    // Check if the response is blocked or has other issues
    if (!result.response.candidates || result.response.candidates.length === 0) {
      throw new Error('No valid response from Gemini API');
    }

    const text = result.response.text();

    // Validate the response text
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    logger.info('Gemini API call successful', {
      model,
      responseLength: text.length,
    });

    return {
      content: text,
      model,
      usage: {
        promptTokens: prompt.length / 4, // Rough estimate
        completionTokens: text.length / 4, // Rough estimate
        totalTokens: (prompt.length + text.length) / 4, // Rough estimate
      },
    };
  } catch (error) {
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      logger.error('Network error when calling Gemini API', { error: error.message });
      throw new Error('Network error when calling Gemini API: ' + error.message);
    }
    // Log the full error for debugging
    logger.error('Error in Gemini API call', { error: serializeError(error) });
    logger.debug('Type of error', { type: typeof error });

    // Ensure error is properly formatted
    const formattedError = {
      error: 'Gemini API Error',
      message: error instanceof Error ? error.message : String(error),
      details:
        typeof error === 'object' && error !== null
          ? serializeError(error)
          : { message: String(error), type: typeof error },
    };

    throw formattedError;
  }
}

/**
 * Handle story generation with comprehensive error handling
 */
async function handleGenerateStory(params: any, userId: string) {
  try {
    // Validate required parameters
    if (!params || !params.childName || !params.theme) {
      return NextResponse.json(
        { error: 'Missing required parameters for story generation' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!validateGeminiApiKey(GEMINI_API_KEY)) {
      return NextResponse.json(
        { error: 'API configuration error', message: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Log the request
    logger.info('Generating story with Gemini', {
      userId,
      childName: params.childName,
      theme: params.theme,
      gender: params.gender || 'not specified',
      interests: params.interests || [],
    });

    // Prepare the prompt
    const prompt = `
      Create a short bedtime story for a child named ${params.childName}.
      The story should be about ${params.theme}.
      ${params.gender ? `The child identifies as ${params.gender}.` : ''}
      ${params.interests?.length ? `The child is interested in: ${params.interests.join(', ')}.` : ''}
      The story should be appropriate for a young child and have a positive message.
      Keep it under 500 words.
      
      Format the story with a title at the beginning, and then the story content.
      Make sure the title is creative and engaging.
    `;

    // Implement retry logic for Gemini server errors
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;

    while (retryCount <= maxRetries) {
      try {
        // Use AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          logger.warn('Aborting Gemini API call due to timeout');
        }, 45000); // 45 second timeout

        // Make the API call with timeout
        const fetchPromise = callGeminiAPI(prompt);
        const response = await Promise.race([
          fetchPromise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API request timeout')), 45000)
          ),
        ]);

        clearTimeout(timeoutId);
        // Extract and return the story content
        const content = (response as { content: string }).content;
        if (!content) {
          throw new Error('No content returned from Gemini API');
        }

        logger.info('Story generated successfully with Gemini', {
          userId,
          contentLength: content.length,
          model: (response as any).model,
        });

        return NextResponse.json({
          content,
          model: (response as any).model,
          usage: (response as any).usage,
        });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Only retry on server errors
        if (lastError.message.includes('500') || lastError.message.includes('server error')) {
          retryCount++;
          const retryDelay = retryCount * 1000; // Exponential backoff

          logger.warn(`Gemini server error, retrying (${retryCount}/${maxRetries})`, {
            error: lastError.message,
            retryDelay,
          });

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          // For other errors, don't retry
          throw lastError;
        }
      }
    }

    // If we've exhausted retries, use fallback
    if (lastError) {
      logger.error('Gemini API call failed after retries', {
        error: lastError.message,
        retries: maxRetries,
      });
      // Generate fallback story
      const fallbackStory = generateFallbackStory(params);
      logger.info('Using fallback story after Gemini API failure', {
        contentLength: fallbackStory.content.length,
      });

      return NextResponse.json({
        content: fallbackStory.content,
        model: 'fallback-generator',
        fallback: true,
      });
    }

    // This should never happen, but just in case
    return NextResponse.json(
      {
        error: 'Unknown error in story generation',
        message: 'Failed to generate story after multiple attempts',
      },
      { status: 500 }
    );
  } catch (error) {
    logger.error('Error in handleGenerateStory', serializeError(error));

    // Handle specific error types
    const errorResponse = handleGeminiError(error);

    // If it's a server error, generate a fallback story
    if (errorResponse.status >= 500) {
      const fallbackStory = generateFallbackStory(params);

      logger.info('Using fallback story after error', {
        errorType: errorResponse.error,
        contentLength: fallbackStory.content.length,
      });

      return NextResponse.json({
        content: fallbackStory,
        model: 'fallback-generator',
        fallback: true,
        originalError: errorResponse.error,
      });
    }

    // Otherwise return the error
    return NextResponse.json(errorResponse, { status: errorResponse.status || 500 });
  }
}

/**
 * Handle chat completion requests
 */
async function handleChatCompletion(params: any, userId: string) {
  try {
    // Validate required parameters
    if (!params || !params.messages || !Array.isArray(params.messages)) {
      return NextResponse.json({ error: 'Missing or invalid messages parameter' }, { status: 400 });
    }

    // Validate API key
    if (!validateGeminiApiKey(GEMINI_API_KEY)) {
      return NextResponse.json(
        { error: 'API configuration error', message: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Extract the messages and convert to a format Gemini can understand
    const messages = params.messages;
    const prompt = messages[messages.length - 1]?.content || '';

    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid request', message: 'No message content provided' },
        { status: 400 }
      );
    }

    // Call the Gemini API
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const geminiModel = genAI.getGenerativeModel({ model: DEFAULT_MODEL });

    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      content: text,
      model: DEFAULT_MODEL,
      usage: {
        promptTokens: prompt.length / 4, // Rough estimate
        completionTokens: text.length / 4, // Rough estimate
        totalTokens: (prompt.length + text.length) / 4, // Rough estimate
      },
    });
  } catch (error) {
    logger.error('Error in chat completion', serializeError(error));
    const errorResponse = handleGeminiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status || 500 });
  }
}

/**
 * Main API route handler
 */
export async function POST(request: Request) {
  try {
    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error', message: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    logger.debug('Received request body', {
      type: body.type,
      hasInput: !!body.input,
      hasPrompt: !!body.prompt,
    });

    // Route the request based on type
    if (body.type === 'story') {
      return handleGenerateStory(body.input, 'default-user');
    } else if (body.type === 'chat') {
      return handleChatCompletion(body, 'default-user');
    } else {
      // Handle direct prompt if no specific type
      const { prompt } = body;
      if (!prompt) {
        return NextResponse.json(
          { error: 'Invalid request', message: 'Prompt is required' },
          { status: 400 }
        );
      }

      const result = await callGeminiAPI(prompt);
      return NextResponse.json(result);
    }
  } catch (error) {
    logger.error('Error in API route handler', { error: serializeError(error) });
    return NextResponse.json(
      {
        error: 'Gemini API Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
