import { StoryInput, Story } from '@/types/story';
import OpenAI from 'openai';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateStory(input: StoryInput, userId?: string | null): Promise<Story> {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    logger.error('OpenAI API key is missing');
    logger.error('Story generation is currently unavailable. Please contact support.');
  }

  try {
    const prompt = `Write a ${input.mood} children's story about a ${input.gender} named ${input.childName} who loves ${input.interests.join(', ')}. 
    The story should have a ${input.theme} theme and include the characters: ${input.favoriteCharacters.join(', ')}. 
    Make the story engaging, age-appropriate, and no longer than 500 words.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.7,
    });

    const storyContent = response.choices[0].message.content?.trim() || 'No story generated';

    const story: Story | null = {
      id: uuidv4(),
      title: `${input.childName}'s ${input.theme} Adventure`,
      content: storyContent,
      theme: input.theme,
      createdAt: new Date().toISOString(),
      input: input,
      userId: userId,
      metadata: {
        pronouns: input.gender === 'girl' ? 'she' : input.gender === 'boy' ? 'he' : 'they',
        possessivePronouns:
          input.gender === 'girl' ? 'her' : input.gender === 'boy' ? 'his' : 'their',
        generatedAt: new Date().toISOString(),
      },
      pronouns: input.gender === 'girl' ? 'she' : input.gender === 'boy' ? 'he' : 'they',
      possessivePronouns:
        input.gender === 'girl' ? 'her' : input.gender === 'boy' ? 'his' : 'their',
      generatedAt: new Date().toISOString(),
    };

    return story;
  } catch (error) {
    logger.error('Story generation failed', { error, input });
    logger.error('Failed to generate story. Please try again later.');
  }
}
