'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { trackSectionVisibility } from '../utils/analytics';
import { measureRenderTime } from '../utils/performance';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Parent of two',
    content:
      "My kids absolutely love their personalized stories! It's amazing how each story perfectly captures their interests and personalities. The educational value is an added bonus.",
    avatar: '👩',
  },
  {
    name: 'Michael Chen',
    role: 'Elementary teacher',
    content:
      "As an educator, I'm impressed by how these stories adapt to different reading levels. They're engaging and help build confidence in young readers.",
    avatar: '👨',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Parent & educator',
    content:
      'The combination of personalization and educational content is perfect. My daughter looks forward to her new story every night!',
    avatar: '👩',
  },
];

export function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    const startTime = performance.now();
    return () => measureRenderTime('TestimonialSection', startTime);
  }, []);

  useEffect(() => {
    trackSectionVisibility('Testimonials', isIntersecting);
  }, [isIntersecting]);

  const nextTestimonial = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isIntersecting) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [isIntersecting, nextTestimonial]);

  return (
    <section ref={ref} className="py-20 bg-background/50 dark:bg-midnight/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What Parents Say
          </h2>
          <p className="mt-4 text-text-secondary dark:text-text-primary/80 md:text-xl">
            Hear from our community of happy parents and educators
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                  index === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="p-8 text-center">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <blockquote className="text-lg md:text-xl mb-4 text-text-secondary dark:text-text-primary/80">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-text-secondary dark:text-text-primary/60">
                    {testimonial.role}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex
                    ? 'bg-primary dark:bg-primary-light'
                    : 'bg-border dark:bg-border-dark'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
