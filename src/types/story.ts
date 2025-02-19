export type StoryTheme = 
  'adventure' | 
  'fantasy' | 
  'educational' | 
  'friendship' | 
  'courage' | 
  'kindness' | 
  'curiosity' | 
  'creativity' | 
  'nature' | 
  'science';

export type StoryMood = 
  'humorous' | 
  'adventurous' | 
  'calming' | 
  'mysterious' | 
  'exciting' | 
  'whimsical' | 
  'dramatic' | 
  'peaceful' | 
  'inspiring' | 
  'magical';

export type StoryGender = 'boy' | 'girl' | 'neutral';

export interface StoryInput {
  childName: string;
  interests: string[];
  theme: StoryTheme;
  gender: StoryGender;
  favoriteCharacters?: string[];
  mood?: StoryMood;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  theme: StoryTheme;
  createdAt: string;
  input: StoryInput;
  userId?: string | null;
  metadata?: {
    pronouns: string;
    possessivePronouns: string;
    generatedAt: string;
  };
}

export interface StoryError {
  message: string;
  code?: string;
}
