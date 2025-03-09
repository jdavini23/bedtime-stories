import { StoryInput, StoryTheme } from '../../types/story';

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
  ageGroup?: UserPreferencesLocal['ageGroup'];
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
