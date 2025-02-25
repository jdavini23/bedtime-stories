/**
 * Mock Story Generator
 *
 * This module provides functionality to generate mock bedtime stories
 * when the OpenAI API is unavailable or for testing purposes.
 *
 * @module mockStoryGenerator
 */

import { StoryInput } from '@/types/story';
import { processStoryText } from './storyUtils';

/**
 * Story templates for mock generation
 * Each template has a beginning, middle, and ending section
 */
const templates = [
  {
    beginning: 'Once upon a time, there was a child named {name} who loved {interests}.',
    middle:
      'One day, while exploring their favorite activities, {name} discovered something amazing.',
    ending:
      'Through this adventure, {name} learned that with imagination and determination, anything is possible!',
  },
  {
    beginning:
      'In a magical world not too far away, {name} was known for their love of {interests}.',
    middle:
      'During a wonderful day of fun, something unexpected happened that would change everything.',
    ending:
      'And so, {name} discovered that the greatest adventures often start with the things we love most.',
  },
  {
    beginning:
      'There once was a curious child named {name}, whose favorite things in the world were {interests}.',
    middle: 'Little did they know that these interests would lead to an incredible discovery.',
    ending:
      'From that day forward, {name} knew that every day could be filled with wonder and excitement.',
  },
];

/**
 * Theme-specific content generators
 * Each function generates content specific to a story theme
 */
const themeContent = {
  adventure: (
    name: string,
    interests: string,
    pronouns: string,
    possessivePronouns: string
  ): string =>
    `${name} embarked on an exciting journey, using ${possessivePronouns} knowledge of ${interests} to overcome challenges.`,

  fantasy: (
    name: string,
    interests: string,
    pronouns: string,
    possessivePronouns: string
  ): string =>
    `Magical creatures appeared, all sharing ${name}'s passion for ${interests}. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} was amazed by the magical world around ${possessivePronouns}.`,

  educational: (
    name: string,
    interests: string,
    pronouns: string,
    possessivePronouns: string
  ): string =>
    `${name} learned fascinating new things about ${interests}, making discoveries that amazed everyone around ${possessivePronouns}.`,

  friendship: (
    name: string,
    interests: string,
    pronouns: string,
    possessivePronouns: string
  ): string =>
    `${name} discovered the true meaning of friendship while sharing ${possessivePronouns} love for ${interests}. Together with new friends, ${pronouns} created wonderful memories.`,

  courage: (
    name: string,
    interests: string,
    pronouns: string,
    possessivePronouns: string
  ): string =>
    `Facing a challenging situation, ${name} found inner strength through ${possessivePronouns} passion for ${interests}. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} showed incredible bravery.`,

  kindness: (
    name: string,
    interests: string,
    pronouns: string,
    possessivePronouns: string
  ): string =>
    `${name}'s love for ${interests} inspired ${possessivePronouns} to help others. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} learned that small acts of kindness can make a big difference.`,

  curiosity: (
    name: string,
    interests: string,
    pronouns: string,
    possessivePronouns: string
  ): string =>
    `With an insatiable curiosity about ${interests}, ${name} asked questions that led to amazing discoveries. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} never stopped exploring.`,

  creativity: (
    name: string,
    interests: string,
    pronouns: string,
    possessivePronouns: string
  ): string =>
    `${name} used ${possessivePronouns} imagination and love for ${interests} to solve a unique challenge. Creativity knew no bounds!`,

  nature: (name: string, interests: string, pronouns: string, possessivePronouns: string): string =>
    `Exploring the wonders of nature through ${possessivePronouns} passion for ${interests}, ${name} discovered the magic of the natural world.`,

  science: (
    name: string,
    interests: string,
    pronouns: string,
    possessivePronouns: string
  ): string =>
    `${name}'s curiosity about ${interests} led to an exciting scientific adventure. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} learned how science can explain amazing things.`,
};

/**
 * Get pronouns based on gender
 *
 * @param gender - The gender of the child ('boy', 'girl', or other for neutral)
 * @returns Object containing subject and possessive pronouns
 */
const getPronouns = (gender: string): { subject: string; possessive: string } => {
  switch (gender) {
    case 'boy':
      return { subject: 'he', possessive: 'his' };
    case 'girl':
      return { subject: 'she', possessive: 'her' };
    default:
      return { subject: 'they', possessive: 'their' };
  }
};

/**
 * Generates a mock story based on input parameters
 *
 * @param input - The story input parameters
 * @returns A formatted story string
 */
export function generateMockStory(input: StoryInput): string {
  // Select a random template
  const template = templates[Math.floor(Math.random() * templates.length)];

  // Get interests as a string
  const interests =
    input.mostLikedCharacterTypes?.join(' and ') || input.interests?.join(' and ') || 'adventures';

  // Get pronouns based on gender
  const { subject: pronouns, possessive: possessivePronouns } = getPronouns(input.gender);

  // Build the story
  let story =
    template.beginning.replace(/{name}/g, input.childName).replace(/{interests}/g, interests) +
    '\n\n';

  story +=
    template.middle.replace(/{name}/g, input.childName).replace(/{interests}/g, interests) + '\n\n';

  // Add theme-specific content
  const themeGenerator =
    themeContent[input.theme as keyof typeof themeContent] || themeContent.adventure;
  story += themeGenerator(input.childName, interests, pronouns, possessivePronouns) + '\n\n';

  // Add ending
  story += template.ending.replace(/{name}/g, input.childName).replace(/{interests}/g, interests);

  // Add a title
  const titles = [
    `${input.childName}'s ${input.theme.charAt(0).toUpperCase() + input.theme.slice(1)} Adventure`,
    `The ${input.theme.charAt(0).toUpperCase() + input.theme.slice(1)} Journey of ${input.childName}`,
    `${input.childName} and the Magical ${input.theme.charAt(0).toUpperCase() + input.theme.slice(1)}`,
  ];

  const title = titles[Math.floor(Math.random() * titles.length)];
  story = `# ${title}\n\n${story}`;

  return story;
}
