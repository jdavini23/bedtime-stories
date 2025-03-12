import { Story, StoryInput, StoryTheme } from '@/types/story';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { kv } from '@vercel/kv';
import { serializeError, openAICircuitBreaker } from '@/utils/error-handlers';
import { generateFallbackStory } from '@/utils/fallback-stories';

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

// Define theme descriptions for more detailed story generation
export const THEME_DESCRIPTIONS: Record<StoryTheme, string> = {
  adventure: 'exciting journeys, exploration, and discovering new places',
  fantasy: 'magical worlds, enchanted creatures, and extraordinary powers',
  science: 'scientific discoveries, experiments, and understanding how things work',
  nature: 'the natural world, animals, plants, and environmental awareness',
  friendship: 'building relationships, working together, and supporting others',
  educational: 'learning new facts, developing skills, and gaining knowledge',
  courage: 'bravery in the face of challenges, overcoming fears, and standing up for what is right',
  kindness: 'compassion, helping others, and making a positive difference',
  curiosity: 'asking questions, seeking answers, and exploring the unknown',
  creativity: 'imagination, artistic expression, and innovative thinking',
};

// Define theme-specific story elements
export const THEME_ELEMENTS: Record<
  StoryTheme,
  { settings: string[]; characters: string[]; challenges: string[] }
> = {
  adventure: {
    settings: ['mysterious island', 'ancient ruins', 'dense jungle', 'mountain peak'],
    characters: ['brave explorer', 'treasure hunter', 'wilderness guide', 'ship captain'],
    challenges: ['crossing a dangerous river', 'finding a hidden map', 'escaping a storm'],
  },
  fantasy: {
    settings: ['enchanted forest', 'magical kingdom', 'cloud castle', 'underwater city'],
    characters: ['wizard', 'fairy', 'dragon', 'talking animal', 'magical creature'],
    challenges: ['breaking a spell', 'finding a magical artifact', 'solving a magical riddle'],
  },
  science: {
    settings: [
      'laboratory',
      'space station',
      'underwater research facility',
      "inventor's workshop",
    ],
    characters: ['scientist', 'robot', 'astronaut', 'inventor', 'time traveler'],
    challenges: ['completing an experiment', 'making a discovery', 'building a machine'],
  },
  nature: {
    settings: ['forest', 'ocean', 'mountain', 'desert', 'rainforest'],
    characters: ['wildlife ranger', 'talking animal', 'tree spirit', 'nature guardian'],
    challenges: ['protecting endangered animals', 'planting trees', 'cleaning up pollution'],
  },
  friendship: {
    settings: ['school', 'neighborhood', 'treehouse', 'playground', 'summer camp'],
    characters: ['new friend', 'best friend', 'neighbor', 'classmate', 'teammate'],
    challenges: ['making a new friend', 'resolving a misunderstanding', 'working together'],
  },
  educational: {
    settings: ['museum', 'library', 'historical site', 'classroom', 'learning center'],
    characters: ['teacher', 'librarian', 'historical figure', 'talking book', 'wise elder'],
    challenges: ['solving a puzzle', 'finding information', 'learning a new skill'],
  },
  courage: {
    settings: ['dark cave', 'stormy sea', 'tall mountain', 'unfamiliar city'],
    characters: ['hero', 'brave animal', 'guardian', 'mentor', 'someone in need'],
    challenges: ['facing a fear', 'standing up to a bully', 'trying something new'],
  },
  kindness: {
    settings: ['community center', 'animal shelter', 'hospital', 'elderly home', 'neighborhood'],
    characters: ['someone in need', 'grateful recipient', 'community helper', 'kind stranger'],
    challenges: ['helping someone in need', 'sharing limited resources', 'showing compassion'],
  },
  curiosity: {
    settings: ['mysterious door', 'strange garden', 'abandoned house', 'hidden passage'],
    characters: ['detective', 'explorer', 'scientist', 'archaeologist', 'curious animal'],
    challenges: ['solving a mystery', 'discovering a secret', 'finding answers to questions'],
  },
  creativity: {
    settings: ['art studio', 'music room', 'theater stage', 'imagination land', 'blank canvas'],
    characters: ['artist', 'musician', 'storyteller', 'inventor', 'dreamer'],
    challenges: [
      'creating something new',
      'expressing feelings through art',
      'imagining solutions',
    ],
  },
};

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

export interface StoryCharacter {
  name: string;
  type: 'human' | 'animal' | 'magical' | 'robot' | 'other';
  traits: string[];
  role: string;
  description?: string;
}

// Extend StoryInput to include more character customization
export interface EnhancedStoryInput extends StoryInput {
  mainCharacter?: {
    traits: string[];
    appearance?: string[];
    skills?: string[];
  };
  supportingCharacters?: StoryCharacter[];
}

