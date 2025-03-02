import { NextRequest, NextResponse } from 'next/server';
import { serverUserPersonalizationEngine } from '@/services/serverPersonalizationEngine';
import { StoryInput } from '@/types/story';
import { getAuth } from '@clerk/nextjs/server';
import { generateStory } from '@/lib/storyGenerator';
import { logger } from '@/utils/logger';
import { env } from '@/lib/env';
import { devAuthMiddleware } from '@/middleware/devAuth';

// Add CORS headers to all responses
function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-clerk-auth-token'
  );
  return response;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return addCorsHeaders(
    new NextResponse(null, {
      status: 200,
    })
  );
}

export async function POST(req: NextRequest) {
  logger.info('Story Generation Route: Received Request');
  logger.info('Request Headers:', Object.fromEntries(req.headers));
  logger.info('Environment:', { environment: env.NODE_ENV });

  try {
    // Get user ID from Clerk authentication
    // If authentication fails, use anonymous user
    let userId = 'anonymous-user';
    try {
      const auth = getAuth();
      const { userId: authenticatedUserId } = auth;
      if (authenticatedUserId) {
        userId = authenticatedUserId;
        logger.info('Authenticated user for story generation', { userId });
      } else {
        logger.info('Using anonymous user for story generation');
      }
    } catch (authError) {
      logger.warn('Authentication error, using anonymous user', { error: authError });
    }
    let input: StoryInput;
    try {
      const jsonData = await req.json();
      input = jsonData as StoryInput;
    } catch (jsonError) {
      logger.error('JSON Parsing Error:', { error: jsonError });

      return addCorsHeaders(
        NextResponse.json(
          {
            message: 'Invalid input',
            error: 'Failed to parse request body',
            ...(env.NODE_ENV === 'development' && {
              fullError: jsonError instanceof Error ? jsonError.stack : 'No stack trace',
            }),
          } as { message: string; error: string; fullError?: string },
          { status: 400 }
        )
      );
    }

    // Initialize engine with user ID
    serverUserPersonalizationEngine.init(userId);

    // Attempt personalized story generation
    let story;
    try {
      logger.info('Attempting personalized story generation...');
      story = await serverUserPersonalizationEngine.generatePersonalizedStory(input);
      logger.info('Personalized Story Generated:', { success: !!story });
    } catch (personalizationError) {
      logger.error('Personalization Error:', { error: personalizationError });
      story = null;
    }

    // If personalization fails, use fallback generation
    if (!story) {
      logger.info('Falling back to basic story generation...');
      try {
        story = await generateStory(input, userId);
        logger.info('Fallback Story Generated:', { success: !!story });
      } catch (fallbackError) {
        logger.error('Fallback Generation Error:', { error: fallbackError });

        return addCorsHeaders(
          NextResponse.json(
            {
              message: 'Failed to generate story after multiple attempts',
              error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error',
              ...(env.NODE_ENV === 'development' && {
                fullError: fallbackError instanceof Error ? fallbackError.stack : 'No stack trace',
                input: JSON.stringify(input),
                userId,
              }),
            } as {
              message: string;
              error: string;
              fullError?: string;
              input?: string;
              userId?: string;
            },
            { status: 500 }
          )
        );
      }
    }

    // Ensure story is valid
    if (!story) {
      logger.error('No story generated after all attempts');

      return addCorsHeaders(
        NextResponse.json(
          {
            message: 'Unable to generate a story',
            ...(env.NODE_ENV === 'development' && {
              input: JSON.stringify(input),
              userId,
            }),
          } as { message: string; input?: string; userId?: string },
          { status: 500 }
        )
      );
    }

    return addCorsHeaders(NextResponse.json(story));
  } catch (error) {
    logger.error('Unexpected Error:', { error });

    return addCorsHeaders(
      NextResponse.json(
        {
          message: error instanceof Error ? error.message : 'Unexpected error generating story',
          error: error instanceof Error ? error.toString() : 'Unknown error',
          ...(env.NODE_ENV === 'development' && {
            fullError: error instanceof Error ? error.stack : 'No stack trace',
          }),
        } as { message: string; error: string; fullError?: string },
        { status: 500 }
      )
    );
  }
}
