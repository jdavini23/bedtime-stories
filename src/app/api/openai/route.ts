import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { logger } from '@/utils/logger';

// Initialize OpenAI client on the server side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // No need for dangerouslyAllowBrowser flag on server side
});

export async function POST(request: NextRequest) {
  try {
    // Get user ID from Clerk authentication
    const auth = getAuth();
    const { userId } = auth;

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { operation, params } = await request.json();

    // Validate the request
    if (!operation) {
      return NextResponse.json({ error: 'Missing required parameter: operation' }, { status: 400 });
    }

    // Handle different OpenAI operations
    switch (operation) {
      case 'generateStory':
        return await handleGenerateStory(params, userId);
      case 'chatCompletion':
        return await handleChatCompletion(params, userId);
      default:
        return NextResponse.json({ error: `Unsupported operation: ${operation}` }, { status: 400 });
    }
  } catch (error) {
    logger.error('Error in OpenAI API route:', { error });
    return NextResponse.json(
      { error: 'Internal server error processing OpenAI request' },
      { status: 500 }
    );
  }
}

async function handleGenerateStory(params: any, userId: string) {
  try {
    const {
      childName,
      interests,
      theme,
      mood,
      gender,
      favoriteCharacters,
      mainCharacter,
      supportingCharacters,
      readingLevel,
      ageGroup,
    } = params;

    // Validate required parameters
    if (!childName || !theme) {
      return NextResponse.json(
        { error: 'Missing required parameters for story generation' },
        { status: 400 }
      );
    }

    const pronouns = gender === 'boy' ? 'he' : gender === 'girl' ? 'she' : 'they';
    const possessivePronouns = gender === 'boy' ? 'his' : gender === 'girl' ? 'her' : 'their';

    // Build character descriptions
    const mainCharacterDescription = mainCharacter?.traits
      ? `${childName}, who is ${mainCharacter.traits.join(', ')}`
      : childName;

    const supportingCharacterDescription = supportingCharacters?.[0]
      ? `${supportingCharacters[0].name || ''}, a ${(supportingCharacters[0].traits || []).join(', ')} ${supportingCharacters[0].type} who is ${supportingCharacters[0].role}`
      : 'a friendly companion';

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a creative storyteller specializing in personalized children's stories. Create an engaging, age-appropriate story that:
          1. Features ${favoriteCharacters ? favoriteCharacters.join(', ') + ' and' : supportingCharacterDescription} alongside ${mainCharacterDescription}
          2. Incorporates ${childName}'s interests: ${interests?.join(', ') || 'adventure and learning'}
          3. Is themed around ${theme}
          4. Matches the desired mood: ${mood || 'cheerful and uplifting'}
          5. Teaches a valuable life lesson while maintaining a sense of wonder
          6. Uses ${pronouns} and ${possessivePronouns} pronouns for ${childName}
          7. Includes magical elements and vivid descriptions
          8. Is structured with a clear beginning, middle, and end
          9. Is approximately 500-800 words long
          10. Uses child-friendly language and short paragraphs
          11. Ends with a positive, uplifting message that resonates with the chosen mood
          12. Is written at a ${readingLevel || 'intermediate'} reading level appropriate for children aged ${ageGroup || '6-8'}`,
        },
        {
          role: 'user',
          content: `Create a bedtime story for ${childName} about a magical adventure with ${supportingCharacterDescription} that teaches a valuable lesson about ${theme}.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    // Log the request with user ID
    logger.info('Story generation request', { userId, childName, theme });

    return NextResponse.json({
      content: response.choices[0]?.message?.content || 'Once upon a time...',
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    logger.error('Error generating story with OpenAI:', { error });
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}

async function handleChatCompletion(params: any, userId: string) {
  try {
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 500 } = params;

    // Validate required parameters
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid messages parameter' }, { status: 400 });
    }

    // Log the request with user ID
    logger.info('Chat completion request', { userId, model });

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    });

    return NextResponse.json({
      content: response.choices[0]?.message?.content,
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    logger.error('Error in chat completion with OpenAI:', { error });
    return NextResponse.json({ error: 'Failed to complete chat request' }, { status: 500 });
  }
}
