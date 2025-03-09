import { StoryGenerator } from './src/services/personalization/storyGeneration';
import { StoryInput } from './src/types/story';
import { TEST_USER_ID } from './src/utils/test-constants';

const input: StoryInput = {
  childName: 'Alice',
  childAge: 5,
  theme: 'adventure',
  characters: ['brave knight', 'friendly dragon'],
  setting: 'magical forest',
  length: 'medium',
  readingLevel: 'beginner',
};

async function testStoryGeneration() {
  try {
    const storyGenerator = new StoryGenerator(TEST_USER_ID);
    const story = await storyGenerator.generatePersonalizedStory(input);
    console.log('Generated Story:', story);
  } catch (error) {
    console.error('Error generating story:', error);
  }
}

testStoryGeneration();
