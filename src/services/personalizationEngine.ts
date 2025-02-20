import { Story, StoryInput, StoryTheme } from '@/types/story';
import { logger } from '@/utils/logger';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Define interface for user preferences
export interface UserPreferences {
  preferredThemes: string[];
  mostLikedCharacterTypes: string[];
  learningInterests: string[];
  ageGroups: string[];
  educationalGoals: string[];
  generatedStories?: number;
}

// Comprehensive default user preferences
export const DEFAULT_PREFERENCES: UserPreferences | null = {
  preferredThemes: ['adventure', 'friendship', 'curiosity', 'creativity'],
  mostLikedCharacterTypes: ['brave', 'curious', 'kind', 'imaginative'],
  learningInterests: [
    'nature',
    'science',
    'friendship',
    'imagination',
    'problem-solving',
    'empathy',
  ],
  ageGroups: ['4-6', '7-9'],
  educationalGoals: ['emotional intelligence', 'creativity', 'curiosity'],
  generatedStories: 0,
};

export class UserPersonalizationEngine {
  private openai: OpenAI | undefined;
  protected userId: string | null | null | null | null | null | null = null;

  constructor(userId: string | null | null | null | null | null | null) {
    this.userId = userId;

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      logger.error(
        'CRITICAL: OpenAI API key is missing. Set NEXT_PUBLIC_OPENAI_API_KEY in .env.local',
        { userId }
      );
      // Ensure openai is set to prevent null checks from failing
      this.openai = undefined;
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Only for client-side usage
      });

      logger.info('OpenAI client initialized successfully', {
        userId,
        apiKeyPresent: !!apiKey,
      });
    } catch (error) {
      logger.error('Failed to initialize OpenAI client', {
        error,
        userId,
      });
      // Ensure openai is set to prevent null checks from failing
      this.openai = undefined;
    }
  }

  protected setUserId(userId: string | null | null | null | null | null | null) {
    this.userId = userId;
  }

  protected getUserId(): string | null {
    return this.userId;
  }

  async getUserPreferences(): Promise<UserPreferences> {
    if (!this.userId) return DEFAULT_PREFERENCES;

    try {
      // Get preferences from localStorage, fall back to default if not found
      const storedPreferences = localStorage.getItem('preferences');
      if (!storedPreferences) {
        return DEFAULT_PREFERENCES;
      }

      // Parse and validate preferences
      const parsed = JSON.parse(storedPreferences);

      // Type guard to validate preferences object
      const isValidPreferences = (obj: unknown): obj is Partial<UserPreferences> => {
        if (typeof obj !== 'object' || obj  == null) return false;

        const pref = obj as Record<string, unknown>;

        // Check if properties are arrays of strings when present
        const isStringArray = (arr: unknown): arr is string[] =>
          Array.isArray(arr) && arr.every((item) => typeof item === 'string');

        return (
          (!pref.preferredThemes || isStringArray(pref.preferredThemes)) &&
          (!pref.mostLikedCharacterTypes || isStringArray(pref.mostLikedCharacterTypes)) &&
          (!pref.learningInterests || isStringArray(pref.learningInterests)) &&
          (!pref.ageGroups || isStringArray(pref.ageGroups)) &&
          (!pref.educationalGoals || isStringArray(pref.educationalGoals)) &&
          (!pref.generatedStories || typeof pref.generatedStories === 'number')
        );
      };

      if (!isValidPreferences(parsed)) {
        logger.error('Invalid preferences format in localStorage');
        return DEFAULT_PREFERENCES;
      }

      // Now TypeScript knows parsed is a valid Partial<UserPreferences>
      return {
        preferredThemes: parsed.preferredThemes || DEFAULT_PREFERENCES.preferredThemes,
        mostLikedCharacterTypes:
          parsed.mostLikedCharacterTypes || DEFAULT_PREFERENCES.mostLikedCharacterTypes,
        learningInterests: parsed.learningInterests || DEFAULT_PREFERENCES.learningInterests,
        ageGroups: parsed.ageGroups || DEFAULT_PREFERENCES.ageGroups,
        educationalGoals: parsed.educationalGoals || DEFAULT_PREFERENCES.educationalGoals,
        generatedStories: parsed.generatedStories || 0,
      };
    } catch (error) {
      logger.error('Error fetching user preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  async updateUserPreferences(newPreferences: Partial<UserPreferences>): Promise<boolean> {
    if (!this.userId) return false;

    try {
      const currentPreferences = await this.getUserPreferences();
      const updatedPreferences = {
        ...currentPreferences,
        ...newPreferences,
      };

      localStorage.setItem('preferences', JSON.stringify(updatedPreferences));
      return true;
    } catch (error) {
      logger.error('Error updating user preferences:', error);
      return false;
    }
  }

  async incrementGeneratedStories() {
    const currentPreferences = await this.getUserPreferences();
    if (currentPreferences) {
      const updatedPreferences = {
        ...currentPreferences,
        generatedStories: (currentPreferences.generatedStories || 0) + 1,
      };
      await this.updateUserPreferences(updatedPreferences);
    }
  }

  // Generate personalized story using OpenAI
  async generatePersonalizedStory(
    input: StoryInput,
    preferences?: UserPreferences
  ): Promise<Story> {
    // Enhanced logging for debugging
    logger.info('Starting personalized story generation', {
      input,
      hasPreferences: !!preferences,
      hasOpenAIKey: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    // If preferences not provided, fetch them
    const userPreferences: UserPreferences | null = preferences || (await this.getUserPreferences());

    // Determine pronouns based on gender
    const pronouns: string | null =
      input.gender === 'boy' ? 'he' : input.gender === 'girl' ? 'she' : 'they';
    const possessivePronouns: string | null =
      input.gender === 'boy' ? 'his' : input.gender === 'girl' ? 'her' : 'their';

    try {
      let storyContent: string;

      // Always attempt to use OpenAI, fallback if it fails
      try {
        if (this.openai) {
          storyContent = await this.generateOpenAIStory(input, pronouns, possessivePronouns);
          logger.info('OpenAI story generation completed', {
            storyContentLength: storyContent.length,
          });
        } else {
          logger.error('OpenAI client not initialized');
        }
      } catch (openaiError) {
        logger.warn('OpenAI story generation failed, using fallback', {
          error: openaiError,
          input,
        });
        storyContent = this.generateFallbackStory(input, pronouns, possessivePronouns);
      }

      // Create story object
      const story: Story | null = {
        id: this.generateUniqueId(),
        title: `A Special Story for ${input.childName}`,
        content: storyContent,
        theme: input.theme,
        createdAt: new Date().toISOString(),
        input,
        metadata: {
          pronouns,
          possessivePronouns,
          generatedAt: new Date().toISOString(),
        },
        userId: this.userId || undefined,
        pronouns,
        possessivePronouns,
        generatedAt: new Date().toISOString(),
      };

      // Increment generated stories count
      await this.incrementGeneratedStories();

      logger.info('Personalized story generation successful', {
        storyId: story.id,
        childName: input.childName,
      });

      return story;
    } catch (error) {
      logger.error('Comprehensive error in story generation', {
        error,
        input,
        userId: this.userId,
        apiKeyPresent: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });

      // Final fallback story generation
      const fallbackStory: Story | null = {
        id: this.generateUniqueId(),
        title: `A Story for ${input.childName}`,
        content: this.generateFallbackStory(input, pronouns, possessivePronouns),
        theme: input.theme,
        createdAt: new Date().toISOString(),
        input,
        metadata: {
          pronouns,
          possessivePronouns,
          generatedAt: new Date().toISOString(),
        },
        userId: this.userId || undefined,
        pronouns,
        possessivePronouns,
        generatedAt: new Date().toISOString(),
      };

      return fallbackStory;
    }
  }

  private generateFallbackStory(
    input: StoryInput,
    pronouns: string,
    possessivePronouns: string
  ): string {
    const { childName, interests, theme } = input;

    // Enhanced fallback story generation based on theme
    const themeBasedIntros: Record<StoryTheme, string> = {
      adventure: `In a world full of endless possibilities, ${childName} embarked on an incredible journey.`,
      fantasy: `In a magical realm where dreams come true, ${childName} discovered something extraordinary.`,
      science: `Curious about the wonders of science, ${childName} began an amazing experiment.`,
      nature: `On a beautiful day surrounded by nature, ${childName} made an incredible discovery.`,
      friendship: `${childName} learned the true meaning of friendship on a special day.`,
      educational: `${childName} discovered something fascinating to learn about today.`,
      courage: `${childName} faced a challenge with bravery and determination.`,
      kindness: `${childName} learned how a small act of kindness can make a big difference.`,
      curiosity: `${childName}'s curiosity led to an amazing discovery.`,
      creativity: `${childName} let imagination soar and created something wonderful.`,
    };

    const intro =
      themeBasedIntros[theme] ||
      `Once upon a time, there was a wonderful child named ${childName} who loved ${interests.join(' and ')}.`;

    return `${intro}\n\n${this.generateStoryMiddle(
      input,
      pronouns,
      possessivePronouns
    )}\n\n${this.generateStoryEnding(input, pronouns)}`;
  }

  private generateStoryMiddle(
    input: StoryInput,
    pronouns: string,
    possessivePronouns: string
  ): string {
    const { childName, interests } = input;
    return `As ${pronouns} explored with excitement, ${childName} discovered that ${possessivePronouns} love for ${interests.join(
      ' and '
    )} opened up amazing possibilities. Each step of the journey brought new wonders and learning experiences.`;
  }

  private generateStoryEnding(input: StoryInput, pronouns: string): string {
    const { childName } = input;
    return `At the end of this wonderful adventure, ${childName} realized that the greatest magic of all was believing in ${
      pronouns === 'they' ? 'themselves' : pronouns === 'he' ? 'himself' : 'herself'
    }. The end.`;
  }

  private async generateOpenAIStory(
    input: StoryInput,
    pronouns: string,
    possessivePronouns: string
  ): Promise<string> {
    try {
      const response = await this.openai?.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a creative storyteller specializing in personalized children's stories. Create an engaging, age-appropriate story that:
            1. Features ${input.favoriteCharacters ? input.favoriteCharacters.join(', ') + ' and' : 'talking animals as main characters'} alongside ${input.childName}
            2. Incorporates ${input.childName}'s interests: ${input.interests.join(', ')}
            3. Is themed around ${input.theme}
            4. Matches the desired mood: ${input.mood || 'cheerful and uplifting'}
            5. Teaches a valuable life lesson while maintaining a sense of wonder
            6. Uses ${pronouns} and ${possessivePronouns} pronouns for ${input.childName}
            7. Includes magical elements and vivid descriptions
            8. Is structured with a clear beginning, middle, and end
            9. Is approximately 500-800 words long
            10. Uses child-friendly language and short paragraphs
            11. Ends with a positive, uplifting message that resonates with the chosen mood`,
          },
          {
            role: 'user',
            content: `Create a bedtime story for ${input.childName} about a magical adventure with talking animals that teaches a valuable lesson about ${input.theme}.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      });
      return (
        response?.choices[0]?.message?.content ||
        this.generateFallbackStory(input, pronouns, possessivePronouns)
      );
    } catch (error) {
      logger.error('OpenAI story generation failed', { error, input });
      return this.generateFallbackStory(input, pronouns, possessivePronouns);
    }
  }

  // Generate a unique story ID
  private generateUniqueId(): string {
    return uuidv4();
  }
}

// Singleton instance of the personalization engine
export const userPersonalizationEngine = new UserPersonalizationEngine('default-user');
