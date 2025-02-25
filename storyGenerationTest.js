require('dotenv').config({ path: '.env.local' });
const { userPersonalizationEngine } = require('./dist/services/personalizationEngine');

async function testStoryGeneration() {
  const input = {
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
