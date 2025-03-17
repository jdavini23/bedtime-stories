import React from 'react';
import { MagicalPortal } from '@/components/ui/magical-portal';

export default function ImageGenerator() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">Hero Section Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Storybook Portal</h3>
              <MagicalPortal
                title="Step Into Storytime"
                className="aspect-[16/9] max-w-none w-full"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Story Preview Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Space Adventure</h3>
              <MagicalPortal
                title="Space Explorer's Journey"
                className="aspect-[4/3] max-w-none w-full"
                imageUrl="/images/space-bg.jpg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enchanted Forest</h3>
              <MagicalPortal
                title="Magical Forest"
                className="aspect-[4/3] max-w-none w-full"
                imageUrl="/images/forest-bg.jpg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Underwater Kingdom</h3>
              <MagicalPortal
                title="Ocean Adventures"
                className="aspect-[4/3] max-w-none w-full"
                imageUrl="/images/ocean-bg.jpg"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">How It Works Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Theme Selection</h3>
              <MagicalPortal
                title="Choose Your Theme"
                className="aspect-square max-w-none w-full"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Character Customization</h3>
              <MagicalPortal title="Create Your Hero" className="aspect-square max-w-none w-full" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Story Generation</h3>
              <MagicalPortal title="Watch the Magic" className="aspect-square max-w-none w-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
