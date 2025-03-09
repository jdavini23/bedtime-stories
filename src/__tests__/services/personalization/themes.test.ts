import { describe, it, expect } from 'vitest';
import {
  THEME_DESCRIPTIONS,
  THEME_ELEMENTS,
  suggestCharacterTraits,
} from '@/services/personalization/themes';
import { StoryTheme } from '@/types/story';

describe('Themes Module', () => {
  describe('THEME_DESCRIPTIONS', () => {
    it('should contain all required theme descriptions', () => {
      expect(THEME_DESCRIPTIONS).toBeDefined();
      expect(Object.keys(THEME_DESCRIPTIONS).length).toBeGreaterThan(0);
      expect(THEME_DESCRIPTIONS.adventure).toBeDefined();
      expect(THEME_DESCRIPTIONS.fantasy).toBeDefined();
    });

    it('should have valid descriptions for each theme', () => {
      Object.entries(THEME_DESCRIPTIONS).forEach(([theme, description]) => {
        expect(description).toBeDefined();
        expect(typeof description).toBe('string');
        expect(description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('THEME_ELEMENTS', () => {
    it('should contain all required theme elements', () => {
      expect(THEME_ELEMENTS).toBeDefined();
      expect(Object.keys(THEME_ELEMENTS).length).toBeGreaterThan(0);
      expect(THEME_ELEMENTS.adventure).toBeDefined();
      expect(THEME_ELEMENTS.fantasy).toBeDefined();
    });

    it('should have valid elements for each theme', () => {
      Object.entries(THEME_ELEMENTS).forEach(([theme, elements]) => {
        expect(elements.settings).toBeDefined();
        expect(Array.isArray(elements.settings)).toBe(true);
        expect(elements.settings.length).toBeGreaterThan(0);

        expect(elements.characters).toBeDefined();
        expect(Array.isArray(elements.characters)).toBe(true);
        expect(elements.characters.length).toBeGreaterThan(0);

        expect(elements.challenges).toBeDefined();
        expect(Array.isArray(elements.challenges)).toBe(true);
        expect(elements.challenges.length).toBeGreaterThan(0);
      });
    });
  });

  describe('suggestCharacterTraits', () => {
    it('should return two traits for a valid theme', () => {
      const theme: StoryTheme = 'adventure';
      const traits = suggestCharacterTraits(theme);
      expect(Array.isArray(traits)).toBe(true);
      expect(traits.length).toBe(2);
      expect(traits[0]).toBeDefined();
      expect(traits[1]).toBeDefined();
    });

    it('should return unique traits', () => {
      const theme: StoryTheme = 'adventure';
      const traits = suggestCharacterTraits(theme);
      expect(traits[0]).not.toBe(traits[1]);
    });

    it('should return traits for all valid themes', () => {
      const themes: StoryTheme[] = [
        'adventure',
        'fantasy',
        'science',
        'nature',
        'friendship',
        'educational',
        'courage',
        'kindness',
        'curiosity',
        'creativity',
      ];

      themes.forEach((theme) => {
        const traits = suggestCharacterTraits(theme);
        expect(traits.length).toBe(2);
        expect(typeof traits[0]).toBe('string');
        expect(typeof traits[1]).toBe('string');
      });
    });
  });
});
