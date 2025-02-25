import { NextRequest, NextResponse } from 'next/server';
import { serverUserPersonalizationEngine } from '@/services/serverPersonalizationEngine';
import { StoryInput } from '@/types/story';
import { auth } from '@clerk/nextjs';
import { generateStory } from '@/lib/storyGenerator';
import { logger } from '@/utils/logger';
import { env } from '@/lib/env';
import { devAuthMiddleware } from '@/middleware/devAuth';

export async function POST(req: NextRequest) {
  logger.info('Story Generation Route: Received Request');
  logger.info('Request Headers:', Object.fromEntries(req.headers));
  logger.info('Environment:', { environment: env.NODE_ENV });

  // Add OPTIONS method handling for CORS
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // Comprehensive authentication logging
    logger.info('Attempting authentication...');

    // Development authentication fallback
    let authContext;
    try {
      const devAuth = env.NODE_ENV === 'development' ? devAuthMiddleware(req) : undefined;
      authContext = devAuth || auth();

      // Log authentication context for debugging
      logger.info('Auth Context:', {
        userId: authContext?.userId,
        isDevAuth: !!devAuth,
        environment: env.NODE_ENV,
      });
    } catch (authError) {
      logger.error('Authentication Error:', {
        error: authError,
        headers: Object.fromEntries(req.headers),
        url: req.url,
        method: req.method,
      });
      return NextResponse.json(
        {
          message: 'Authentication failed',
          error: authError instanceof Error ? authError.message : 'Unknown authentication error',
          ...(env.NODE_ENV === 'development' && {
            fullError: authError instanceof Error ? authError.stack : 'No stack trace',
          }),
        } as { message: string; error: string; fullError?: string },
        { status: 401 }
      );
    }

    const { userId } = authContext;

    logger.info('Authenticated User ID:', { userId });

    // If no user ID is available, return an unauthorized error
    if (!userId) {
      logger.error('No user ID found during authentication');
      logger.warn('Unauthorized story generation attempt');
      return NextResponse.json(
        {
          message: 'Authentication required',
          details: 'No user ID found',
          ...(env.NODE_ENV === 'development' && {
            authContext: JSON.stringify(authContext),
          }),
        } as { message: string; details: string; authContext?: string },
        { status: 401 }
      );
    }

    let input: StoryInput;
    try {
      const jsonData = await req.json();
      input = jsonData as StoryInput;
    } catch (jsonError) {
      logger.error('JSON Parsing Error:', { error: jsonError });
      return NextResponse.json(
        {
          message: 'Invalid input',
          error: 'Failed to parse request body',
          ...(env.NODE_ENV === 'development' && {
            fullError: jsonError instanceof Error ? jsonError.stack : 'No stack trace',
          }),
        } as { message: string; error: string; fullError?: string },
        { status: 400 }
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
        return NextResponse.json(
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
        );
      }
    }

    // Ensure story is valid
    if (!story) {
      logger.error('No story generated after all attempts');
      return NextResponse.json(
        {
          message: 'Unable to generate a story',
          ...(env.NODE_ENV === 'development' && {
            input: JSON.stringify(input),
            userId,
          }),
        } as { message: string; input?: string; userId?: string },
        { status: 500 }
      );
    }

    return NextResponse.json(story);
  } catch (error) {
    logger.error('Unexpected Error:', { error });
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unexpected error generating story',
        error: error instanceof Error ? error.toString() : 'Unknown error',
        ...(env.NODE_ENV === 'development' && {
          fullError: error instanceof Error ? error.stack : 'No stack trace',
        }),
      } as { message: string; error: string; fullError?: string },
      { status: 500 }
    );
  }
}
