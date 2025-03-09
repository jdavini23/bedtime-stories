import { Story, StoryInput } from '@/types/story';
import { StoryGenerator } from '@/services/personalization';

export async function generateStory(input: StoryInput, userId?: string): Promise<Story> {
  try {
    const engine = new StoryGenerator(userId);
    const story = await engine.generatePersonalizedStory(input);
    if (!story) {
      throw new Error('Failed to generate story');
    }
    return story;
  } catch (error) {
    throw new Error('Failed to generate story: ' + (error as Error).message);
  }
}
