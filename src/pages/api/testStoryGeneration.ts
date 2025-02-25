import { NextApiRequest, NextApiResponse } from 'next';
import { userPersonalizationEngine } from '@/services/personalizationEngine';
import { StoryInput } from '@/types/story';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const input: StoryInput = {
    childName: 'Alice',
    gender: 'girl',
    theme: 'adventure',
    interests: ['magic', 'animals'],
  };

  try {
    const story = await userPersonalizationEngine.generatePersonalizedStory(input);
    res.status(200).json({ story });
  } catch (error) {
    console.error('Story generation failed:', error);
    res.status(500).json({ error: 'Story generation failed' });
  }
}
