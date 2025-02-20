export type StoryTheme =
  | 'adventure'
  | 'fantasy'
  | 'educational'
  | 'friendship'
  | 'courage'
  | 'kindness'
  | 'curiosity'
  | 'creativity'
  | 'nature'
  | 'science';

export type StoryMood =
  | 'humorous'
  | 'adventurous'
  | 'calming'
  | 'mysterious'
  | 'exciting'
  | 'whimsical'
  | 'dramatic'
  | 'peaceful'
  | 'inspiring'
  | 'magical';

export type StoryGender = 'boy' | 'girl' | 'neutral';

export type StoryMetadata = {
  pronouns: string;
  possessivePronouns: string;
  generatedAt: string;
  language?: string;
  wordCount?: number;
  readingLevel?: 'beginner' | 'intermediate' | 'advanced';
};

export interface StoryInput {
  childName: string;
  gender: StoryGender;
  theme: StoryTheme;
  interests: string[];
  favoriteCharacters?: string[];
  mostLikedCharacterTypes?: string[];
  mood?: StoryMood;
  language?: string;
  readingLevel?: StoryMetadata['readingLevel'];
  themes?: StoryTheme[];
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
  };
  userId?: string;
  pronouns: string;
  possessivePronouns: string;
  generatedAt: string;
}

export interface UserPreferences {
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

export interface StoryError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
