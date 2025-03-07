import { StoryInput } from '../services/personalizationEngine';
import { logger } from './logger';

/**
 * Generate a fallback story when the OpenAI API call fails
 *
 * This function creates a template-based story with personalization elements
 * based on the input parameters. It provides a graceful degradation experience
 * when the primary story generation method is unavailable.
 *
 * @param input Story generation input parameters
 * @returns Generated fallback story content
 */
export function generateFallbackStory(input: StoryInput): string {
  logger.info('Generating fallback story', {
    childName: input.childName,
    theme: input.theme,
  });

  // Determine pronouns based on gender
  const pronouns = input.gender === 'female' ? 'she/her' : 'he/him';
  const pronoun = pronouns.split('/')[0];
  const possessivePronoun = input.gender === 'female' ? 'her' : 'his';

  // Get a random template based on the theme
  const template = getTemplateForTheme(input.theme);

  // Replace placeholders with personalized content
  const story = template
    .replace(/\{childName\}/g, input.childName)
    .replace(/\{pronoun\}/g, pronoun)
    .replace(/\{possessivePronoun\}/g, possessivePronoun)
    .replace(/\{theme\}/g, input.theme);

  logger.debug('Fallback story generated', {
    storyLength: story.length,
  });

  return story;
}

/**
 * Get a story template based on the theme
 *
 * @param theme Story theme
 * @returns Story template with placeholders
 */
