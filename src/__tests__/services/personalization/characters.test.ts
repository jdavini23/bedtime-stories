import { describe, it, expect } from 'vitest';
import { CHARACTER_TRAITS, CHARACTER_ARCHETYPES } from '@/services/personalization/characters';

describe('Characters Module', () => {
  describe('CHARACTER_TRAITS', () => {
    it('should contain all required character traits', () => {
      expect(CHARACTER_TRAITS).toBeDefined();
      expect(Object.keys(CHARACTER_TRAITS).length).toBeGreaterThan(0);
    });

    it('should have valid trait arrays', () => {
      Object.entries(CHARACTER_TRAITS).forEach(([category, traits]) => {
        expect(traits).toBeDefined();
        expect(Array.isArray(traits)).toBe(true);
        expect(traits.length).toBeGreaterThan(0);
        traits.forEach((trait) => {
          expect(typeof trait).toBe('string');
          expect(trait.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('CHARACTER_ARCHETYPES', () => {
    it('should contain all required character archetypes', () => {
      expect(CHARACTER_ARCHETYPES).toBeDefined();
      expect(Array.isArray(CHARACTER_ARCHETYPES)).toBe(true);
      expect(CHARACTER_ARCHETYPES.length).toBeGreaterThan(0);
    });

    it('should have valid archetype strings', () => {
      CHARACTER_ARCHETYPES.forEach((archetype) => {
        expect(typeof archetype).toBe('string');
        expect(archetype.length).toBeGreaterThan(0);
      });
    });
  });
});
