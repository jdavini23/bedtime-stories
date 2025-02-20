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
  mostLikedCharacterTypes: string[];
  theme: StoryTheme;
  gender: StoryGender;
  favoriteCharacters?: string[];
  mood?: StoryMood;
  language?: string;
  readingLevel?: StoryMetadata['readingLevel'];
  themes?: StoryTheme[];
}

export interface Story {
  id: string;
  title: string;
  content: string;
  theme: StoryTheme;
  createdAt: string;
  input: StoryInput;
  userId: string | null | null | null | null | null | null;
  metadata: StoryMetadata;
}

export interface StoryError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
