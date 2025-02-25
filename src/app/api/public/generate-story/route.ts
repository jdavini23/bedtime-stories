import { NextRequest, NextResponse } from 'next/server';
import { StoryInput } from '@/types/story';
import { generateStory } from '@/lib/storyGenerator';
import { logger } from '@/utils/logger';
import { env } from '@/lib/env';

// Add CORS headers to all responses
function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
  logger.info('Public Story Generation Route: Received Request');

  try {
    // Use a fixed anonymous user ID - no authentication required
    const userId = 'anonymous-user';

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
          },
          { status: 400 }
        )
      );
    }

    // Generate the story directly without personalization
    try {
      logger.info('Generating public story...');
      const story = await generateStory(input, userId);

      if (!story) {
        throw new Error('Failed to generate story');
      }

      logger.info('Public Story Generated Successfully');
      return addCorsHeaders(NextResponse.json(story));
    } catch (error) {
      logger.error('Story Generation Error:', { error });

      return addCorsHeaders(
        NextResponse.json(
          {
            message: 'Failed to generate story',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
          { status: 500 }
        )
      );
    }
  } catch (error) {
    logger.error('Unexpected Error:', { error });

    return addCorsHeaders(
      NextResponse.json(
        {
          message: 'Unexpected error generating story',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    );
  }
}
