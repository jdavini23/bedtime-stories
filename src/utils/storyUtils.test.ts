import { describe, it, expect } from 'vitest';
import { processStoryText, countWords, estimateReadingTime, extractTitle } from './storyUtils';

describe('storyUtils', () => {
  describe('processStoryText', () => {
    it('should handle empty input', () => {
      expect(processStoryText('')).toBe('');
    });

    it('should extract and format title', () => {
      const input = '# My Story Title\n\nThis is a story.';
      const expected = '# My Story Title\n\nThis is a story.';
      expect(processStoryText(input)).toBe(expected);
    });

    it('should ensure proper paragraph spacing', () => {
      const input = 'Paragraph one.\nParagraph two.';
      const expected = 'Paragraph one. Paragraph two.';
      expect(processStoryText(input)).toBe(expected);
    });

    it('should add emphasis to dialogue', () => {
      const input = 'He said "hello" to her.';
      const expected = 'He said *"hello"* to her.';
      expect(processStoryText(input)).toBe(expected);
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(countWords('This is a test')).toBe(4);
      expect(countWords('One')).toBe(1);
      expect(countWords('')).toBe(0);
      expect(countWords('   Multiple   spaces   between   ')).toBe(3);
    });
  });

  describe('estimateReadingTime', () => {
    it('should estimate reading time based on word count', () => {
      // 200 words at default 200 wpm = 1 minute
      const text200Words = Array(200).fill('word').join(' ');
      expect(estimateReadingTime(text200Words)).toBe(1);

      // 201 words at default 200 wpm = 2 minutes (ceiling)
      const text201Words = Array(201).fill('word').join(' ');
      expect(estimateReadingTime(text201Words)).toBe(2);
    });

    it('should use custom words per minute', () => {
      // 300 words at 100 wpm = 3 minutes
      const text300Words = Array(300).fill('word').join(' ');
      expect(estimateReadingTime(text300Words, 100)).toBe(3);
    });
  });

  describe('extractTitle', () => {
    it('should extract title from markdown heading', () => {
      expect(extractTitle('# My Story Title\n\nContent')).toBe('My Story Title');
      expect(extractTitle('#My Title\nContent')).toBe('My Title');
    });

    it('should return undefined when no title is found', () => {
      expect(extractTitle('No title here')).toBeUndefined();
      expect(extractTitle('')).toBeUndefined();
    });
  });
});
