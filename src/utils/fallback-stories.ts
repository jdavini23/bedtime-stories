import { StoryInput } from '@/types/story';

/**
 * Generate a simple fallback story when the API story generation fails
 * This avoids circular dependencies between files
 */
export function generateFallbackStory(input: any): string {
  const { childName, theme, gender, mainCharacterTraits = '', interests = [] } = input;

  // Determine pronouns based on gender
  const pronouns = gender === 'boy' ? 'he' : gender === 'girl' ? 'she' : 'they';
  const possessive = gender === 'boy' ? 'his' : gender === 'girl' ? 'her' : 'their';
  const reflexive = gender === 'boy' ? 'himself' : gender === 'girl' ? 'herself' : 'themselves';

  // Create settings and characters based on theme
  const settings: Record<string, string> = {
    adventure: 'magical forest',
    fantasy: 'enchanted kingdom',
    science: 'space station',
    nature: 'peaceful meadow',
    friendship: 'friendly neighborhood',
    educational: 'curious classroom',
    courage: 'challenging mountain',
    kindness: 'village in need',
    curiosity: 'mysterious cave',
    creativity: 'artist workshop',
  };

  const companions: Record<string, string> = {
    adventure: 'brave explorer',
    fantasy: 'friendly dragon',
    science: 'robot helper',
    nature: 'talking fox',
    friendship: 'new friend',
    educational: 'wise owl',
    courage: 'loyal companion',
    kindness: 'grateful squirrel',
    curiosity: 'curious rabbit',
    creativity: 'colorful bird',
  };

  const setting = settings[theme] || 'magical land';
  const companion = companions[theme] || 'friendly animal';
  const trait = mainCharacterTraits || 'brave and kind';
  const interest = interests && interests.length > 0 ? interests[0] : 'exploring';

  // Generate the fallback story with the available information
  return `
# ${childName}'s ${theme.charAt(0).toUpperCase() + theme.slice(1)} Adventure

Once upon a time, there was a ${trait} child named ${childName}. ${childName} loved ${interest} more than anything else.

One beautiful morning, ${childName} discovered a path leading to a ${setting} that ${pronouns} had never seen before. "I wonder what adventures await me there," ${childName} thought with excitement.

As ${pronouns} explored the ${setting}, ${childName} met a ${companion} named Sparkle. "Hello, ${childName}!" said Sparkle. "I've been waiting for someone like you to help me with a special mission."

Sparkle explained that they needed to find the Crystal of Wisdom, which was hidden somewhere in the ${setting}. This crystal had the power to bring happiness to everyone in the land.

"Will you help me find it?" Sparkle asked.

${childName} smiled and nodded. "Of course I'll help!" ${pronouns} replied.

Together, ${childName} and Sparkle followed a map that led them through tall grasses, across a bubbling stream, and past ancient trees that seemed to whisper secrets.

Along the way, they faced challenges that required ${childName} to use ${possessive} knowledge of ${interest}. When they reached a puzzle door, ${childName}'s clever mind quickly solved it.

"You're amazing!" Sparkle exclaimed. "I couldn't have done this without you."

Finally, they reached a small cave where the Crystal of Wisdom glowed with a gentle blue light. ${childName} carefully picked it up, feeling its warmth in ${possessive} hands.

As soon as ${pronouns} touched it, the crystal shone brighter, filling the ${setting} with beautiful colors.

"The crystal responds to your kind heart," Sparkle explained. "It knows that you will use its power wisely."

${childName} and Sparkle brought the crystal back to the center of the ${setting}, where its light spread happiness to everyone around. The inhabitants celebrated and thanked ${childName} for ${possessive} bravery and kindness.

That night, as ${childName} returned home, ${pronouns} realized that the greatest adventure is helping others and being true to ${reflexive}. ${childName} couldn't wait to tell everyone about ${possessive} amazing journey and the friends ${pronouns} had made along the way.

And whenever ${childName} looked up at the stars, ${pronouns} remembered the magical ${setting} and knew that new adventures would always be waiting.

The End
  `;
}

/**
 * Generate a simple error message when everything fails
 */
export function generateErrorMessage(childName: string): string {
  return `
# A Special Message for ${childName}

Oh no! Our story fairies seem to be taking a little nap right now, and couldn't finish your special story.

But don't worry, ${childName}! You can try again in just a moment, and our story fairies will be ready with a magical adventure just for you!

In the meantime, remember that YOU are the hero of your own story, and we can't wait to tell you all about your amazing adventures soon!
  `;
}