function getTemplateForTheme(theme: string): string {
  const templates: Record<string, string[]> = {
    adventure: [
      'Once upon a time, there was a brave explorer named {childName}. {pronoun} lived in a small village near a mysterious forest. One day, {childName} decided to venture into the forest to discover its secrets. As {pronoun} walked deeper into the woods, {pronoun} found a magical map that showed the way to a hidden treasure. With determination in {possessivePronoun} heart, {childName} followed the map through mountains, rivers, and caves. Along the way, {pronoun} made friends with forest animals who helped {possessivePronoun} overcome obstacles. Finally, {childName} found the treasure - a beautiful crystal that glowed with all the colors of the rainbow. But the real treasure was the adventure itself and the friends {pronoun} made along the way. When {childName} returned home, everyone celebrated {possessivePronoun} bravery and listened to {possessivePronoun} amazing adventure stories.',
      '{childName} was always curious about what lay beyond the mountains near {possessivePronoun} home. One sunny morning, {pronoun} packed a small backpack with snacks, a water bottle, and {possessivePronoun} favorite compass. "I\'m going on an adventure!" {pronoun} announced to {possessivePronoun} parents. With their blessing, {childName} set off toward the mountains. The path was winding and sometimes steep, but {childName}\'s determination kept {possessivePronoun} going. Along the way, {pronoun} met a friendly fox who decided to join {possessivePronoun} journey. Together, they discovered a hidden valley with a crystal-clear lake and flowers of every color imaginable. {childName} and the fox spent the day exploring the valley, swimming in the lake, and making flower crowns. As the sun began to set, {childName} knew it was time to return home. {pronoun} promised the fox {pronoun} would return soon for another adventure. That night, as {childName} drifted off to sleep, {pronoun} dreamed of all the adventures yet to come.',
    ],
    fantasy: [
      "In a magical kingdom far away, there lived a young {theme} enthusiast named {childName}. {pronoun} had always dreamed of having magical powers. One night, as {childName} was gazing at the stars from {possessivePronoun} window, a shooting star streaked across the sky. {childName} closed {possessivePronoun} eyes and made a wish. The next morning, {pronoun} discovered {pronoun} could make small objects float! {childName} was overjoyed and spent the day practicing {possessivePronoun} new magical ability. {pronoun} used {possessivePronoun} power to help others - retrieving toys from high shelves for younger children and helping an elderly neighbor pick apples from tall trees. The wise wizard of the kingdom heard about {childName}'s good deeds and invited {possessivePronoun} to the royal academy of magic. There, {childName} learned that true magic comes not from special powers, but from using your gifts to bring joy to others.",
      'Once upon a time in the enchanted forest of Whisperwood, there lived a kind-hearted child named {childName}. What made {childName} special was {possessivePronoun} ability to understand the language of animals. Every morning, {pronoun} would wake up to the cheerful conversations of birds outside {possessivePronoun} window. One day, {childName} heard the animals talking about a problem - the ancient magic tree at the heart of the forest was losing its glow. Without its light, the forest would lose its magic. {childName} decided to help. Guided by a wise old owl, {pronoun} journeyed to the magic tree. The tree told {childName} that it needed the sound of laughter and joy to regain its strength. So {childName} organized a grand festival where animals and forest spirits gathered to share stories, sing songs, and play games. The forest echoed with happiness, and slowly, the magic tree began to glow again, brighter than ever before. From that day on, {childName} was known as the Guardian of Whisperwood, and {pronoun} continued to bring joy to the enchanted forest.',
    ],
    science: [
      '{childName} had always been fascinated by the stars and planets. In {possessivePronoun} room, {pronoun} had posters of galaxies and a telescope by the window. One evening, while looking through {possessivePronoun} telescope, {childName} spotted something unusual - a star that seemed to be changing colors! {pronoun} carefully recorded {possessivePronoun} observations in a notebook. The next day, {childName} visited the local observatory to share {possessivePronoun} discovery with Dr. Martinez, an astronomer. Dr. Martinez was impressed by {childName}\'s detailed notes and together they continued to observe the color-changing star. After weeks of research, they discovered it was actually a new type of pulsar that had never been documented before! The discovery was published in a science journal, and the pulsar was named "{childName}\'s Star." This experience inspired {childName} to study astronomy in school, knowing that with curiosity and careful observation, anyone can contribute to scientific discovery.',
      "In {childName}'s bedroom, there was a special corner filled with rocks, magnets, test tubes, and a microscope - {possessivePronoun} very own science lab. One rainy Saturday, {childName} decided to experiment with growing crystals. {pronoun} carefully mixed the solution according to the instructions in {possessivePronoun} science book and placed it in a quiet spot. Each day, {childName} observed the jar, taking notes and drawings of the changes. Slowly, beautiful crystal formations began to appear, sparkling like tiny jewels. {childName}'s parents were amazed by {possessivePronoun} patience and scientific approach. When {pronoun} brought the crystals to school for Science Day, everyone was impressed. {childName}'s teacher suggested {pronoun} create a guide to help other children grow their own crystals. {childName} worked hard on the guide, including all {possessivePronoun} observations and tips. The school published it in their newsletter, and soon many children in town were growing crystals, all thanks to {childName}'s scientific curiosity and willingness to share knowledge.",
    ],
    animals: [
      "{childName} had a special talent for understanding animals. One day while walking in the park, {pronoun} heard a soft whimpering coming from a bush. {childName} carefully looked inside and found a small, frightened puppy with a hurt paw. \"It's okay, little one,\" {childName} said gently. \"I'll help you.\" {pronoun} carefully picked up the puppy and took it home. {childName}'s parents helped clean and bandage the puppy's paw, and they put up notices around the neighborhood to find its owner. Days passed, but no one claimed the puppy. The puppy, whom {childName} had named Buddy, was getting stronger every day and followed {childName} everywhere. {childName}'s parents saw how much the two had bonded and agreed that Buddy could stay as part of their family. {childName} promised to take excellent care of Buddy forever. From that day on, {childName} and Buddy were inseparable friends, and {childName}'s kindness toward animals inspired others in the neighborhood to help animals in need.",
      "Every morning, {childName} would sit by the window with a bird feeder {pronoun} had made with {possessivePronoun} parents. {pronoun} kept a notebook where {pronoun} drew pictures of all the different birds that visited. One day, {childName} noticed a small bird with a bright blue wing that couldn't fly properly. Carefully, {childName} went outside and found that the bird had a small thorn stuck in its wing. With gentle hands and a brave heart, {childName} carefully removed the thorn. {pronoun} made a small, comfortable nest in a shoebox and placed it in a safe spot in the garden. Each day, {childName} left food and water for the blue-winged bird and watched as it grew stronger. After a week, the bird was able to fly again. Before it flew away, it sang a beautiful song that seemed just for {childName}. From that day on, the blue-winged bird would return to {childName}'s garden every spring, bringing joy and reminding everyone of how a small act of kindness can make a big difference.",
    ],
    sports: [
      "{childName} loved playing soccer more than anything else. Every day after school, {pronoun} would practice in the backyard, dribbling between cones and shooting at a small goal. {childName}'s dream was to join the school soccer team, but {pronoun} was nervous about the tryouts. When the day finally came, {childName} took a deep breath and remembered all {possessivePronoun} practice. {pronoun} dribbled skillfully, passed accurately, and even scored a goal! The coach was impressed with {childName}'s skills and teamwork. Not only did {childName} make the team, but {pronoun} was also chosen to be the team captain! {childName} learned that with dedication, practice, and courage, you can achieve your goals. Throughout the season, {pronoun} helped teammates improve their skills too, showing that a true champion lifts others up. {childName}'s team didn't win every game, but they always played with heart, and that made {childName} prouder than any trophy ever could.",
      "{childName} had always been fascinated by swimming. Whenever {pronoun} saw water - whether it was a pool, lake, or even a puddle - {possessivePronoun} eyes would light up with excitement. {childName}'s parents enrolled {possessivePronoun} in swimming lessons at the local community center. At first, {childName} was a bit afraid of putting {possessivePronoun} face underwater, but with encouragement from {possessivePronoun} instructor, {pronoun} gradually overcame this fear. Week after week, {childName} practiced kicking, arm strokes, and breathing techniques. {pronoun} was determined to improve. By the end of the summer, {childName} had become so skilled that {pronoun} was invited to join the junior swim team! On the day of {possessivePronoun} first race, {childName} was nervous but excited. When the whistle blew, {pronoun} dived into the water and swam with all {possessivePronoun} might. {childName} didn't come in first place, but {pronoun} completed the race with {possessivePronoun} best time ever! As {pronoun} climbed out of the pool, {possessivePronoun} coach and teammates cheered loudly. {childName} learned that the joy of sports comes not just from winning, but from challenging yourself and improving a little bit each day.",
    ],
  };

  // Default to adventure if theme not found
  const themeTemplates = templates[theme.toLowerCase()] || templates.adventure;

  // Get a random template from the available ones for this theme
  const randomIndex = Math.floor(Math.random() * themeTemplates.length);
  return themeTemplates[randomIndex];
}
