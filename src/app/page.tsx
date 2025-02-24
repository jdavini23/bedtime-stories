'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cloud to-lavender/20 dark:from-midnight dark:to-primary/20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-midnight dark:text-text-primary">
            <span className="inline-block animate-float">✨</span> Bedtime Story Magic{' '}
            <span className="inline-block animate-float delay-150">🌙</span>
          </h1>
          <p className="text-lg text-text-secondary dark:text-text-primary/80">
            Where imagination meets AI to create enchanting, personalized stories
          </p>
          <Link href="/story">
            <Button size="lg" className="animate-float delay-300">
              Create Your Story
            </Button>
          </Link>
        </section>

        {/* Feature Cards */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card hover className="space-y-4">
            <h3 className="text-primary">Personalized Stories</h3>
            <p className="text-text-secondary dark:text-text-primary/80">
              Tailored to your child's interests and reading level
            </p>
            <Input 
              placeholder="Child's name"
              className="mt-4"
            />
            <Link href="/story">
              <Button variant="secondary" fullWidth className="mt-2">
                Get Started
              </Button>
            </Link>
          </Card>

          <Card 
            variant="magical" 
            hover 
            className="space-y-4"
          >
            <h3 className="text-primary">Magical Themes</h3>
            <p className="text-text-secondary dark:text-text-primary/80">
              Choose from a variety of enchanting story themes
            </p>
            <div className="flex gap-2 flex-wrap mt-4">
              <Button variant="outline" size="sm">🚀 Space</Button>
              <Button variant="outline" size="sm">🧚‍♀️ Fantasy</Button>
              <Button variant="outline" size="sm">🌊 Ocean</Button>
              <Button variant="outline" size="sm">🌳 Nature</Button>
            </div>
          </Card>
        </section>

        {/* Story Preview */}
        <Card 
          variant="outline" 
          className="p-8 space-y-6"
        >
          <h2 className="text-primary text-center">Preview Your Story</h2>
          <div className="story-text">
            <p>
              Once upon a time, in a magical kingdom far away, there lived a brave young soul
              who dreamed of incredible adventures...
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="ghost">
              <span className="twinkling-star mr-2">✨</span> Regenerate
            </Button>
            <Link href="/story">
              <Button>
                Continue Reading
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
