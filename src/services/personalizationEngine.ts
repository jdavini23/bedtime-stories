import { Story, StoryInput, StoryTheme } from '@/types/story';
import { logger } from '@/utils/logger';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Define interface for user preferences
export interface UserPreferences {
  id?: string;
  userId: string | null;
  preferredThemes: string[];
  generatedStoryCount: number;
  lastStoryGeneratedAt?: Date;
  learningInterests: string[];
  ageGroup: '3-5' | '6-8' | '9-12';
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  userId: null,
  preferredThemes: ['adventure', 'educational'],
  generatedStoryCount: 0,
  learningInterests: [],
  ageGroup: '6-8',
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: false,
    frequency: 'weekly',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export class UserPersonalizationEngine {
  private openai: OpenAI | undefined;
  protected userId: string | undefined = undefined;

  private isValidPreferences(preferences: unknown): preferences is UserPreferences {
    if (!preferences || typeof preferences !== 'object') return false;
    const p = preferences as UserPreferences;
    return (
      Array.isArray(p.preferredThemes) &&
      typeof p.generatedStoryCount === 'number' &&
      Array.isArray(p.learningInterests) &&
      typeof p.theme === 'string' &&
      typeof p.language === 'string'
    );
  }

  constructor(userId: string | undefined) {
    this.userId = userId;

    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      logger.error(
        'CRITICAL: OpenAI API key is missing. Set OPENAI_API_KEY in .env.local',
        { userId }
      );
      // Ensure openai is set to prevent null checks from failing
      this.openai = undefined;
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: false, // Disable client-side usage for security
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

  protected setUserId(userId: string | undefined) {
    this.userId = userId;
  }

  protected getUserId(): string | undefined {
    return this.userId;
  }

  async getUserPreferences(): Promise<UserPreferences> {
    if (!this.userId) return DEFAULT_PREFERENCES;

    try {
      const storedPreferences = localStorage.getItem('preferences');
      if (!storedPreferences) {
        return DEFAULT_PREFERENCES;
      }

      const parsed = JSON.parse(storedPreferences);
      if (!this.isValidPreferences(parsed)) {
        logger.error('Invalid preferences format in localStorage');
        return DEFAULT_PREFERENCES;
      }

      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
      };
    } catch (error) {
      logger.error('Error fetching user preferences:', { error });
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
      logger.error('Error updating user preferences:', { error });
      return false;
    }
  }

  async incrementGeneratedStories() {
    const currentPreferences = await this.getUserPreferences();
    if (currentPreferences) {
      const updatedPreferences = {
        ...currentPreferences,
        generatedStoryCount: currentPreferences.generatedStoryCount + 1,
      };
      await this.updateUserPreferences(updatedPreferences);
    }
  }

  // Generate personalized story using OpenAI
  async generatePersonalizedStory(input: StoryInput, userPrefs?: UserPreferences): Promise<Story> {
    logger.info('Starting personalized story generation', {
      input,
      hasPreferences: !!userPrefs,
      hasOpenAIKey: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const pronouns = input.gender === 'boy' ? 'he' : input.gender === 'girl' ? 'she' : 'they';
    const possessivePronouns =
      input.gender === 'boy' ? 'his' : input.gender === 'girl' ? 'her' : 'their';

    try {
      let storyContent = '';

      try {
        if (this.openai) {
          storyContent = await this.generateOpenAIStory(input, pronouns, possessivePronouns);
          logger.info('OpenAI story generation completed', {
            storyContentLength: storyContent.length,
          });
        } else {
          logger.error('OpenAI client not initialized');
          storyContent = this.generateFallbackStory(input, pronouns, possessivePronouns);
        }
      } catch (openaiError) {
        logger.warn('OpenAI story generation failed, using fallback', {
          error: openaiError,
          input,
        });
        storyContent = this.generateFallbackStory(input, pronouns, possessivePronouns);
      }

      const story: Story = {
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
        userId: this.userId,
        pronouns,
        possessivePronouns,
        generatedAt: new Date().toISOString(),
      };

      await this.incrementGeneratedStories();

      logger.info('Personalized story generation successful', {
        storyId: story.id,
        childName: input.childName,
      });

      return story;
    } catch (error) {
      logger.error('Comprehensive error in story generation', { error });
      const fallbackStory = this.generateFallbackStory(input, pronouns, possessivePronouns);

      return {
        id: this.generateUniqueId(),
        title: `A Story for ${input.childName}`,
        content: fallbackStory,
        theme: input.theme,
        createdAt: new Date().toISOString(),
        input,
        metadata: {
          pronouns,
          possessivePronouns,
          generatedAt: new Date().toISOString(),
        },
        userId: this.userId,
        pronouns,
        possessivePronouns,
        generatedAt: new Date().toISOString(),
      };
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
      logger.error('OpenAI story generation failed', { error });
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
export { DEFAULT_PREFERENCES };