export class UserPersonalizationEngine {
  protected userId: string | undefined = undefined;
  private isServerSide: boolean = typeof window === 'undefined';

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
    logger.info('UserPersonalizationEngine initialized', { userId });
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
      // Try to get preferences from server-side KV store if available
      if (this.isServerSide && this.userId !== 'default-user') {
        try {
          const kvKey = `user:preferences:${this.userId}`;
          const storedPreferences = await kv.get(kvKey);

          if (storedPreferences) {
            logger.info('Retrieved user preferences from KV store', { userId: this.userId });
            return {
              ...DEFAULT_PREFERENCES,
              ...storedPreferences,
            };
          }
        } catch (kvError) {
          logger.error('Error fetching user preferences from KV:', { error: kvError });
          // Fall back to localStorage if KV fails
        }
      }

      // Client-side storage fallback
      if (typeof window !== 'undefined') {
        const storedPreferences = localStorage.getItem(`preferences:${this.userId}`);
        if (storedPreferences) {
          const parsed = JSON.parse(storedPreferences);
          if (!this.isValidPreferences(parsed)) {
            logger.error('Invalid preferences format in localStorage');
            return DEFAULT_PREFERENCES;
          }

          return {
            ...DEFAULT_PREFERENCES,
            ...parsed,
          };
        }
      }

