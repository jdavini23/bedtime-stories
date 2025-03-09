import {
  STORY_THEMES,
  STORY_MOODS,
  GENDER_OPTIONS,
  READING_LEVELS,
  AGE_GROUPS,
} from '../constants';
import { ReadingLevel as PreferencesReadingLevel, StoryLength } from './preferences';

export type StoryTheme = (typeof STORY_THEMES)[number];
export type StoryMood = (typeof STORY_MOODS)[number];
export type StoryGender = (typeof GENDER_OPTIONS)[number];
export type ReadingLevel = PreferencesReadingLevel;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export type StoryMetadata = {
  pronouns: string;
  possessivePronouns: string;
  generatedAt: string;
  language?: string;
  wordCount?: number;
  readingLevel?: ReadingLevel;
};

export interface StoryInput {
  childName: string;
  childAge: number;
  theme: string;
  characters: string[];
  setting: string;
  length: StoryLength;
  readingLevel: ReadingLevel;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  metadata: {
    input: StoryInput;
    fallback?: boolean;
    timestamp: number;
  };
}

export interface UserPreferences {
  id?: string;
  userId: string | null;
  preferredThemes: string[];
  generatedStoryCount: number;
  generatedStories?: number;
  lastStoryGeneratedAt?: Date;
  learningInterests: string[];
  ageGroup: AgeGroup;
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
