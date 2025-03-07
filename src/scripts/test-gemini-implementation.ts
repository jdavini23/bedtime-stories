import { UserPersonalizationEngine } from '../services/personalizationEngine';
import { StoryInput } from '../types/story';

async function testGeminiImplementation() {
  // Provide a valid userId
  const userId = 'test-user';
  const engine = new UserPersonalizationEngine(userId);

  // Mock input data for testing
  const input: StoryInput = {
    childName: 'Alex',
    interests: ['dinosaurs', 'space'],
    theme: 'adventure',
    gender: 'neutral', // Updated gender to match expected type
    favoriteCharacters: ['Dino', 'Rocket'],
    mostLikedCharacterTypes: ['funny', 'brave'],
  };

  try {
    const story = await engine.generatePersonalizedStory(input);
    console.log('Generated Story:', story);
  } catch (error) {
    console.error('Error generating story:', error);
  }
}

// Run the test
testGeminiImplementation();