      return DEFAULT_PREFERENCES;
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
        updatedAt: new Date(),
      };

      // Store in KV if server-side and user is authenticated
      if (this.isServerSide && this.userId !== 'default-user') {
        try {
          const kvKey = `user:preferences:${this.userId}`;
          await kv.set(kvKey, updatedPreferences);
          logger.info('Updated user preferences in KV store', { userId: this.userId });
          return true;
        } catch (kvError) {
          logger.error('Error updating user preferences in KV:', { error: kvError });
          // Fall back to localStorage if KV fails
        }
      }

      // Client-side storage fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(`preferences:${this.userId}`, JSON.stringify(updatedPreferences));
        return true;
      }

      return false;
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

  // Generate personalized story using OpenAI API endpoint
  async generatePersonalizedStory(input: StoryInput, userPrefs?: UserPreferences): Promise<Story> {
    logger.info('Starting personalized story generation', {
      input,
      hasPreferences: !!userPrefs,
    });
    logger.debug('generatePersonalizedStory: after logger.info - input and prefs');

    const pronouns = input.gender === 'boy' ? 'he' : input.gender === 'girl' ? 'she' : 'they';
    logger.debug('generatePersonalizedStory: after pronoun definition');
    const possessivePronouns =
      input.gender === 'boy' ? 'his' : input.gender === 'girl' ? 'her' : 'their';
    logger.debug('generatePersonalizedStory: after possessivePronoun definition');

    try {
      let storyContent = '';
      logger.debug('generatePersonalizedStory: before inner try block');

      try {
        logger.debug('generatePersonalizedStory: calling callOpenAIEndpoint');
        // Call the server-side API endpoint instead of using OpenAI directly
        storyContent = await this.callOpenAIEndpoint(input, userPrefs || null);
        logger.info('OpenAI story generation completed', {
          storyContentLength: storyContent.length,
        });
      } catch (openaiError) {
        logger.warn('OpenAI story generation failed, using fallback', {
          error: openaiError,
          input,
        });
        storyContent = this.createFallbackStory(input);
      }
      logger.debug('generatePersonalizedStory: after inner try block');

      const story: Story = {
        id: this.generateUniqueId(),
        title: `A Special Story for ${input.childName}`,
        content: storyContent,
        theme: input.theme,
        createdAt: new Date().toISOString(),
        input,
        fallback: false,
        timestamp: Date.now(),
        userId: this.userId,
        pronouns,
        possessivePronouns,
        generatedAt: new Date().toISOString(),
      };
      logger.debug('generatePersonalizedStory: before incrementGeneratedStories');

      await this.incrementGeneratedStories();
      logger.debug('generatePersonalizedStory: after incrementGeneratedStories');

      // Save the story to user history
      logger.debug('generatePersonalizedStory: before saveStoryToHistory');
      await this.saveStoryToHistory(story);
      logger.debug('generatePersonalizedStory: after saveStoryToHistory');

      logger.info('Personalized story generation successful', {
        storyId: story.id,
        childName: input.childName,
      });
      logger.debug('generatePersonalizedStory: before return story');

      return story;
    } catch (error) {
      // Improve error logging with more details
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        input: {
          childName: input.childName,
          theme: input.theme,
          // Include only non-sensitive data
          gender: input.gender,
          readingLevel: input.readingLevel,
        },
      };

      logger.error('Comprehensive error in story generation', errorDetails);
      const fallbackStory = this.createFallbackStory(input);
      logger.debug('generatePersonalizedStory: after generateFallbackStory');

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

  /**
   * Call the OpenAI API endpoint with error handling and fallback
   */
  private async callOpenAIEndpoint(
    input: StoryInput,
    userPrefs: UserPreferences | null
  ): Promise<string> {
    try {
      // Log the API request attempt
      logger.debug('callOpenAIEndpoint: start', {
        childName: input.childName,
        theme: input.theme,
        hasUserPrefs: !!userPrefs,
      });

      // Prepare the request body
      const requestBody = {
        operation: 'generateStory',
        params: {
          ...input,
          interests: userPrefs?.learningInterests || [],
          ageGroup: userPrefs?.ageGroup || '6-8',
        },
      };
      // Use circuit breaker pattern for the API call
      return await openAICircuitBreaker.fire(
        async () => {
          // Set timeout for the fetch request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout (increased from 15s)

          try {
            // Make the API request with timeout, including credentials for auth cookies
            const response = await fetch('/api/story/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
              credentials: 'include', // Important for Supabase authentication cookies
            });

            // Clear the timeout
            clearTimeout(timeoutId);

            // Check for HTTP errors
            if (!response.ok) {
              let errorData;
              try {
                errorData = await response.json();
              } catch (e) {
                errorData = { message: 'Failed to parse error response' };
              }

              logger.error('OpenAI API HTTP error', {
                status: response.status,
                statusText: response.statusText,
                errorData,
              });

              // If we got a fallback story from the API despite the error, use it
              if (errorData && errorData.content) {
                logger.info('Using fallback story from API despite error');
                return errorData.content;
              }

              if (response.status === 401) {
                logger.error('Authentication failed when calling OpenAI API endpoint');
                throw new Error('Authentication failed: You may need to sign in again');
              }

              // Throw an error with details
              throw new Error(
                `OpenAI API error: ${response.status} ${response.statusText}. ${
                  errorData?.message || 'An unexpected error occurred'
                }`
              );
            }

            // Parse the response
            const data = await response.json();

            // Check if we got a fallback response
            if (data.fallback) {
              logger.warn('Received fallback story from API', {
                error: data.error,
                message: data.message,
              });
            }

            // Return the content (even if it's a fallback)
            return data.content || this.createFallbackStory(input);
          } catch (fetchError) {
            // Clear the timeout if it's an error
            clearTimeout(timeoutId);

            // Handle fetch-specific errors
            if ((fetchError as Error).name === 'AbortError') {
              logger.error('OpenAI API request timeout', {
                timeout: '30s',
                input: { childName: input.childName, theme: input.theme },
              });
              throw new Error('OpenAI API request timed out after 30 seconds');
            }

            // Re-throw other fetch errors
            logger.error('Fetch error in OpenAI API call', serializeError(fetchError));
            throw fetchError;
          }
        },
        // Fallback function that generates a story when the API call fails
        (error) => {
          logger.info('Using circuit breaker fallback for story generation');
          return this.createFallbackStory(input);
        }
      );
    } catch (error) {
      // Comprehensive error logging
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        input: {
          childName: input.childName,
          theme: input.theme,
        },
      };
      logger.error('Error calling OpenAI API', errorDetails);

      // Return a fallback story
      return this.createFallbackStory(input);
    }
  }

  /**
   * Generate a fallback story when the OpenAI API call fails
   */
  private createFallbackStory(input: StoryInput): string {
    // Use the dedicated fallback story generator instead of the circular dependency
    const mainCharacterTraits = (input as any).mainCharacter?.traits?.join(', ');
    const supportingCharacterName = (input as EnhancedStoryInput).supportingCharacters?.[0]?.name;
    const supportingCharacterType = (input as EnhancedStoryInput).supportingCharacters?.[0]?.type;

    // Create an enhanced input with character information
    const enhancedInput = {
      ...input,
      mainCharacterTraits,
      supportingCharacterName,
      supportingCharacterType,
    };

    // Generate a more personalized fallback story using the imported function
    return generateFallbackStory(enhancedInput);
  }

  private generateStoryMiddle(
    input: StoryInput,
    pronouns: string,
    possessivePronouns: string,
    character: string = 'friend',
    challenge: string = 'challenge'
  ): string {
    const { childName, theme } = input;
    const interests = (input as any).interests || ['learning'];

    return `As ${pronouns} explored with excitement, ${childName} met a ${character} who needed help with ${challenge}. 
    Together, they used ${childName}'s knowledge of ${interests.join(' and ')} to solve the problem. 
    It wasn't easy, but ${childName} was determined to help. ${pronouns === 'they' ? 'They' : pronouns === 'he' ? 'He' : 'She'} 
    discovered that ${possessivePronouns} love for ${interests[0] || 'learning'} was exactly what was needed in this situation.`;
  }

  private generateStoryEnding(input: StoryInput, pronouns: string): string {
    const { childName } = input;
    return `At the end of this wonderful adventure, ${childName} realized that the greatest magic of all was believing in ${
      pronouns === 'they' ? 'themselves' : pronouns === 'he' ? 'himself' : 'herself'
    }. The end.`;
  }

  // Helper method to determine reading level based on age group
  private getReadingLevelForAgeGroup(ageGroup: '3-5' | '6-8' | '9-12'): string {
    switch (ageGroup) {
      case '3-5':
        return 'simple, with very basic vocabulary and short sentences';
      case '6-8':
        return 'intermediate, with age-appropriate vocabulary and a mix of simple and compound sentences';
      case '9-12':
        return 'advanced, with richer vocabulary and more complex sentence structures';
      default:
        return 'intermediate';
    }
  }

  // Generate a unique story ID
  private generateUniqueId(): string {
    return uuidv4();
  }

  // Store generated story in user history
  async saveStoryToHistory(story: Story): Promise<boolean> {
    if (!this.userId || this.userId === 'default-user') return false;

    try {
      // Store in KV if server-side
      if (this.isServerSide) {
        try {
          const kvKey = `user:stories:${this.userId}`;

          // Get existing stories
          const existingStories = (await kv.get<Story[]>(kvKey)) || [];

          // Add new story to the beginning of the array (most recent first)
          const updatedStories = [story, ...existingStories].slice(0, 50); // Keep only the 50 most recent stories

          await kv.set(kvKey, updatedStories);
          logger.info('Saved story to user history in KV store', {
            userId: this.userId,
            storyId: story.id,
          });
          return true;
        } catch (kvError) {
          logger.error('Error saving story to history in KV:', { error: kvError });
          // Fall back to localStorage if KV fails
        }
      }

      // Client-side storage fallback
      if (typeof window !== 'undefined') {
        const storageKey = `stories:${this.userId}`;
        const existingStoriesJson = localStorage.getItem(storageKey);
        const existingStories = existingStoriesJson ? JSON.parse(existingStoriesJson) : [];

        // Add new story to the beginning of the array (most recent first)
        const updatedStories = [story, ...existingStories].slice(0, 50); // Keep only the 50 most recent stories

        localStorage.setItem(storageKey, JSON.stringify(updatedStories));
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error saving story to history:', { error });
      return false;
    }
  }

  // Get user's story history
  async getStoryHistory(): Promise<Story[]> {
    if (!this.userId || this.userId === 'default-user') return [];

    try {
      // Try to get from KV if server-side
      if (this.isServerSide) {
        try {
          const kvKey = `user:stories:${this.userId}`;
          const stories = await kv.get<Story[]>(kvKey);
          return stories || [];
        } catch (kvError) {
          logger.error('Error fetching story history from KV:', { error: kvError });
          // Fall back to localStorage if KV fails
        }
      }

      // Client-side storage fallback
      if (typeof window !== 'undefined') {
        const storageKey = `stories:${this.userId}`;
        const storiesJson = localStorage.getItem(storageKey);
        return storiesJson ? JSON.parse(storiesJson) : [];
      }

      return [];
    } catch (error) {
      logger.error('Error fetching story history:', { error });
      return [];
    }
  }

  // Helper method to generate a random character
  public generateRandomCharacter(
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

  // Helper method to suggest character traits based on theme
  public suggestCharacterTraits(theme: StoryTheme): string[] {
    const themeBasedTraits: Record<StoryTheme, string[]> = {
      adventure: ['brave', 'curious', 'adventurous', 'determined'],
      fantasy: ['imaginative', 'curious', 'creative', 'brave'],
      science: ['curious', 'clever', 'analytical', 'inventive'],
      nature: ['gentle', 'observant', 'caring', 'patient'],
      friendship: ['kind', 'loyal', 'helpful', 'understanding'],
      educational: ['curious', 'attentive', 'thoughtful', 'clever'],
      courage: ['brave', 'determined', 'resilient', 'confident'],
      kindness: ['kind', 'generous', 'empathetic', 'thoughtful'],
      curiosity: ['curious', 'inquisitive', 'observant', 'thoughtful'],
      creativity: ['creative', 'imaginative', 'artistic', 'innovative'],
    };

    // Return 2 random traits from the theme-based list
    const traits = themeBasedTraits[theme] || themeBasedTraits.adventure;
    const selectedTraits = [];

    // Select 2 unique traits
    while (selectedTraits.length < 2 && traits.length > 0) {
      const randomIndex = Math.floor(Math.random() * traits.length);
      selectedTraits.push(traits[randomIndex]);
      traits.splice(randomIndex, 1); // Remove the selected trait to avoid duplicates
    }

    return selectedTraits;
  }
}

// Singleton instance of the personalization engine
export const userPersonalizationEngine = new UserPersonalizationEngine('default-user');
export { DEFAULT_PREFERENCES };
