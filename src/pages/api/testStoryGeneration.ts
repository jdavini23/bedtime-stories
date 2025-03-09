import { NextApiRequest, NextApiResponse } from 'next';
import { StoryGenerator } from '@/services/personalization/storyGeneration';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const input = req.body;
    const storyGenerator = new StoryGenerator('test-user');
    const story = await storyGenerator.generatePersonalizedStory(input);
    res.status(200).json(story);
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
}
