'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TypedText } from '@/components/TypedText';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { StoryCarousel } from '@/components/home/StoryCarousel';
import { ValueProposition } from '@/components/home/ValueProposition';
import { SubscriptionPlans } from '@/components/home/SubscriptionPlans';
import FaqAccordionItem from '@/components/FaqAccordionItem';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggleWrapper from '@/components/ThemeToggleWrapper';

// Custom hook for Intersection Observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isIntersecting };
}

export default function Home() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [childName, setChildName] = useState('Joey');
  const [showPreview, setShowPreview] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCarouselPaused] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('fantasy');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Sample stories for the carousel
  const sampleStories = useMemo(
    () => [
      {
        title: "Ava's Adventure in Dreamland",
        excerpt:
          'Once upon a time, in a magical dreamland filled with cotton candy clouds and rainbow rivers, there lived a brave girl named Ava...',
        image: '/images/illustrations/book-magic.svg',
      },
      {
        title: 'Leo and the Space Dragons',
        excerpt:
          'Far beyond the stars, in a galaxy of wonders, a curious boy named Leo discovered a mysterious map that led to the legendary Space Dragons...',
        image: '/images/illustrations/space-rocket.svg',
      },
      {
        title: "Maya's Underwater Kingdom",
        excerpt:
          'Deep beneath the ocean waves, where sunlight danced on coral reefs, Maya discovered a hidden entrance to an underwater kingdom...',
        image: '/images/illustrations/storybook.svg',
      },
    ],
    []
  );

  // Handle scroll events
  useEffect(() => {
    const isMounted = { current: true };

    const handleScroll = () => {
      if (!isMounted.current) return;

      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollPosition / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      isMounted.current = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-rotate carousel unless paused
  useEffect(() => {
    if (!isCarouselPaused && carouselRef.current) {
      const interval = setInterval(() => {
        setActiveStoryIndex((prevIndex) => (prevIndex + 1) % sampleStories.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isCarouselPaused, sampleStories.length]);

  const faqs = useMemo(
    () => [
      {
        question: 'How much does it cost?',
        answer:
          'We offer a free tier with 3 stories per month. Our premium plan at $4.99/month gives you unlimited stories, more themes, and the ability to save and print your creations.',
      },
      {
        question: 'Can I edit my stories?',
        answer:
          'Yes! All stories can be edited after generation. Premium users get access to advanced editing features including custom illustrations.',
      },
      {
        question: 'What age group is this for?',
        answer:
          "Our stories are designed for children ages 2-10. You can select the appropriate reading level during story creation to match your child's abilities.",
      },
      {
        question: 'Can I print the stories?',
        answer:
          'Absolutely! All stories can be downloaded as PDFs for easy printing. Premium users get access to special formatting options and illustration quality.',
      },
    ],
    []
  );

  // Sample story preview text that uses the child's name
  const getStoryPreview = (name: string) => {
    return [
      `Once upon a time, in a magical forest filled with talking animals and whispering trees, there lived a brave child named ${name}.`,
      `${name} had always dreamed of adventure, and today was the day their wish would come true.`,
      `As ${name} was exploring near the old oak tree, a tiny woodland fairy with shimmering wings appeared...`,
    ];
  };

  // Theme-specific story previews
  const getThemePreview = (theme: string, name: string) => {
    switch (theme) {
      case 'space':
        return [
          `Far beyond the stars, in a galaxy of wonders, a brave space explorer named ${name} piloted their shimmering starship.`,
          `${name} had always dreamed of discovering new planets, and today was the day their wish would come true.`,
          `As ${name} approached the mysterious nebula, the ship's sensors detected something extraordinary...`,
        ];
      case 'pirates':
        return [
          `Across the seven seas, aboard the mighty ship "The Golden Adventure," sailed the courageous Captain ${name}.`,
          `${name} had always dreamed of finding hidden treasure, and today was the day their map would lead to fortune.`,
          `As ${name} followed the ancient map to the mysterious island, strange birds with colorful feathers guided the way...`,
        ];
      case 'fantasy':
      default:
        return [
          `Once upon a time, in a magical kingdom filled with enchanted creatures and whispering trees, there lived a brave hero named ${name}.`,
          `${name} had always dreamed of magical adventures, and today was the day their wish would come true.`,
          `As ${name} was exploring near the ancient castle, a tiny dragon with shimmering scales appeared...`,
        ];
    }
  };

  // Get the appropriate story preview based on the selected theme
  const getActiveStoryPreview = (name: string) => {
    return getThemePreview(selectedTheme, name).join('\n\n');
  };

  // Memoize the carousel items to prevent unnecessary re-renders
  const carouselItems = useMemo(() => {
    return sampleStories.map((story, index) => (
      <div
        key={index}
        className={`carousel-item absolute inset-0 transition-opacity duration-500 ${
          index === activeStoryIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        <Card className="h-full overflow-hidden shadow-dreamy border-none">
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-primary mb-2">{story.title}</h3>
            <p className="text-text-secondary dark:text-text-primary/80 flex-1">{story.excerpt}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-lavender">Fantasy</span>
              <span className="text-sm text-golden">5-8 years</span>
            </div>
          </div>
        </Card>
      </div>
    ));
  }, [sampleStories, activeStoryIndex]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-cloud to-sky-50 dark:from-midnight dark:to-teal-900">
      <Navigation
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollProgress={scrollProgress}
      />
      {/* Quick Action Buttons (Floating) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/story">
            <Button size="icon" className="rounded-full w-12 h-12 shadow-dreamy">
              <span className="sr-only">Start Your Story</span>
              <Image
                src="/images/illustrations/book-magic.svg"
                alt="Create Story"
                width={24}
                height={24}
              />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <Hero initialChildName={childName} />

      {/* Value Proposition */}
      <ValueProposition />

      {/* How It Works */}
      <HowItWorks initialChildName="Joey" />

      {/* Story Carousel */}
      <StoryCarousel stories={sampleStories} />

      {/* Subscription Plans */}
      <SubscriptionPlans />

      {/* Footer */}
      <Suspense
        fallback={
          <div className="h-40 bg-lavender/10 dark:bg-midnight/30 animate-pulse rounded-t-lg"></div>
        }
      >
        <Footer />
      </Suspense>
    </main>
  );
}
