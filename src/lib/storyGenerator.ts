import { StoryInput, Story } from '@/types/story';

export async function generateStory(input: StoryInput, userId?: string | null): Promise<Story> {
  // For now, return a mock story
  const story: Story = {
    id: Math.random().toString(36).substring(7),
    title: `${input.childName}'s ${input.theme} Adventure`,
    content: `Once upon a time, there was a ${input.gender === 'neutral' ? 'child' : input.gender} named ${input.childName} who loved ${input.interests.join(' and ')}. 
    
    One day, while exploring their favorite activities, something magical happened...
    
    [This is a placeholder story. The actual story generation will be implemented with OpenAI or a similar service.]`,
    theme: input.theme,
    createdAt: new Date().toISOString(),
    input: input,
    userId: userId,
  };

  return story;
}
