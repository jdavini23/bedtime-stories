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
export const GENDER_OPTIONS = ['boy', 'girl', 'neutral', 'male', 'female'] as const;

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

// Gemini models
export const GEMINI_MODELS = {
  GEMINI_PRO: 'gemini-1.5-pro',
  GEMINI_FLASH: 'gemini-1.5-flash',
} as const;

// Cache keys
export const CACHE_KEYS = {
  STORY_PREFIX: 'story:',
  USER_PREFERENCES: 'user:preferences:',
} as const;

// Theme descriptions
export const THEME_DESCRIPTIONS = {
  adventure: 'an exciting journey filled with challenges and discoveries',
  fantasy: 'a magical world with enchanting creatures and spells',
  nature: 'stories about animals, plants, and the natural world',
  space: 'tales of cosmic exploration and discovery',
  friendship: 'stories about building relationships and understanding others',
} as const;

// Theme elements
export const THEME_ELEMENTS = {
  adventure: ['quests', 'journeys', 'discoveries', 'challenges', 'exploration'],
  fantasy: ['magic', 'mythical creatures', 'enchanted objects', 'spells'],
  nature: ['animals', 'forests', 'seasons', 'weather', 'plants'],
  space: ['planets', 'stars', 'spaceships', 'aliens', 'astronauts'],
  friendship: ['sharing', 'caring', 'understanding', 'helping', 'teamwork'],
} as const;
