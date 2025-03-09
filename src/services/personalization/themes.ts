import { StoryTheme } from '../../types/story';

// Define theme descriptions for more detailed story generation
export const THEME_DESCRIPTIONS: Record<StoryTheme, string> = {
  adventure: 'exciting journeys, exploration, and discovering new places',
  fantasy: 'magical worlds, enchanted creatures, and extraordinary powers',
  science: 'scientific discoveries, experiments, and understanding how things work',
  nature: 'the natural world, animals, plants, and environmental awareness',
  friendship: 'building relationships, working together, and supporting others',
  educational: 'learning new facts, developing skills, and gaining knowledge',
  courage: 'bravery in the face of challenges, overcoming fears, and standing up for what is right',
  kindness: 'compassion, helping others, and making a positive difference',
  curiosity: 'asking questions, seeking answers, and exploring the unknown',
  creativity: 'imagination, artistic expression, and innovative thinking',
};

// Define theme-specific story elements
export const THEME_ELEMENTS: Record<
  StoryTheme,
  { settings: string[]; characters: string[]; challenges: string[] }
> = {
  adventure: {
    settings: ['mysterious island', 'ancient ruins', 'dense jungle', 'mountain peak'],
    characters: ['brave explorer', 'treasure hunter', 'wilderness guide', 'ship captain'],
    challenges: ['crossing a dangerous river', 'finding a hidden map', 'escaping a storm'],
  },
  fantasy: {
    settings: ['enchanted forest', 'magical kingdom', 'cloud castle', 'underwater city'],
    characters: ['wizard', 'fairy', 'dragon', 'talking animal', 'magical creature'],
    challenges: ['breaking a spell', 'finding a magical artifact', 'solving a magical riddle'],
  },
  science: {
    settings: [
      'laboratory',
      'space station',
      'underwater research facility',
      "inventor's workshop",
    ],
    characters: ['scientist', 'robot', 'astronaut', 'inventor', 'time traveler'],
    challenges: ['completing an experiment', 'making a discovery', 'building a machine'],
  },
  nature: {
    settings: ['forest', 'ocean', 'mountain', 'desert', 'rainforest'],
    characters: ['wildlife ranger', 'talking animal', 'tree spirit', 'nature guardian'],
    challenges: ['protecting endangered animals', 'planting trees', 'cleaning up pollution'],
  },
  friendship: {
    settings: ['school', 'neighborhood', 'treehouse', 'playground', 'summer camp'],
    characters: ['new friend', 'best friend', 'neighbor', 'classmate', 'teammate'],
    challenges: ['making a new friend', 'resolving a misunderstanding', 'working together'],
  },
  educational: {
    settings: ['museum', 'library', 'historical site', 'classroom', 'learning center'],
    characters: ['teacher', 'librarian', 'historical figure', 'talking book', 'wise elder'],
    challenges: ['solving a puzzle', 'finding information', 'learning a new skill'],
  },
  courage: {
    settings: ['dark cave', 'stormy sea', 'tall mountain', 'unfamiliar city'],
    characters: ['hero', 'brave animal', 'guardian', 'mentor', 'someone in need'],
    challenges: ['facing a fear', 'standing up to a bully', 'trying something new'],
  },
  kindness: {
    settings: ['community center', 'animal shelter', 'hospital', 'elderly home', 'neighborhood'],
    characters: ['someone in need', 'grateful recipient', 'community helper', 'kind stranger'],
    challenges: ['helping someone in need', 'sharing limited resources', 'showing compassion'],
  },
  curiosity: {
    settings: ['mysterious door', 'strange garden', 'abandoned house', 'hidden passage'],
    characters: ['detective', 'explorer', 'scientist', 'archaeologist', 'curious animal'],
    challenges: ['solving a mystery', 'discovering a secret', 'finding answers to questions'],
  },
  creativity: {
    settings: ['art studio', 'music room', 'theater stage', 'imagination land', 'blank canvas'],
    characters: ['artist', 'musician', 'storyteller', 'inventor', 'dreamer'],
    challenges: [
      'creating something new',
      'expressing feelings through art',
      'imagining solutions',
    ],
  },
};

// Helper method to suggest character traits based on theme
export function suggestCharacterTraits(theme: StoryTheme): string[] {
  const themeBasedTraits: Record<StoryTheme, string[]> = {
    adventure: ['brave', 'curious', 'adventurous', 'determined'],
    fantasy: ['imaginative', 'curious', 'creative', 'brave'],
    science: ['curious', 'clever', 'analytical', 'inventive'],
    nature: ['gentle', 'observant', 'caring', 'patient'],
    friendship: ['kind', 'loyal', 'helpful', 'understanding'],
    educational: ['curious', 'attentive', 'thoughtful', 'clever'],
    courage: ['brave', 'determined', 'resilient', 'confident'],
    kindness: ['kind', 'generous', 'empathetic', 'thoughtful'],
    curiosity: ['curious', 'inquisitive', 'observant', 'thoughtful'],
    creativity: ['creative', 'imaginative', 'artistic', 'innovative'],
  };

  // Return 2 random traits from the theme-based list
  const traits = themeBasedTraits[theme] || themeBasedTraits.adventure;
  const selectedTraits = [];

  // Select 2 unique traits
  while (selectedTraits.length < 2 && traits.length > 0) {
    const randomIndex = Math.floor(Math.random() * traits.length);
    selectedTraits.push(traits[randomIndex]);
    traits.splice(randomIndex, 1); // Remove the selected trait to avoid duplicates
  }

  return selectedTraits;
}
