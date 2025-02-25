import type { Meta, StoryObj } from '@storybook/react';
import ReadingTime from './ReadingTime';

const meta: Meta<typeof ReadingTime> = {
  title: 'Components/Story/ReadingTime',
  component: ReadingTime,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReadingTime>;

export const ShortText: Story = {
  args: {
    text: 'This is a very short text that should take less than a minute to read.',
  },
};

export const MediumText: Story = {
  args: {
    text: 'Once upon a time, in a land far, far away, there lived a brave little dragon named Sparky. Sparky loved to explore the mountains and valleys around his home. One day, he discovered a hidden cave filled with sparkling gems and ancient treasures. But the cave was also home to a friendly old wizard who had been looking for a companion. The wizard and Sparky became the best of friends, and together they went on many magical adventures.',
  },
};

export const LongText: Story = {
  args: {
    text: `Once upon a time, in a cozy little village nestled between rolling hills and whispering forests, there lived a curious child named Alex. Alex had a wild imagination and a heart full of wonder. Every night before bed, Alex's grandmother would tell the most amazing stories about magical creatures, brave heroes, and faraway lands.

One evening, as the stars began to twinkle in the night sky, Alex noticed something unusual outside the bedroom window. A tiny blue light was dancing in the garden, moving between the flowers and trees with purpose. Without hesitation, Alex slipped out of bed, put on slippers, and tiptoed downstairs and out into the garden.

The blue light stopped moving when Alex approached. To Alex's amazement, the light wasn't just a light—it was a tiny fairy with delicate wings that shimmered like morning dew in the moonlight.

"Hello," the fairy said in a voice that sounded like tiny bells. "My name is Whisper, and I've been sent to find someone with a pure heart and vivid imagination. I think you might be the one I'm looking for."

Alex could hardly believe what was happening. "Me? What do you need me for?"

Whisper explained that the magical realm was in trouble. The ancient Book of Dreams, which contained all the stories ever told and those yet to be imagined, had been stolen by the Shadow King. Without the book, children everywhere would stop dreaming, and the magical realm would fade away.

"Will you help us?" Whisper asked, her light dimming slightly with worry.

Without hesitation, Alex nodded. "I will."

Whisper sprinkled some fairy dust over Alex, and suddenly, they were both floating up into the night sky, past the clouds, and toward a shimmering portal that hadn't been there before. They traveled through the portal and arrived in the magical realm, a place where mountains floated in the sky, rivers flowed with liquid starlight, and trees whispered ancient secrets to those who knew how to listen.`,
  },
};

export const WithCustomClass: Story = {
  args: {
    text: 'This is a text with a custom class applied to the reading time component.',
    className: 'bg-blue-100 p-2 rounded-md',
  },
};
