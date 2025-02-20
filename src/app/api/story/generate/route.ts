import { NextRequest, NextResponse } from 'next/server';
import { serverUserPersonalizationEngine } from '@/services/serverPersonalizationEngine';
import { StoryInput } from '@/types/story';
import { auth } from '@clerk/nextjs';
import { generateStory } from '@/lib/storyGenerator';
import { logger } from '@/utils/logger';
import { env } from '@/lib/env';
import { devAuthMiddleware } from '@/middleware/devAuth';

async function POST(req: NextRequest) {
  logger.info('Story Generation Route: Received Request');
  logger.info('Request Headers:', Object.fromEntries(req.headers));
  logger.info('Environment:', env.NODE_ENV);

  try {
    // Comprehensive authentication logging
    logger.info('Attempting authentication...');

    // Development authentication fallback
    let authContext;
    try {
      authContext = env.NODE_ENV === 'development' ? devAuthMiddleware(req) || auth() : auth();
    } catch (authError) {
      logger.error('Authentication Error:', authError);
      return NextResponse.json(
        {
          message: 'Authentication failed',
          error: authError instanceof Error ? authError.message : 'Unknown authentication error',
          ...(env.NODE_ENV === 'development' && {
            fullError: authError instanceof Error ? authError.stack : 'No stack trace',
          }),
        },
        { status: 401 }
      );
    }

    logger.info('Auth Context:', authContext);

    const { userId } = authContext;

    logger.info('Authenticated User ID:', userId);

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
        },
        { status: 401 }
      );
    }

    let input: StoryInput;
    try {
      input = await req.json();
    } catch (jsonError) {
      logger.error('JSON Parsing Error:', jsonError);
      return NextResponse.json(
        {
          message: 'Invalid input',
          error: 'Failed to parse request body',
          ...(env.NODE_ENV === 'development' && {
            fullError: jsonError instanceof Error ? jsonError.stack : 'No stack trace',
          }),
        },
        { status: 400 }
      );
    }

    logger.info('Story Input:', input);

    // Validate input with more detailed checks
    const validationErrors: string[] = [];
    if (!input.childName || input.childName.trim() === '') {
      validationErrors.push('Child name is required');
    }
    if (!input.interests || input.interests.length === 0) {
      validationErrors.push('At least one interest is required');
    }
    if (!input.theme) {
      validationErrors.push('Story theme is required');
    }
    if (!input.gender) {
      validationErrors.push('Child gender is required');
    }

    if (validationErrors.length > 0) {
      logger.error('Input Validation Failed:', validationErrors);
      logger.warn('Story generation input validation failed', {
        errors: validationErrors,
        input,
      });
      return NextResponse.json(
        {
          message: 'Invalid input',
          errors: validationErrors,
          ...(env.NODE_ENV === 'development' && {
            fullInput: JSON.stringify(input),
          }),
        },
        { status: 400 }
      );
    }

    // Initialize engine with user ID
    serverUserPersonalizationEngine.setUserId(userId);

    // Attempt personalized story generation with comprehensive error handling
    let story;
    try {
      logger.info('Attempting personalized story generation...');
      story = await serverUserPersonalizationEngine.generatePersonalizedStory(input);
      logger.info('Personalized Story Generated:', !!story);
    } catch (personalizationError) {
      logger.error('Personalization Error:', personalizationError);
      logger.error('Personalized story generation failed', {
        error:
          personalizationError instanceof Error ? personalizationError.message : 'Unknown error',
        stack:
          personalizationError instanceof Error ? personalizationError.stack : 'No stack trace',
        input,
        userId,
      });
      story = null;
    }

    // If personalization fails, explicitly use fallback generation
    if (!story) {
      logger.info('Falling back to basic story generation...');
      logger.warn('Falling back to basic story generation', { input });
      try {
        story = await generateStory(input, userId);
        logger.info('Fallback Story Generated:', !!story);
      } catch (fallbackError) {
        logger.error('Fallback Generation Error:', fallbackError);
        logger.error('Fallback story generation failed', {
          error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error',
          stack: fallbackError instanceof Error ? fallbackError.stack : 'No stack trace',
          input,
          userId,
        });
        return NextResponse.json(
          {
            message: 'Failed to generate story after multiple attempts',
            error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error',
            ...(env.NODE_ENV === 'development' && {
              fullError: fallbackError instanceof Error ? fallbackError.stack : 'No stack trace',
              input: JSON.stringify(input),
              userId,
            }),
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
        },
        { status: 500 }
      );
    }

    // Log successful story generation
    logger.info('Story Generated Successfully');
    logger.info('Story generated successfully', {
      storyId: story.id,
      childName: input.childName,
    });

    return NextResponse.json(story);
  } catch (error) {
    logger.error('Unexpected Error:', error);
    logger.error('Unexpected error in story generation route', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      input: await req.json().catch(() => 'Unable to parse input'),
    });
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unexpected error generating story',
        error: error instanceof Error ? error.toString() : 'Unknown error',
        ...(env.NODE_ENV === 'development' && {
          fullError: error instanceof Error ? error.stack : 'No stack trace',
          input: await req.json().catch(() => 'Unable to parse input'),
        }),
      },
      { status: 500 }
    );
  }
}

export default POST;
