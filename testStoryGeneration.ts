import { userPersonalizationEngine } from './src/services/personalizationEngine';
import { StoryInput } from '@/types/story';

async function testStoryGeneration() {
  const input: StoryInput = {
    childName: 'Alice',
    gender: 'girl',
    theme: 'adventure',
    interests: ['magic', 'animals'],
  };

  try {
    const story = await userPersonalizationEngine.generatePersonalizedStory(input);
    console.log('Generated Story:', story);
  } catch (error) {
    console.error('Story generation failed:', error);
  }
}

testStoryGeneration();
