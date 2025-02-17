import { StoryInput } from '@/types/story';

// Function to process story text (same as in route.ts)
const processStoryText = (story: string): string => {
  // Remove leading/trailing whitespace
  let processedStory = story.trim();

  // Ensure paragraphs are separated by double newlines
  processedStory = processedStory.replace(/\n\s*\n/g, '\n\n');

  // If no paragraphs exist, split into paragraphs every 3-4 sentences
  if (!processedStory.includes('\n\n')) {
    const sentences = processedStory.split(/(?<=[.!?])\s+/);
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 4) {
      paragraphs.push(sentences.slice(i, i + 4).join(' '));
    }
    processedStory = paragraphs.join('\n\n');
  }

  return processedStory;
};

const templates = [
  {
    beginning: "Once upon a time, there was a child named {name} who loved {interests}.",
    middle: "One day, while exploring their favorite activities, {name} discovered something amazing.",
    ending: "Through this adventure, {name} learned that with imagination and determination, anything is possible!"
  },
  {
    beginning: "In a magical world not too far away, {name} was known for their love of {interests}.",
    middle: "During a wonderful day of fun, something unexpected happened that would change everything.",
    ending: "And so, {name} discovered that the greatest adventures often start with the things we love most."
  },
  {
    beginning: "There once was a curious child named {name}, whose favorite things in the world were {interests}.",
    middle: "Little did they know that these interests would lead to an incredible discovery.",
    ending: "From that day forward, {name} knew that every day could be filled with wonder and excitement."
  }
];

export function generateMockStory(input: StoryInput): string {
  const template = templates[Math.floor(Math.random() * templates.length)];
  const interests = input.interests.join(' and ');
  
  let story = template.beginning.replace(/{name}/g, input.childName).replace(/{interests}/g, interests) + '\n\n';
  story += template.middle.replace(/{name}/g, input.childName).replace(/{interests}/g, interests) + '\n\n';
  
  // Add theme-specific content with gender considerations
  const pronouns = input.gender === 'boy' ? 'he' : 
                   input.gender === 'girl' ? 'she' : 
                   'they';
  const possessivePronouns = input.gender === 'boy' ? 'his' : 
                              input.gender === 'girl' ? 'her' : 
                              'their';
  
  switch (input.theme) {
    case 'adventure':
      story += `${input.childName} embarked on an exciting journey, using ${possessivePronouns} knowledge of ${interests} to overcome challenges.\n\n`;
      break;
    case 'fantasy':
      story += `Magical creatures appeared, all sharing ${input.childName}'s passion for ${interests}. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} was amazed by the magical world around ${possessivePronouns}.\n\n`;
      break;
    case 'educational':
      story += `${input.childName} learned fascinating new things about ${interests}, making discoveries that amazed everyone around ${possessivePronouns}.\n\n`;
      break;
    case 'friendship':
      story += `${input.childName} discovered the true meaning of friendship while sharing ${possessivePronouns} love for ${interests}. Together with new friends, ${pronouns} created wonderful memories.\n\n`;
      break;
    case 'courage':
      story += `Facing a challenging situation, ${input.childName} found inner strength through ${possessivePronouns} passion for ${interests}. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} showed incredible bravery.\n\n`;
      break;
    case 'kindness':
      story += `${input.childName}'s love for ${interests} inspired ${possessivePronouns} to help others. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} learned that small acts of kindness can make a big difference.\n\n`;
      break;
    case 'curiosity':
      story += `With an insatiable curiosity about ${interests}, ${input.childName} asked questions that led to amazing discoveries. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} never stopped exploring.\n\n`;
      break;
    case 'creativity':
      story += `${input.childName} used ${possessivePronouns} imagination and love for ${interests} to solve a unique challenge. Creativity knew no bounds!\n\n`;
      break;
    case 'nature':
      story += `Exploring the wonders of nature through ${possessivePronouns} passion for ${interests}, ${input.childName} discovered the magic of the natural world.\n\n`;
      break;
    case 'science':
      story += `${input.childName}'s curiosity about ${interests} led to an exciting scientific adventure. ${pronouns.charAt(0).toUpperCase() + pronouns.slice(1)} learned how science can explain amazing things.\n\n`;
      break;
  }
  
  story += template.ending.replace(/{name}/g, input.childName).replace(/{interests}/g, interests);
  
  // Process the story text to improve readability
  return processStoryText(story);
}


