import type { Meta, StoryObj } from '@storybook/react';
import TextToSpeech from './TextToSpeech';

const meta: Meta<typeof TextToSpeech> = {
  title: 'Components/Story/TextToSpeech',
  component: TextToSpeech,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextToSpeech>;

export const Default: Story = {
  args: {
    text: 'Once upon a time, in a land far, far away, there lived a brave little dragon named Sparky. Sparky loved to explore the mountains and valleys around his home. One day, he discovered a hidden cave filled with sparkling gems and ancient treasures. But the cave was also home to a friendly old wizard who had been looking for a companion. The wizard and Sparky became the best of friends, and together they went on many magical adventures.',
  },
};

export const ShortStory: Story = {
  args: {
    text: 'The little star twinkled brightly in the night sky, watching over all the sleeping children below.',
  },
};

export const LongStory: Story = {
  args: {
    text: `Once upon a time, in a cozy little village nestled between rolling hills and whispering forests, there lived a curious child named Alex. Alex had a wild imagination and a heart full of wonder. Every night before bed, Alex's grandmother would tell the most amazing stories about magical creatures, brave heroes, and faraway lands.

One evening, as the stars began to twinkle in the night sky, Alex noticed something unusual outside the bedroom window. A tiny blue light was dancing in the garden, moving between the flowers and trees with purpose. Without hesitation, Alex slipped out of bed, put on slippers, and tiptoed downstairs and out into the garden.

The blue light stopped moving when Alex approached. To Alex's amazement, the light wasn't just a light—it was a tiny fairy with delicate wings that shimmered like morning dew in the moonlight.

"Hello," the fairy said in a voice that sounded like tiny bells. "My name is Whisper, and I've been sent to find someone with a pure heart and vivid imagination. I think you might be the one I'm looking for."

Alex could hardly believe what was happening. "Me? What do you need me for?"

Whisper explained that the magical realm was in trouble. The ancient Book of Dreams, which contained all the stories ever told and those yet to be imagined, had been stolen by the Shadow King. Without the book, children everywhere would stop dreaming, and the magical realm would fade away.

"Will you help us?" Whisper asked, her light dimming slightly with worry.

Without hesitation, Alex nodded. "I will."

Whisper sprinkled some fairy dust over Alex, and suddenly, they were both floating up into the night sky, past the clouds, and toward a shimmering portal that hadn't been there before. They traveled through the portal and arrived in the magical realm, a place where mountains floated in the sky, rivers flowed with liquid starlight, and trees whispered ancient secrets to those who knew how to listen.

Their journey to the Shadow King's castle was filled with adventures. They befriended a grumpy but loyal dragon named Ember, outsmarted a puzzle-loving troll at the Bridge of Riddles, and helped a lost cloud-sheep find its way back to its flock.

When they finally reached the Shadow King's dark castle, they discovered that the king wasn't evil—he was lonely. He had stolen the Book of Dreams because he wanted to be part of the stories, to be remembered and loved instead of feared.

Alex had an idea. With Whisper's help, they opened the Book of Dreams and began to write a new story—a story where the Shadow King used his powers to protect the magical realm, where he made friends and found a place where he belonged.

As they wrote, the words glowed and lifted off the page, swirling around the Shadow King. His dark cloak began to shimmer with stars, and his frown turned into a smile. He was becoming the Guardian of Dreams, a protector rather than a threat.

Grateful for his new purpose, the Guardian of Dreams returned the book to its rightful place in the heart of the magical realm. As a thank you, he gave Alex a special gift—a small journal that would never run out of pages, where any story written would come to life in dreams.

When it was time to go home, Alex said goodbye to new friends and promised to visit again. Back in the little village, no time had passed at all. But from that night on, Alex wrote in the special journal every evening, creating wonderful adventures for children everywhere to experience in their dreams.

And sometimes, on very special nights, a tiny blue light could be seen dancing in Alex's garden, waiting for the next adventure to begin.`,
  },
};
