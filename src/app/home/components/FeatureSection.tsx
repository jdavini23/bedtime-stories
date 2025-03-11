'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { trackSectionVisibility } from '../utils/analytics';
import { measureRenderTime } from '../utils/performance';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: 'Personalized Stories',
    description:
      "Every story is uniquely crafted based on your child's interests, personality, and reading level.",
    icon: '📚',
  },
  {
    title: 'AI-Powered Generation',
    description: 'Advanced AI technology creates engaging and educational stories in seconds.',
    icon: '🤖',
  },
  {
    title: 'Educational Value',
    description: 'Stories are designed to improve reading comprehension and vocabulary.',
    icon: '🎓',
  },
  {
    title: 'Multiple Themes',
    description: 'Choose from various themes like fantasy, adventure, science, and more.',
    icon: '🌈',
  },
];

export function FeatureSection() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    const startTime = performance.now();
    return () => measureRenderTime('FeatureSection', startTime);
  }, []);

  useEffect(() => {
    trackSectionVisibility('Features', isIntersecting);
  }, [isIntersecting]);

  return (
    <section ref={ref} className="py-20 bg-background/50 dark:bg-midnight/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Why Choose Our Stories?
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-primary/80 md:text-xl">
            Discover the magic of personalized storytelling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white/50 dark:bg-midnight-light/10 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-midnight-light/20 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-text-secondary dark:text-text-primary/80">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
