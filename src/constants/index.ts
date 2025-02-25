/**
 * Application-wide constants
 */

// Story themes
export const STORY_THEMES = [
  'adventure',
  'fantasy',
  'educational',
  'friendship',
  'courage',
  'kindness',
  'curiosity',
  'creativity',
  'nature',
  'science',
] as const;

// Story moods
export const STORY_MOODS = [
  'humorous',
  'adventurous',
  'calming',
  'mysterious',
  'exciting',
  'whimsical',
  'dramatic',
  'peaceful',
  'inspiring',
  'magical',
] as const;

// Gender options
export const GENDER_OPTIONS = ['boy', 'girl', 'neutral'] as const;

// Reading levels
export const READING_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

// Age groups
export const AGE_GROUPS = ['3-5', '6-8', '9-12'] as const;

// API error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  GENERATION_ERROR: 'GENERATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

// OpenAI models
export const OPENAI_MODELS = {
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_4: 'gpt-4',
} as const;

// Cache keys
export const CACHE_KEYS = {
  STORY_PREFIX: 'story:',
  USER_PREFERENCES: 'user:preferences:',
} as const;
