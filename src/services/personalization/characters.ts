import { StoryCharacter } from './types';

// Define character traits for more detailed character customization
export const CHARACTER_TRAITS: Record<string, string[]> = {
  personality: [
    'brave',
    'curious',
    'kind',
    'clever',
    'creative',
    'funny',
    'adventurous',
    'thoughtful',
    'determined',
    'gentle',
    'energetic',
    'patient',
    'helpful',
  ],
  appearance: [
    'curly hair',
    'straight hair',
    'glasses',
    'bright eyes',
    'freckles',
    'tall',
    'small',
    'athletic',
    'colorful clothes',
    'favorite hat',
  ],
  skills: [
    'good at sports',
    'loves to read',
    'great at puzzles',
    'artistic',
    'musical',
    'good with animals',
    'great storyteller',
    'fast runner',
    'good listener',
  ],
};

// Define character archetypes for supporting characters
export const CHARACTER_ARCHETYPES: string[] = [
  'wise mentor',
  'loyal friend',
  'mischievous sidekick',
  'protective guardian',
  'curious explorer',
  'skilled teacher',
  'mysterious stranger',
  'playful companion',
  'brave hero',
  'clever inventor',
  'kind healer',
  'magical guide',
];

// Helper method to generate a random character
export function generateRandomCharacter(
  type: 'human' | 'animal' | 'magical' | 'robot' | 'other' = 'animal'
): StoryCharacter {
  const personality =
    CHARACTER_TRAITS.personality[Math.floor(Math.random() * CHARACTER_TRAITS.personality.length)];
  const archetype = CHARACTER_ARCHETYPES[Math.floor(Math.random() * CHARACTER_ARCHETYPES.length)];

  return {
    name: '', // Empty name to be filled by the user
    type,
    traits: [personality],
    role: archetype,
    description: `A ${personality} ${type} who is a ${archetype}`,
  };
}
