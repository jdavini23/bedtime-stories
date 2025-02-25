/**
 * Story Utilities Type Declarations
 *
 * This module provides utility functions for processing and analyzing story text.
 */

/**
 * Processes and formats story text for better readability
 * - Extracts and formats title
 * - Ensures proper paragraph spacing
 * - Formats dialogue
 * - Adds emphasis to character dialogue
 *
 * @param story - The raw story text to process
 * @returns Formatted story text with proper structure and formatting
 */
export function processStoryText(story: string): string;

/**
 * Counts words in a story
 *
 * @param text - The text to count words in
 * @returns The number of words in the text
 */
export function countWords(text: string): number;

/**
 * Estimates reading time in minutes based on average reading speed
 *
 * @param text - The text to estimate reading time for
 * @param wordsPerMinute - Average reading speed (default: 200 for children's stories)
 * @returns Estimated reading time in minutes
 */
export function estimateReadingTime(text: string, wordsPerMinute?: number): number;

/**
 * Extracts the title from a story
 *
 * @param story - The story text to extract title from
 * @returns The extracted title or undefined if no title is found
 */
export function extractTitle(story: string): string | undefined;
