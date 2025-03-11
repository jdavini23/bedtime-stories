import { StoryInput, StoryTheme, StoryGender, StoryMetadata } from '@/types/story';
import {
  StoryCharacter,
  UserPreferencesLocal,
  EnhancedStoryInput,
} from '@/services/personalization';

// Extend the EnhancedStoryInput to include ageGroup
export interface ExtendedStoryInput extends EnhancedStoryInput {
  ageGroup?: UserPreferencesLocal['ageGroup'];
}

export interface ConversationalWizardProps {
  onComplete: (input: ExtendedStoryInput) => Promise<void>;
  isLoading?: boolean;
}

// Define the different types of messages in our conversation
export type MessageType =
  | 'welcome'
  | 'theme-question'
  | 'theme-response'
  | 'name-question'
  | 'name-response'
  | 'age-question'
  | 'age-response'
  | 'gender-question'
  | 'gender-response'
  | 'interests-question'
  | 'interests-response'
  | 'traits-question'
  | 'traits-response'
  | 'supporting-character-question'
  | 'supporting-character-response'
  | 'reading-level-question'
  | 'reading-level-response'
  | 'summary'
  | 'generating';

export interface Message {
  id: string;
  type: MessageType;
  content: React.ReactNode;
  sender: 'system' | 'user';
  timestamp: Date;
}

// Theme options with emojis and descriptions
export const THEME_OPTIONS = [
  {
    value: 'adventure',
    emoji: '🧭',
    label: 'Adventure',
    description: 'Exciting journeys and discoveries',
  },
  { value: 'fantasy', emoji: '✨', label: 'Fantasy', description: 'Magical worlds and creatures' },
  { value: 'science', emoji: '🔬', label: 'Science', description: 'Exploration and discovery' },
  { value: 'nature', emoji: '🌿', label: 'Nature', description: 'Animals and the natural world' },
  { value: 'friendship', emoji: '👫', label: 'Friendship', description: 'Building relationships' },
  { value: 'educational', emoji: '📚', label: 'Educational', description: 'Learning new things' },
  { value: 'courage', emoji: '🦁', label: 'Courage', description: 'Overcoming challenges' },
  { value: 'kindness', emoji: '💖', label: 'Kindness', description: 'Helping others' },
  { value: 'curiosity', emoji: '🔍', label: 'Curiosity', description: 'Exploring the unknown' },
  { value: 'creativity', emoji: '🎨', label: 'Creativity', description: 'Imagination and art' },
] as const;

// Gender options with emojis
export const GENDER_OPTIONS = [
  { value: 'boy', emoji: '👦', label: 'Boy' },
  { value: 'girl', emoji: '👧', label: 'Girl' },
] as const;

// Common interests with emojis
export const COMMON_INTERESTS = [
  { value: 'Dinosaurs', emoji: '🦕' },
  { value: 'Space', emoji: '🚀' },
  { value: 'Superheroes', emoji: '🦸' },
  { value: 'Unicorns', emoji: '🦄' },
  { value: 'Pirates', emoji: '🏴‍☠️' },
  { value: 'Princesses', emoji: '👸' },
  { value: 'Animals', emoji: '🐾' },
  { value: 'Magic', emoji: '🪄' },
  { value: 'Adventure', emoji: '🧭' },
  { value: 'Science', emoji: '🔬' },
  { value: 'Robots', emoji: '🤖' },
  { value: 'Dragons', emoji: '🐉' },
  { value: 'Nature', emoji: '🌿' },
  { value: 'Music', emoji: '🎵' },
  { value: 'Art', emoji: '🎨' },
  { value: 'Sports', emoji: '⚽' },
] as const;

// Reading level options with descriptions
export const READING_LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner', description: 'Simple words and short sentences' },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'More complex sentences and vocabulary',
  },
  { value: 'advanced', label: 'Advanced', description: 'Rich vocabulary and longer paragraphs' },
] as const;

// Age group options
export const AGE_GROUP_OPTIONS = [
  { value: '3-5', label: '3-5 years' },
  { value: '6-8', label: '6-8 years' },
  { value: '9-12', label: '9-12 years' },
] as const;
