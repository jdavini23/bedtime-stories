import OpenAI from 'openai';
import { logger } from '@/utils/loggerInstance';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStory(input: any, userId: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a creative storyteller who writes engaging, age-appropriate stories for children. Your stories should be imaginative, educational, and fun.',
        },
        {
          role: 'user',
          content: `Please write a story with the following parameters:
            - Theme: ${input.theme || 'Adventure'}
            - Age Range: ${input.ageRange || '5-8 years'}
            - Length: ${input.length || 'Medium (500-800 words)'}
            - Main Character: ${input.mainCharacter || 'A curious child'}
            - Setting: ${input.setting || 'A magical forest'}
            - Educational Elements: ${input.educationalElements || 'Problem-solving and friendship'}
            
            Please format the story with a title, followed by the story content.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const story = response.choices[0]?.message?.content;
    if (!story) {
      throw new Error('No story generated');
    }

    // Split the story into title and content
    const [title, ...contentParts] = story.split('\n\n');
    const content = contentParts.join('\n\n');

    logger.info('Story generated successfully', { userId });

    return {
      title: title.replace(/^Title: /, '').trim(),
      content: content.trim(),
      metadata: {
        model: 'gpt-4-turbo-preview',
        theme: input.theme,
        ageRange: input.ageRange,
        length: input.length,
        mainCharacter: input.mainCharacter,
        setting: input.setting,
        educationalElements: input.educationalElements,
      },
    };
  } catch (error) {
    logger.error('Error generating story with OpenAI:', { error, userId });
    throw error;
  }
}
