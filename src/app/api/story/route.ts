import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { userPersonalizationEngine } from '@/services/personalizationEngine';
import { StoryInput } from '@/types/story';
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from Clerk authentication
    const auth = getAuth(request);
    const { userId } = auth;

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const input: StoryInput = await request.json();

    // Validate required fields
    if (!input.childName || !input.theme) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate story using personalization engine with user ID
    const story = await userPersonalizationEngine.generatePersonalizedStory({
      ...input,
      userId,
    });

    // Log successful story generation
    logger.info('Story generated successfully', {
      userId,
      childName: input.childName,
      theme: input.theme,
      storyId: story.id,
    });

    return NextResponse.json(story);
  } catch (error) {
    // Log error details
    logger.error('Failed to generate story', { error });

    // Return appropriate error response
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}
