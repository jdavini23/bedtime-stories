import { NextRequest, NextResponse } from 'next/server';
import { serverStoryPersonalizationEngine } from '@/services/serverPersonalizationEngine';
import { StoryInput } from '@/types/story';
import { auth } from '@clerk/nextjs';
import { generateStory } from '@/lib/storyGenerator';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const input: StoryInput = await req.json();

    // Validate input
    if (!input.childName || !input.interests || !input.theme || !input.gender) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize engine with user ID
    serverStoryPersonalizationEngine.setUserId(userId);

    // Generate personalized story
    const story = await serverStoryPersonalizationEngine.generatePersonalizedStory(input);

    // If personalization fails, fall back to basic story generation
    if (!story) {
      const fallbackStory = await generateStory(input, userId);
      return NextResponse.json(fallbackStory);
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    );
  }
}
