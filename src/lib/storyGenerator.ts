import { Story, StoryInput } from '@/types/story';
import { UserPersonalizationEngine } from '@/services/personalizationEngine';

export async function generateStory(input: StoryInput, userId?: string): Promise<Story> {
  try {
    const engine = new UserPersonalizationEngine(userId);
    const story = await engine.generatePersonalizedStory(input);
    if (!story) {
      throw new Error('Failed to generate story');
    }
    return story;
  } catch (error) {
    throw new Error('Failed to generate story: ' + (error as Error).message);
  }
}
