"use strict";
/**
 * Application-wide constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.THEME_ELEMENTS = exports.THEME_DESCRIPTIONS = exports.CACHE_KEYS = exports.GEMINI_MODELS = exports.OPENAI_MODELS = exports.ERROR_CODES = exports.AGE_GROUPS = exports.READING_LEVELS = exports.GENDER_OPTIONS = exports.STORY_MOODS = exports.STORY_THEMES = void 0;
// Story themes
exports.STORY_THEMES = [
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
];
// Story moods
exports.STORY_MOODS = [
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
];
// Gender options
exports.GENDER_OPTIONS = ['boy', 'girl', 'neutral', 'male', 'female'];
// Reading levels
exports.READING_LEVELS = ['beginner', 'intermediate', 'advanced'];
// Age groups
exports.AGE_GROUPS = ['3-5', '6-8', '9-12'];
// API error codes
exports.ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    RATE_LIMIT: 'RATE_LIMIT',
    GENERATION_ERROR: 'GENERATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
};
// OpenAI models
exports.OPENAI_MODELS = {
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
    GPT_4: 'gpt-4',
};
// Gemini models
exports.GEMINI_MODELS = {
    GEMINI_PRO: 'gemini-1.5-pro',
    GEMINI_FLASH: 'gemini-1.5-flash',
};
// Cache keys
exports.CACHE_KEYS = {
    STORY_PREFIX: 'story:',
    USER_PREFERENCES: 'user:preferences:',
};
// Theme descriptions
exports.THEME_DESCRIPTIONS = {
    adventure: 'an exciting journey filled with challenges and discoveries',
    fantasy: 'a magical world with enchanting creatures and spells',
    nature: 'stories about animals, plants, and the natural world',
    space: 'tales of cosmic exploration and discovery',
    friendship: 'stories about building relationships and understanding others',
};
// Theme elements
exports.THEME_ELEMENTS = {
    adventure: ['quests', 'journeys', 'discoveries', 'challenges', 'exploration'],
    fantasy: ['magic', 'mythical creatures', 'enchanted objects', 'spells'],
    nature: ['animals', 'forests', 'seasons', 'weather', 'plants'],
    space: ['planets', 'stars', 'spaceships', 'aliens', 'astronauts'],
    friendship: ['sharing', 'caring', 'understanding', 'helping', 'teamwork'],
};
