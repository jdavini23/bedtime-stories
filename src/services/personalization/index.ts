// Re-export types
export * from './types';

// Re-export theme-related constants and functions
export * from './themes';

// Re-export character-related constants and functions
export * from './characters';

// Re-export preferences management
export { PreferencesManager, DEFAULT_PREFERENCES } from './preferences';

// Re-export story generation
export { StoryGenerator } from './storyGeneration';

// Re-export caching
export { CacheManager } from './cache';

// Re-export analytics
export { AnalyticsManager } from './analytics';

// Create and export singleton instances
import { PreferencesManager } from './preferences';
import { StoryGenerator } from './storyGeneration';
import { CacheManager } from './cache';
import { AnalyticsManager } from './analytics';

// Initialize singleton instances
export const preferencesManager = new PreferencesManager('default-user');
export const storyGenerator = new StoryGenerator('default-user');
export const cacheManager = new CacheManager();
export const analyticsManager = new AnalyticsManager();
