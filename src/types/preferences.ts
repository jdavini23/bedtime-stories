export type Theme = 'light' | 'dark';
export type ReadingLevel = 'beginner' | 'intermediate' | 'advanced';
export type StoryLength = 'short' | 'medium' | 'long';

export interface UserPreferencesLocal {
  theme?: Theme;
  readingLevel?: ReadingLevel;
  storyLength?: StoryLength;
  generatedStories?: number;
}
