import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { kv } from '@vercel/kv';
import { StoryInput, UserPreferences, StoryTheme } from '../types/story';
import { generateFallbackStory } from '../utils/fallback-generator';
import { geminiCircuitBreaker, serializeError } from '../utils/error-handlers';
import CircuitBreaker = require('opossum'); // Updated import statement

// Define interface for user preferences
export interface UserPreferencesLocal {
  id?: string;
  userId: string | null;
  preferredThemes: string[];
  generatedStoryCount: number;
  generatedStories?: number;
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
  storyPreferences?: {
    maxLength: number;
    educationalFocus: boolean;
    moralEmphasis: boolean;
    readingLevel: string;
  };
  mostLikedCharacterTypes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_PREFERENCES: UserPreferencesLocal = {
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

export interface Story {
  id: string;
  title: string;
  content: string;
  theme: string;
  createdAt: string;
  input: StoryInput;
  metadata: {
    pronouns: string;
    possessivePronouns: string;
    generatedAt: string;
    wordCount?: number;
    readingTime?: number;
    fallback?: boolean;
    error?: string;
  };
  userId?: string;
  pronouns: string;
  possessivePronouns: string;
  generatedAt: string;
}

export class UserPersonalizationEngine {
  protected userId: string | undefined = undefined;
  private isServerSide: boolean = typeof window === 'undefined';

  private isValidPreferences(preferences: unknown): preferences is UserPreferencesLocal {
    if (!preferences || typeof preferences !== 'object') return false;
    const p = preferences as UserPreferencesLocal;
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

  async getUserPreferences(): Promise<UserPreferencesLocal> {
    if (!this.userId) return DEFAULT_PREFERENCES;

    try {
      // Try to get preferences from server-side KV store if available
      if (this.isServerSide && this.userId !== 'default-user') {
        try {
          const kvKey = `user:preferences:${this.userId}`;
          const storedPreferences = await kv.get(kvKey);

          if (storedPreferences && typeof storedPreferences === 'object') {
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

  async updateUserPreferences(newPreferences: Partial<UserPreferencesLocal>): Promise<boolean> {
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

  async incrementStoryCount(): Promise<boolean> {
    if (!this.userId || this.userId === 'default-user') return false;

    try {
      // Get current user data
      const userData = await kv.hgetall(`user:${this.userId}`);

      if (!userData) {
        logger.warn('No user data found when incrementing story count', {
          userId: this.userId,
        });
        return false;
      }

      // Calculate new story count
      const currentStoryCount = parseInt((userData.storiesGenerated as string) || '0', 10);
      const newStoryCount = currentStoryCount + 1;

      // Update story count in database
      await kv.hset(`user:${this.userId}`, {
        storiesGenerated: newStoryCount,
        lastStoryGeneratedAt: new Date().toISOString(),
      });

      logger.info('Successfully incremented story count', {
        userId: this.userId,
        previousCount: currentStoryCount,
        newCount: newStoryCount,
      });

      return true;
    } catch (error) {
      logger.error('Error incrementing story count', serializeError(error));
      return false;
    }
  }

  /**
   * Generate a unique ID for a story
   *
   * This method generates a unique identifier for each story using UUID v4.
   * It's marked as deprecated since uuidv4() should be used directly instead.
   *
   * @returns Unique ID string
   * @deprecated Use uuidv4() directly instead
   */
  private generateUniqueId(): string {
    return uuidv4();
  }

  /**
   * Generate a cache key for a story
   *
   * This method creates a deterministic cache key based on the story input parameters.
   * The key format is: story:{childName}:{sortedInterests}:{theme}:{gender}
   *
   * @param input Story generation input parameters
   * @returns Cache key string
   */
  private generateCacheKey(input: StoryInput): string {
    const { childName, interests = [], theme, gender } = input;

    // Sort interests for consistent cache keys regardless of order
    const sortedInterests = [...interests].sort().join(',');

    // Create a deterministic cache key
    return `story:${childName}:${sortedInterests}:${theme}:${gender}`;
  }

  /**
   * Generate a story using the Gemini API
   *
   * This method generates a story using the Gemini API, with caching and fallback mechanisms.
   * It includes comprehensive error handling, circuit breaking, and detailed logging.
   *
   * @param input Story generation input parameters
   * @returns Generated story content
   */
  async generateStory(input: StoryInput): Promise<string> {
    logger.info('Starting story generation', {
      childName: input.childName,
      theme: input.theme,
      gender: input.gender,
      interestsCount: input.interests?.length || 0,
    });

    // Create cache key
    const cacheKey = this.generateCacheKey(input);

    // Check cache
    try {
      const cachedStory = await kv.get<string>(cacheKey);

      if (cachedStory) {
        logger.info('Using cached story', {
          cacheKey,
          userId: this.userId,
          contentLength: cachedStory.length,
        });
        return cachedStory;
      }

      logger.info('No cached story found, generating new story', {
        cacheKey,
        userId: this.userId,
      });
    } catch (cacheError) {
      logger.warn('Error checking story cache', serializeError(cacheError));
      // Continue with story generation even if cache check fails
    }

    // Define the API call function to be passed to the circuit breaker
    const apiCallFunction = async () => {
      try {
        // Call the Gemini API endpoint
        const storyContent = await this.callGeminiEndpoint(input);

        // Cache the generated story
        try {
          const cacheTTL = 60 * 60 * 24; // 24 hours
          await kv.set(cacheKey, storyContent, { ex: cacheTTL });

          logger.info('Successfully cached story', {
            cacheKey,
            userId: this.userId,
            contentLength: storyContent.length,
            cacheTTL,
          });
        } catch (cacheError) {
          logger.warn('Error caching story', serializeError(cacheError));
          // Continue even if caching fails
        }

        // Increment the user's story count
        await this.incrementStoryCount();

        return storyContent;
      } catch (error) {
        logger.error('Error generating story with Gemini API', serializeError(error));
        throw error;
      }
    };

    // Define the fallback function to be used when the API call fails
    const fallbackFunction = () => {
      logger.warn('Using fallback story generation due to API failure', {
        circuitState: geminiCircuitBreaker.status.stats,
        metrics: geminiCircuitBreaker.stats,
      });

      return generateFallbackStory(input);
    };

    try {
      // Use the circuit breaker to make the API call
      return await geminiCircuitBreaker.fire(apiCallFunction);
    } catch (error) {
      // This catch block handles any errors that might occur in the circuit breaker itself
      logger.error('Circuit breaker caught error', serializeError(error));
      return fallbackFunction();
    }
  }

  /**
   * Generate personalized story using Gemini API endpoint
   *
   * This method generates a story using the Gemini API, with caching and fallback mechanisms.
   * It includes comprehensive error handling, circuit breaking, and detailed logging.
   *
   * @param input Story generation input parameters
   * @returns Generated story content
   */
  async generatePersonalizedStory(
    input: StoryInput,
    userPrefs?: UserPreferencesLocal
  ): Promise<Story> {
    logger.info('Starting personalized story generation', {
      input,
      userPrefs: userPrefs
        ? { ...userPrefs, userId: userPrefs.userId ? 'REDACTED' : null }
        : undefined,
    });

    // Create a unique ID for this story
    const storyId = this.generateUniqueId();

    // Determine pronouns based on gender
    const pronouns =
      input.gender === 'female' || input.gender === 'girl'
        ? 'she/her'
        : input.gender === 'boy' || input.gender === 'male'
          ? 'he/him'
          : 'they/them';
    const [pronoun, possessivePronoun] = pronouns.split('/');

    // Create a cache key based on the input parameters
    const cacheKey = this.generateCacheKey(input);

    try {
      // Check if we have a cached story for these parameters
      const cachedStory = await kv.get<string>(cacheKey);

      if (cachedStory) {
        logger.info('Using cached story', {
          cacheKey,
          userId: this.userId,
          contentLength: cachedStory.length,
        });

        // Parse the cached story to extract title and content
        const titleMatch = cachedStory.match(/^#\s*(.+?)(?:\n|$)/m);
        const title = titleMatch ? titleMatch[1].trim() : 'Untitled Story';
        const content = cachedStory.replace(/^#\s*(.+?)(?:\n|$)/m, '').trim();

        return {
          id: storyId,
          title,
          content,
          theme: input.theme,
          createdAt: new Date().toISOString(),
          input,
          metadata: {
            pronouns: pronoun,
            possessivePronouns: possessivePronoun,
            generatedAt: new Date().toISOString(),
            wordCount: content.split(/\s+/).length,
            readingTime: Math.ceil(content.split(/\s+/).length / 200), // Approx. 200 words per minute
          },
          userId: this.userId,
          pronouns: pronoun,
          possessivePronouns: possessivePronoun,
          generatedAt: new Date().toISOString(),
        };
      }

      // No cached story found, generate a new one
      logger.info('No cached story found, generating new story', {
        cacheKey,
        userId: this.userId,
      });

      // Define the API call function to be passed to the circuit breaker
      const apiCallFunction = async () => {
        try {
          // Prepare the API request
          const themeDescription = THEME_DESCRIPTIONS[input.theme as StoryTheme] || input.theme;
          const themeElements = THEME_ELEMENTS[input.theme as StoryTheme];

          // Get user preferences for enhanced personalization
          const prefs = userPrefs || (await this.getUserPreferences());

          // Construct a detailed prompt for the story
          const prompt = `
            Create a bedtime story for a child named ${input.childName} who uses ${pronouns} pronouns.

            The story should be about ${themeDescription}.

            ${input.interests?.length ? `Include these interests: ${input.interests.join(', ')}.` : ''}
            ${prefs.learningInterests?.length ? `The child is also interested in learning about: ${prefs.learningInterests.join(', ')}.` : ''}

            ${
              themeElements
                ? `
            You can use these settings: ${themeElements.settings.join(', ')}.
            You can include these character types: ${themeElements.characters.join(', ')}.
            You can incorporate these challenges: ${themeElements.challenges.join(', ')}.
            `
                : ''
            }
            
            ${input.favoriteCharacters?.length ? `Try to include references to these favorite characters: ${input.favoriteCharacters.join(', ')}.` : ''}
            ${input.mostLikedCharacterTypes?.length ? `The child enjoys characters that are: ${input.mostLikedCharacterTypes.join(', ')}.` : ''}
            
            Make the story age-appropriate for a ${prefs.ageGroup || '6-8'} year old child.
            The story should be engaging, with a positive message.

            Format the story with a title at the beginning using a single # markdown heading.
            Keep the story under 500 words.
          `;

          // Make the API request to Gemini
          const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'story',
              childName: input.childName,
              gender: input.gender,
              theme: input.theme,
              interests: input.interests,
              prompt: prompt,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${errorData.error || response.statusText}`);
          }

          const data = await response.json();
          const storyContent = data.content;

          // Parse the story to extract title and content
          const titleMatch = storyContent.match(/^#\s*(.+?)(?:\n|$)/m);
          const title = titleMatch ? titleMatch[1].trim() : 'Untitled Story';
          const content = storyContent.replace(/^#\s*(.+?)(?:\n|$)/m, '').trim();

          // Cache the generated story
          const cacheTTL = 60 * 60 * 24; // 24 hours
          await kv.set(cacheKey, storyContent, { ex: cacheTTL });

          logger.info('Successfully generated and cached story', {
            userId: this.userId,
            title,
            contentLength: content.length,
            cacheTTL,
          });

          // Increment the user's story count
          await this.incrementStoryCount();

          // Create and return the story object
          return {
            id: storyId,
            title,
            content,
            theme: input.theme,
            createdAt: new Date().toISOString(),
            input,
            metadata: {
              pronouns: pronoun,
              possessivePronouns: possessivePronoun,
              generatedAt: new Date().toISOString(),
              wordCount: content.split(/\s+/).length,
              readingTime: Math.ceil(content.split(/\s+/).length / 200), // Approx. 200 words per minute
            },
            userId: this.userId,
            pronouns: pronoun,
            possessivePronouns: possessivePronoun,
            generatedAt: new Date().toISOString(),
          };
        } catch (error) {
          logger.error('Error generating story with Gemini API', serializeError(error));
          throw error;
        }
      };

      // Define the fallback function to be used when the API call fails
      const fallbackFunction = () => {
        logger.warn('Using fallback story generation due to API failure', {
          circuitState: geminiCircuitBreaker.status.stats,
          metrics: geminiCircuitBreaker.stats,
        });

        const fallbackContent = generateFallbackStory(input);

        // Parse the fallback story
        const titleMatch = fallbackContent.match(/^#\s*(.+?)(?:\n|$)/m);
        const title = titleMatch
          ? titleMatch[1].trim()
          : `${input.theme.charAt(0).toUpperCase() + input.theme.slice(1)} Adventure`;
        const content = titleMatch
          ? fallbackContent.replace(/^#\s*(.+?)(?:\n|$)/m, '').trim()
          : fallbackContent;

        return {
          id: storyId,
          title,
          content,
          theme: input.theme,
          createdAt: new Date().toISOString(),
          input,
          metadata: {
            pronouns: pronoun,
            possessivePronouns: possessivePronoun,
            generatedAt: new Date().toISOString(),
            wordCount: content.split(/\s+/).length,
            readingTime: Math.ceil(content.split(/\s+/).length / 200),
            fallback: true,
          },
          userId: this.userId,
          pronouns: pronoun,
          possessivePronouns: possessivePronoun,
          generatedAt: new Date().toISOString(),
        };
      };

      try {
        // Use the Opossum circuit breaker to make the API call
        return await geminiCircuitBreaker.fire(apiCallFunction);
      } catch (error) {
        // This catch block handles any errors that might occur in the circuit breaker itself
        logger.error('Circuit breaker caught error', serializeError(error));
        return fallbackFunction();
      }
    } catch (error) {
      // This catch block handles any errors in the overall story generation process
      logger.error('Error in generatePersonalizedStory', serializeError(error));

      const fallbackContent = generateFallbackStory(input);

      return {
        id: storyId,
        title: `${input.theme.charAt(0).toUpperCase() + input.theme.slice(1)} Adventure`,
        content: fallbackContent,
        theme: input.theme,
        createdAt: new Date().toISOString(),
        input,
        metadata: {
          pronouns: pronoun,
          possessivePronouns: possessivePronoun,
          generatedAt: new Date().toISOString(),
          wordCount: fallbackContent.split(/\s+/).length,
          readingTime: Math.ceil(fallbackContent.split(/\s+/).length / 200),
          fallback: true,
          error: (error as Error).message,
        },
        userId: this.userId,
        pronouns: pronoun,
        possessivePronouns: possessivePronoun,
        generatedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Call the Gemini API endpoint to generate a story
   *
   * This method makes a request to the Gemini API endpoint with the story input parameters.
   * It includes error handling and detailed logging.
   *
   * @param input Story generation input parameters
   * @returns Generated story content
   */
  private async callGeminiEndpoint(input: StoryInput): Promise<string> {
    try {
      logger.info('Calling Gemini API endpoint for story generation', {
        childName: input.childName,
        theme: input.theme,
        gender: input.gender,
        interestsCount: input.interests?.length || 0,
      });

      // Get user preferences for enhanced personalization
      const prefs = await this.getUserPreferences();

      // Determine pronouns based on gender
      const pronouns =
        input.gender === 'female' || input.gender === 'girl'
          ? 'she/her'
          : input.gender === 'boy' || input.gender === 'male'
            ? 'he/him'
            : 'they/them';

      // Prepare the API request
      const themeDescription = THEME_DESCRIPTIONS[input.theme as StoryTheme] || input.theme;
      const themeElements = THEME_ELEMENTS[input.theme as StoryTheme];

      // Construct a detailed prompt for the story
      const prompt = `
        Create a bedtime story for a child named ${input.childName} who uses ${pronouns} pronouns.

        The story should be about ${themeDescription}.

        ${input.interests?.length ? `Include these interests: ${input.interests.join(', ')}.` : ''}
        ${prefs.learningInterests?.length ? `The child is also interested in learning about: ${prefs.learningInterests.join(', ')}.` : ''}

        ${
          themeElements
            ? `
        You can use these settings: ${themeElements.settings.join(', ')}.
        You can include these character types: ${themeElements.characters.join(', ')}.
        You can incorporate these challenges: ${themeElements.challenges.join(', ')}.
        `
            : ''
        }
        
        ${input.favoriteCharacters?.length ? `Try to include references to these favorite characters: ${input.favoriteCharacters.join(', ')}.` : ''}
        ${input.mostLikedCharacterTypes?.length ? `The child enjoys characters that are: ${input.mostLikedCharacterTypes.join(', ')}.` : ''}
        
        Make the story age-appropriate for a ${prefs.ageGroup || '6-8'} year old child.
        The story should be engaging, with a positive message.

        Format the story with a title at the beginning using a single # markdown heading.
        Keep the story under 500 words.
      `;

      // Make the API request to Gemini
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'story',
          childName: input.childName,
          gender: input.gender,
          theme: input.theme,
          interests: input.interests,
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();

      logger.info('Successfully received story from Gemini API', {
        contentLength: data.content.length,
        model: data.model,
      });

      return data.content;
    } catch (error) {
      logger.error('Error calling Gemini API endpoint', serializeError(error));
      throw error;
    }
  }

  /**
   * Store generated story in user history
   *
   * This method saves a generated story to the user's history in the database.
   * It includes error handling and detailed logging.
   *
   * @param story Story object to save
   * @returns Whether the operation was successful
   */
  async saveStoryToHistory(story: Story): Promise<boolean> {
    if (!this.userId || this.userId === 'default-user') return false;

    try {
      // Create a history entry with minimal data to save space
      const historyEntry = {
        id: story.id,
        title: story.title,
        theme: story.theme,
        childName: story.input.childName,
        createdAt: story.createdAt,
        wordCount: story.metadata.wordCount || 0,
        fallback: story.metadata.fallback || false,
      };

      // Get current user data
      const userData = await kv.hgetall(`user:${this.userId}`);

      if (!userData) {
        logger.warn('No user data found when saving story to history', {
          userId: this.userId,
        });
        return false;
      }

      // Get current history or initialize empty array
      const currentHistory = JSON.parse((userData.storyHistory as string) || '[]');

      // Add new story to history (at the beginning)
      const updatedHistory = [historyEntry, ...currentHistory].slice(0, 20); // Keep only last 20 stories

      // Update history in database
      await kv.hset(`user:${this.userId}`, {
        storyHistory: JSON.stringify(updatedHistory),
        lastStoryGeneratedAt: new Date().toISOString(),
      });

      logger.info('Successfully saved story to history', {
        userId: this.userId,
        storyId: story.id,
        historyLength: updatedHistory.length,
      });

      return true;
    } catch (error) {
      logger.error('Error saving story to history', serializeError(error));
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

export * from '../types/story';
