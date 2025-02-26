/**
 * Processes and formats story text for better readability
 * - Extracts and formats title
 * - Ensures proper paragraph spacing
 * - Formats dialogue
 * - Adds emphasis to character dialogue
 */
export const processStoryText = (story: string): string => {
  if (!story) return '';

  // Remove leading/trailing whitespace
  let processedStory = story.trim();

  // Extract title if it exists in markdown format
  const titleMatch = processedStory.match(/^#\s*(.+)$/m);
  if (titleMatch) {
    // Remove the markdown title line and any "Title:" prefix in the content
    processedStory = processedStory
      .replace(/^#\s*.+\n+/, '') // Remove markdown title
      .replace(/^Title:\s*(.+)\n+/m, '') // Remove "Title:" prefix if present
      .trim();
  }

  // Ensure paragraphs are separated by double newlines
  processedStory = processedStory.replace(/\n\s*\n/g, '\n\n');

  // If no paragraphs exist, split into paragraphs every 3-4 sentences
  if (!processedStory.includes('\n\n')) {
    const sentences = processedStory.split(/(?<=[.!?])\s+/);
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 4) {
      paragraphs.push(sentences.slice(i, i + 4).join(' '));
    }
    processedStory = paragraphs.join('\n\n');
  }

  // Ensure proper spacing around dialogue
  processedStory = processedStory.replace(/([.!?])"(\s*)([A-Z])/g, '$1"\n\n$3');

  // Add emphasis to character dialogue
  processedStory = processedStory.replace(/"([^"]+)"/g, '*"$1"*');

  // If we found a title, add it back at the beginning with markdown formatting
  if (titleMatch) {
    processedStory = `# ${titleMatch[1]}\n\n${processedStory}`;
  }

  return processedStory;
};

/**
 * Counts words in a story
 */
export const countWords = (text: string): number => {
  const trimmedText = text.trim();
  return trimmedText ? trimmedText.split(/\s+/).length : 0;
};

/**
 * Estimates reading time in minutes based on average reading speed
 * @param text The text to estimate reading time for
 * @param wordsPerMinute Average reading speed (default: 200 for children's stories)
 */
export const estimateReadingTime = (text: string, wordsPerMinute = 200): number => {
  const words = countWords(text);
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Extracts the title from a story
 * @param story The story text to extract title from
 * @returns The extracted title or undefined if no title is found
 */
export const extractTitle = (story: string): string | undefined => {
  const titleMatch = story.match(/^#\s*(.+)$/m);
  return titleMatch ? titleMatch[1] : undefined;
};
