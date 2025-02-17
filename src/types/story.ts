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

export type StoryGender = 'boy' | 'girl' | 'neutral';

export interface StoryInput {
  childName: string;
  interests: string[];
  theme: StoryTheme;
  gender: StoryGender;
}

export interface Story {
  id: string;
  content: string;
  createdAt: string;
  input: StoryInput;
}

export interface StoryError {
  message: string;
  code?: string;
}


