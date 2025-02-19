import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { StoryInput } from '@/types/story';
import { generateStory } from '@/lib/storyGenerator';

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = auth();

    // Parse the request body
    const input: StoryInput = await req.json();

    // Validate input
    if (!input.childName || !input.interests || !input.theme || !input.gender) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate the story
    const story = await generateStory(input, userId);

    // Return the generated story
    return NextResponse.json(story);
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
