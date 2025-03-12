import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { logger } from '@/utils/logger';
import {
  handleOpenAIError,
  generateFallbackStoryUtil,
  validateApiKey,
  serializeError,
  type OpenAIErrorResponse,
} from '@/utils/error-handlers';

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Log API key format for debugging (safely)
if (OPENAI_API_KEY) {
  const keyType = OPENAI_API_KEY.startsWith('sk-proj-') ? 'project' : 'standard';
  const maskedKey =
    OPENAI_API_KEY.substring(0, 7) + '...' + OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 3);
  logger.info(`OpenAI API key format: ${keyType}`, { keyFormat: maskedKey });
} else {
  logger.error('OpenAI API key is not defined in environment variables');
}

/**
 * Direct call to OpenAI API using fetch instead of the client library
 */
async function callOpenAIDirectly(messages: any[], model: string = 'gpt-3.5-turbo') {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    logger.debug('Making direct OpenAI API call', { model });

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: 'Failed to parse error response' }));

      // Log detailed information about the error
      logger.error('Direct OpenAI API call failed', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: OPENAI_API_URL,
        headers: {
          'Content-Type': 'application/json',
          // Don't log the full Authorization header for security reasons
          Authorization: 'Bearer sk-***',
        },
      });

      // Check for specific OpenAI server errors
      if (response.status === 500) {
        logger.warn('OpenAI server error detected (500)', {
          message: "This is an issue on OpenAI's servers, not with our code.",
        });
        throw new Error(
          'OpenAI server error: The server had an error while processing your request.'
        );
      }

      throw new Error(
        `OpenAI API returned ${response.status}: ${errorData.error || response.statusText}`
      );
    }

    const data = await response.json();
    logger.info('Direct OpenAI API call successful', {
      model: data.model,
      usage: data.usage,
    });

    return data;
  } catch (error) {
    // Check if it's a network error (like CORS, timeout, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      logger.error('Network error when calling OpenAI API', { error: error.message });
      throw new Error('Network error when calling OpenAI API: ' + error.message);
    }

    logger.error('Error in direct OpenAI API call', serializeError(error));
    throw error;
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
    if (!validateApiKey(OPENAI_API_KEY)) {
      return NextResponse.json(
        { error: 'API configuration error', message: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Log the request
    logger.info('Generating story', {
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
    `;

    // Call OpenAI API directly with timeout and retry logic
    try {
      const messages = [
        { role: 'system', content: "You are a creative children's storyteller." },
        { role: 'user', content: prompt },
      ];

      // Implement retry logic for OpenAI server errors
      let retryCount = 0;
      const maxRetries = 2;
      let lastError: Error | null = null;

      while (retryCount <= maxRetries) {
        try {
          // Use AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            logger.warn('Aborting direct OpenAI API call due to timeout');
          }, 45000); // 45 second timeout

          // Make the API call with timeout
          const fetchPromise = callOpenAIDirectly(messages);
          const response = await Promise.race([
            fetchPromise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('OpenAI API request timeout')), 45000)
            ),
          ]);

          clearTimeout(timeoutId);

          // Extract and return the story content
          const content =
            response.choices[0]?.message?.content || generateFallbackStoryUtil(params);

          logger.info('Story generated successfully', {
            userId,
            contentLength: content.length,
            model: response.model,
            usage: response.usage,
          });

          return NextResponse.json({
            content,
            model: response.model,
            usage: response.usage,
          });
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          // Only retry on server errors (500)
          if (lastError.message.includes('500') || lastError.message.includes('server error')) {
            retryCount++;
            const retryDelay = retryCount * 1000; // Exponential backoff

            logger.warn(`OpenAI server error, retrying (${retryCount}/${maxRetries})`, {
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

      // If we've exhausted retries, throw the last error
      if (lastError) {
        logger.error('Exhausted retries for OpenAI API call', {
          error: lastError.message,
          retries: maxRetries,
        });
        throw lastError;
      }
    } catch (apiError) {
      // Log the specific API error
      logger.error('OpenAI API call failed after retries', serializeError(apiError));

      // Generate fallback content
      const fallbackContent = generateFallbackStoryUtil(params);

      // Return error with fallback content
      return NextResponse.json(
        {
          error: 'OpenAI API error',
          message: apiError instanceof Error ? apiError.message : 'Unknown error occurred',
          content: fallbackContent,
          fallback: true,
        },
        { status: 503 }
      ); // Service Unavailable
    }
  } catch (error) {
    // Handle OpenAI API errors
    const errorResponse = handleOpenAIError(error);

    // Log the error with detailed information
    logger.error('Failed to generate story with OpenAI API', {
      error: errorResponse.error,
      message: errorResponse.message,
      status: errorResponse.status,
      originalError: serializeError(error),
    });

    // Generate fallback story for the user
    const fallbackContent = generateFallbackStoryUtil(params);

    // Return error with fallback content
    return NextResponse.json(
      {
        error: errorResponse.error,
        message: errorResponse.message,
        content: fallbackContent, // Always provide content even on error
        fallback: true,
      },
      { status: errorResponse.status || 500 }
    );
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
    if (!validateApiKey(OPENAI_API_KEY)) {
      return NextResponse.json(
        { error: 'API configuration error', message: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Log the request
    logger.info('Processing chat completion', {
      userId,
      messageCount: params.messages.length,
    });

    // Call OpenAI API directly
    try {
      const response = await callOpenAIDirectly(params.messages, params.model || 'gpt-3.5-turbo');

      // Extract and return the content
      const content = response.choices[0]?.message?.content || '';

      logger.info('Chat completion generated successfully', {
        userId,
        contentLength: content.length,
        model: response.model,
        usage: response.usage,
      });

      return NextResponse.json({
        content,
        model: response.model,
        usage: response.usage,
      });
    } catch (apiError) {
      // Log the specific API error
      logger.error('OpenAI API call failed', serializeError(apiError));

      // Return error
      return NextResponse.json(
        {
          error: 'OpenAI API error',
          message: apiError instanceof Error ? apiError.message : 'Unknown error occurred',
        },
        { status: 503 }
      ); // Service Unavailable
    }
  } catch (error) {
    // Handle OpenAI API errors
    const errorResponse = handleOpenAIError(error);

    return NextResponse.json(
      {
        error: errorResponse.error,
        message: errorResponse.message,
      },
      { status: errorResponse.status || 500 }
    );
  }
}

/**
 * Main API route handler
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const auth = getAuth(request);
    const userId = auth.userId;

    // In development mode, allow unauthenticated requests for easier testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isAuthenticated = !!userId;

    if (!isAuthenticated && !isDevelopment) {
      logger.warn('Unauthorized access attempt to OpenAI API');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Use a default user ID for development if not authenticated
    const effectiveUserId = userId || 'dev-user-' + Date.now();

    // Log the auth state
    logger.info('API request authentication', {
      isAuthenticated,
      isDevelopment,
      userId: effectiveUserId,
    });

    // Parse request body
    const body = await request.json();
    const { operation, params } = body;

    // Validate operation
    if (!operation) {
      return NextResponse.json({ error: 'Missing required parameter: operation' }, { status: 400 });
    }

    // Route to appropriate handler
    switch (operation) {
      case 'generateStory':
        return handleGenerateStory(params, effectiveUserId);
      case 'chatCompletion':
        return handleChatCompletion(params, effectiveUserId);
      default:
        return NextResponse.json({ error: `Unsupported operation: ${operation}` }, { status: 400 });
    }
  } catch (error) {
    // Handle unexpected errors
    logger.error('Unexpected error in OpenAI API route', serializeError(error));

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
