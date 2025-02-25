'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StoryFeatureGrid } from '@/components/StoryFeatureCard';
import { ChevronLeft, ChevronRight, Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Utility function to create typing animation elements
interface TypedTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const TypedText = ({ text, delay = 0, className = '', onComplete }: TypedTextProps) => {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup function to clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => {
    // Set visibility after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    timersRef.current.push(timer);

    return () => {
      clearTimeout(timer);
      clearAllTimers();
    };
  }, [delay]);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Split text into paragraphs first
    const paragraphs = text.split('\n\n');
    let paragraphIndex = 0;
    let wordIndex = 0;
    let charIndex = 0;
    let currentWords: string[] = [];
    let currentParagraphElement: HTMLElement | null = null;

    // Create a simple cursor element that will be moved around
    const createCursor = () => {
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '|';
      return cursor;
    };

    const typeNextParagraph = () => {
      if (paragraphIndex < paragraphs.length) {
        // Create a new paragraph element
        currentParagraphElement = document.createElement('div');
        currentParagraphElement.className = 'paragraph';
        currentParagraphElement.style.marginBottom = '1rem';
        container.appendChild(currentParagraphElement);

        // Add initial cursor to the paragraph
        currentParagraphElement.appendChild(createCursor());

        // Split paragraph into words
        currentWords = paragraphs[paragraphIndex].split(' ');
        wordIndex = 0;

        // Start typing the first word
        typeNextWord();
      } else {
        // All paragraphs complete
        if (onComplete) {
          const timer = setTimeout(onComplete, 500);
          timersRef.current.push(timer);
        }
      }
    };

    const typeNextWord = () => {
      if (wordIndex < currentWords.length && currentParagraphElement) {
        const word = currentWords[wordIndex];

        // Create word container
        const wordContainer = document.createElement('span');
        wordContainer.className = 'word-container';

        // Remove existing cursor
        const existingCursor = currentParagraphElement.querySelector('.typing-cursor');
        if (existingCursor) {
          existingCursor.remove();
        }

        // Add the word container
        currentParagraphElement.appendChild(wordContainer);

        // Type each character in the word
        charIndex = 0;

        const typeChar = () => {
          if (charIndex < word.length) {
            // Create character span
            const span = document.createElement('span');
            span.textContent = word[charIndex];
            wordContainer.appendChild(span);

            // Remove existing cursor
            const existingCursor = currentParagraphElement?.querySelector('.typing-cursor');
            if (existingCursor) {
              existingCursor.remove();
            }

            // Add cursor after this character
            wordContainer.appendChild(createCursor());

            charIndex++;

            // Continue typing after delay
            const timer = setTimeout(typeChar, 15 + Math.random() * 25);
            timersRef.current.push(timer);
          } else {
            // Word complete

            // Remove existing cursor
            const existingCursor = currentParagraphElement?.querySelector('.typing-cursor');
            if (existingCursor) {
              existingCursor.remove();
            }

            // Add space after word (except for last word)
            if (wordIndex < currentWords.length - 1) {
              const space = document.createElement('span');
              space.innerHTML = '&nbsp;';
              currentParagraphElement?.appendChild(space);
            }

            // Add cursor after space
            currentParagraphElement?.appendChild(createCursor());

            // Move to next word
            wordIndex++;

            // If not the last word, add a small delay before the next word
            if (wordIndex < currentWords.length) {
              const timer = setTimeout(typeNextWord, 30);
              timersRef.current.push(timer);
            } else {
              // Paragraph complete, move to next paragraph
              paragraphIndex++;

              // Add a longer delay between paragraphs
              const timer = setTimeout(typeNextParagraph, 500);
              timersRef.current.push(timer);
            }
          }
        };

        typeChar();
      }
    };

    // Start typing the first paragraph
    typeNextParagraph();

    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      clearAllTimers();
    };
  }, [isVisible, text, onComplete]);

  return <div ref={containerRef} className={`typing-animation ${className}`}></div>;
};

// FAQ Accordion Item Component
interface FaqAccordionItemProps {
  question: string;
  answer: string;
}

function FaqAccordionItem({ question, answer }: FaqAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-lavender/30 dark:border-lavender/10 rounded-lg overflow-hidden">
      <button
        className="w-full p-4 flex justify-between items-center bg-dreamy-light/50 dark:bg-midnight hover:bg-dreamy-light dark:hover:bg-midnight-light transition-colors text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-primary text-lg font-medium">{question}</h3>
        <div
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="p-4 bg-white/50 dark:bg-midnight-light/10">
          <p className="text-text-secondary dark:text-text-primary/80">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [childName, setChildName] = useState('Emma');
  const [showPreview, setShowPreview] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Used to force re-render of typing animations
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('fantasy'); // Default theme
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle scroll events for sticky header and progress bar
  useEffect(() => {
    // Avoid memory leaks by using a ref to track if component is mounted
    const isMounted = { current: true };

    const handleScroll = () => {
      if (!isMounted.current) return;

      // For sticky header
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      // For progress indicator
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollPosition / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      isMounted.current = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check system preference for dark mode on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);

      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

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

  // Auto-rotate story carousel with debounce
  useEffect(() => {
    if (isCarouselPaused) return;

    // Use a ref to track if component is mounted
    const isMounted = { current: true };

    const interval = setInterval(() => {
      if (isMounted.current) {
        setActiveStoryIndex((prev) => (prev === sampleStories.length - 1 ? 0 : prev + 1));
        // Only update refreshKey when necessary
        setRefreshKey((prev) => prev + 1);
      }
    }, 8000); // Change story every 8 seconds

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
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

  // Function to navigate to the next story with circular navigation
  const goToNextStory = useCallback(() => {
    setActiveStoryIndex((prev) => (prev === sampleStories.length - 1 ? 0 : prev + 1));
    setRefreshKey((prev) => prev + 1); // Force re-render of typing animations
  }, [sampleStories.length]);

  // Function to navigate to the previous story with circular navigation
  const goToPrevStory = useCallback(() => {
    setActiveStoryIndex((prev) => (prev === 0 ? sampleStories.length - 1 : prev - 1));
    setRefreshKey((prev) => prev + 1); // Force re-render of typing animations
  }, [sampleStories.length]);

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

  // Toggle carousel pause state
  const toggleCarouselPause = useCallback(() => {
    setIsCarouselPaused((prev) => !prev);
  }, []);

  // Handle carousel dot navigation
  const goToStory = useCallback((index: number) => {
    setActiveStoryIndex(index);
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Handle carousel mouse events
  const handleCarouselMouseEnter = useCallback(() => {
    setIsCarouselPaused(true);
  }, []);

  const handleCarouselMouseLeave = useCallback(() => {
    setIsCarouselPaused(false);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-cloud to-sky-50 dark:from-midnight dark:to-teal-900">
      {/* Sticky Navigation */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-midnight/90 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/illustrations/book-magic.svg"
                  alt="Step Into Story Time"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span
                  className={`font-bold text-lg ${isScrolled ? 'text-primary' : 'text-midnight dark:text-text-primary'}`}
                >
                  Step Into Story Time
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="#how-it-works"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isScrolled ? 'text-text-secondary hover:text-primary dark:text-text-primary/70 dark:hover:text-primary' : 'text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary'}`}
              >
                How It Works
              </a>
              <a
                href="#features"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isScrolled ? 'text-text-secondary hover:text-primary dark:text-text-primary/70 dark:hover:text-primary' : 'text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary'}`}
              >
                Features
              </a>
              <a
                href="#pricing"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isScrolled ? 'text-text-secondary hover:text-primary dark:text-text-primary/70 dark:hover:text-primary' : 'text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary'}`}
              >
                Pricing
              </a>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-lavender/10 dark:bg-lavender/20 text-text-secondary dark:text-text-primary"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link href="/story">
                <Button size="sm" className="ml-4">
                  Start Your Story
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-lavender/10 dark:bg-lavender/20 text-text-secondary dark:text-text-primary mr-2"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md ${isScrolled ? 'text-primary' : 'text-midnight dark:text-text-primary'}`}
                aria-label="Open main menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full bg-lavender/10 dark:bg-lavender/20">
            <div
              className="h-1 bg-gradient-to-r from-primary to-golden transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="fixed inset-0 bg-black/25 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-midnight p-6 shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-primary">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-text-secondary"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
                <a
                  href="#how-it-works"
                  className="px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="px-3 py-2 rounded-md text-base font-medium text-text-secondary dark:text-text-primary/70 hover:text-primary dark:hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <Link href="/story" className="mt-4" onClick={() => setMobileMenuOpen(false)}>
                  <Button fullWidth>Start Your Story</Button>
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <section className="relative py-20 px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-dreamy animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-golden animate-float delay-150"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-primary animate-float delay-300"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 rounded-full bg-sky animate-float delay-200"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-midnight dark:text-text-primary leading-tight">
              Step Into Story Time, <span className="text-primary">Instantly!</span>
            </h1>
            <p className="text-xl text-text-secondary dark:text-text-primary/80">
              Personalized, AI-powered bedtime stories for your child—crafted in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/story">
                <Button size="lg" className="animate-float delay-300 w-full sm:w-auto">
                  Start Your Story
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See How It Works
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="relative w-full h-[300px] md:h-[400px]">
              {/* Interactive Story Preview */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-golden/20 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex flex-col">
                  {/* Preview Header */}
                  <div className="bg-primary/30 dark:bg-primary/50 p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-golden"></div>
                      <div className="w-3 h-3 rounded-full bg-dreamy"></div>
                      <div className="w-3 h-3 rounded-full bg-teal"></div>
                    </div>
                    <span className="text-sm font-medium">{childName}'s Woodland Adventure</span>
                    <div className="flex items-center gap-1">
                      <span className="twinkling-star text-sm">✨</span>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="flex-1 bg-white/90 dark:bg-midnight-light/90 p-4 overflow-hidden relative">
                    {showPreview ? (
                      <div className="h-full overflow-y-auto story-text pr-2">
                        <TypedText
                          key={`story-preview-${refreshKey}`}
                          text={getStoryPreview(childName).join('\n\n')}
                          className="whitespace-pre-line"
                          onComplete={() => {
                            /* Story preview complete */
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                        <Image
                          src="/images/illustrations/book-magic.svg"
                          alt="Magical storybook"
                          width={100}
                          height={100}
                          className="object-contain"
                        />
                        <p className="text-text-secondary dark:text-text-primary/80">
                          See a personalized story preview!
                        </p>
                      </div>
                    )}

                    {/* Personalization Input */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/80 dark:bg-midnight/80 backdrop-blur-sm border-t border-lavender/20">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Child's name"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          className="text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            setShowPreview(true);
                            setRefreshKey((prev) => prev + 1); // Force re-render of typing animations
                          }}
                          className="whitespace-nowrap"
                        >
                          {showPreview ? 'Refresh Preview' : 'Show Preview'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-4 bg-white/80 dark:bg-midnight/80 backdrop-blur-sm rounded-lg p-3 flex justify-around items-center shadow-dreamy">
              <div className="text-center">
                <p className="font-bold text-primary text-xl">10,000+</p>
                <p className="text-xs text-text-secondary dark:text-text-primary/70">
                  Stories Created
                </p>
              </div>
              <div className="h-10 border-r border-lavender/30"></div>
              <div className="text-center">
                <p className="font-bold text-primary text-xl">4.9/5</p>
                <p className="text-xs text-text-secondary dark:text-text-primary/70">
                  Parent Rating
                </p>
              </div>
              <div className="h-10 border-r border-lavender/30"></div>
              <div className="text-center">
                <p className="font-bold text-primary text-xl">5,000+</p>
                <p className="text-xs text-text-secondary dark:text-text-primary/70">
                  Happy Families
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-8 bg-white dark:bg-midnight-dark relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-golden"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-primary text-center mb-4">The Magic Behind Your Stories</h2>
            <p className="text-lg text-text-secondary dark:text-text-primary/80 max-w-2xl mx-auto">
              Creating personalized stories for your child is simple and magical. Just follow these
              three easy steps to bring imagination to life.
            </p>
          </div>

          <div className="relative">
            {/* Connection line between steps */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-lavender via-primary to-golden transform -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-lavender to-primary rounded-full flex items-center justify-center mb-6 shadow-dreamy">
                  <span className="text-2xl text-white font-bold">1</span>
                </div>
                <Card
                  hover
                  className="w-full space-y-4 text-center p-6 bg-sky-50 dark:bg-midnight border-t-4 border-lavender"
                >
                  <h3 className="text-primary">Choose Your Adventure</h3>
                  <p className="text-text-secondary dark:text-text-primary/80">
                    Select from magical worlds like enchanted forests, space odysseys, or underwater
                    kingdoms.
                  </p>
                  <div className="flex gap-2 flex-wrap mt-4 justify-center">
                    <Button
                      variant={selectedTheme === 'space' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTheme('space')}
                      className={selectedTheme === 'space' ? 'bg-primary' : ''}
                    >
                      <Image
                        src="/images/illustrations/space-rocket.svg"
                        alt="Space"
                        width={20}
                        height={20}
                        className="mr-1"
                      />
                      Space
                    </Button>
                    <Button
                      variant={selectedTheme === 'fantasy' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTheme('fantasy')}
                      className={selectedTheme === 'fantasy' ? 'bg-primary' : ''}
                    >
                      <Image
                        src="/images/illustrations/fairy.svg"
                        alt="Fantasy"
                        width={20}
                        height={20}
                        className="mr-1"
                      />
                      Fantasy
                    </Button>
                    <Button
                      variant={selectedTheme === 'pirates' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTheme('pirates')}
                      className={selectedTheme === 'pirates' ? 'bg-primary' : ''}
                    >
                      <Image
                        src="/images/illustrations/pirate.svg"
                        alt="Pirates"
                        width={20}
                        height={20}
                        className="mr-1"
                      />
                      Pirates
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center md:mt-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-dreamy rounded-full flex items-center justify-center mb-6 shadow-dreamy">
                  <span className="text-2xl text-white font-bold">2</span>
                </div>
                <Card
                  hover
                  className="w-full space-y-4 text-center p-6 bg-sky-50 dark:bg-midnight border-t-4 border-dreamy"
                >
                  <h3 className="text-primary">Create Your Hero</h3>
                  <p className="text-text-secondary dark:text-text-primary/80">
                    Personalize with your child's name, age, and favorite things to make them the
                    star.
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                    <Input
                      placeholder="Child's name"
                      className="text-center"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                    />
                    <div className="flex gap-2 justify-center mt-2">
                      <Button variant="outline" size="sm">
                        <Image
                          src="/images/illustrations/superhero.svg"
                          alt="Brave"
                          width={20}
                          height={20}
                          className="mr-1"
                        />
                        Brave
                      </Button>
                      <Button variant="outline" size="sm">
                        <Image
                          src="/images/illustrations/brain.svg"
                          alt="Clever"
                          width={20}
                          height={20}
                          className="mr-1"
                        />
                        Clever
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-dreamy to-golden rounded-full flex items-center justify-center mb-6 shadow-dreamy">
                  <span className="text-2xl text-white font-bold">3</span>
                </div>
                <Card
                  hover
                  className="w-full space-y-4 text-center p-6 bg-sky-50 dark:bg-midnight border-t-4 border-golden"
                >
                  <h3 className="text-primary">Watch the Magic Happen</h3>
                  <p className="text-text-secondary dark:text-text-primary/80">
                    Our AI crafts a unique tale in seconds. Save, print, or read it together at
                    bedtime.
                  </p>
                  <div className="relative h-48 mt-4 overflow-hidden rounded-lg bg-white/50 dark:bg-midnight-light/50 shadow-sm">
                    {/* Story Generation Process - Interactive Preview */}
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center px-4 w-full">
                        {/* Theme-specific icon */}
                        <Image
                          src={
                            selectedTheme === 'space'
                              ? '/images/illustrations/space-rocket.svg'
                              : selectedTheme === 'pirates'
                                ? '/images/illustrations/pirate.svg'
                                : '/images/illustrations/fairy.svg'
                          }
                          alt="Story theme"
                          width={60}
                          height={60}
                          className="object-contain mx-auto mb-3"
                        />
                        <h4 className="text-primary font-medium text-sm mb-2">
                          {childName}'s{' '}
                          {selectedTheme === 'space'
                            ? 'Space Adventure'
                            : selectedTheme === 'pirates'
                              ? 'Pirate Quest'
                              : 'Magical Journey'}
                        </h4>

                        <div className="h-20 overflow-y-auto text-xs text-text-secondary dark:text-text-primary/70 max-w-xs mx-auto text-left story-text">
                          <TypedText
                            key={`theme-preview-${selectedTheme}-${childName}-${refreshKey}`}
                            text={getActiveStoryPreview(childName)}
                            className="whitespace-pre-line"
                            delay={300}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-text-secondary dark:text-text-primary/80 mb-6 italic">
              "From theme selection to story creation in less than a minute!"
            </p>
            <Link href="/story">
              <Button size="lg" className="px-8">
                Create Your First Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Parents Love It */}
      <section className="py-16 px-8 bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900 dark:to-sky-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-primary text-center mb-12">Why Parents Love It</h2>

          <StoryFeatureGrid />

          {/* Testimonial */}
          <Card
            variant="magical"
            className="mt-12 p-8 text-center bg-white/80 dark:bg-midnight/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-lavender rounded-full mb-4"></div>
              <p className="text-lg italic mb-4">
                "My daughter asks for a new story every night! It's become our special bedtime
                ritual, and I love how each story incorporates her interests."
              </p>
              <p className="font-bold">Sarah T., Parent of 6-year-old</p>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-golden text-xl">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Story Previews */}
      <section className="py-16 px-8 bg-gradient-to-r from-teal-50 to-sky-50 dark:from-teal-900 dark:to-sky-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-primary text-center mb-12">Story Previews</h2>

          <div
            ref={carouselRef}
            className="relative"
            onMouseEnter={handleCarouselMouseEnter}
            onMouseLeave={handleCarouselMouseLeave}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeStoryIndex * 100}%)` }}
              >
                {sampleStories.map((story, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card
                      variant="outline"
                      className="p-8 space-y-6 bg-gradient-to-br from-cloud to-dreamy-light dark:from-midnight dark:to-teal-900"
                    >
                      <div className="relative w-full h-48 bg-lavender/20 rounded-lg mb-4 overflow-hidden">
                        {/* Use actual image with fallback to SVG illustration */}
                        {story.image ? (
                          <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            className="object-cover"
                            loading="eager"
                            unoptimized
                            priority={index === activeStoryIndex}
                            onError={(e) => {
                              // If image fails to load, show the SVG illustration
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/illustrations/storybook.svg';
                              target.className = 'object-contain p-8';
                              target.style.width = '100%';
                              target.style.height = '100%';
                              target.style.position = 'relative';
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                              src="/images/illustrations/storybook.svg"
                              alt="Storybook"
                              width={100}
                              height={100}
                              className="object-contain"
                              loading="eager"
                              unoptimized
                              priority={index === activeStoryIndex}
                            />
                          </div>
                        )}
                      </div>
                      <h3 className="text-primary text-center">{story.title}</h3>
                      <div className="story-text">
                        <TypedText
                          text={story.excerpt}
                          delay={index === activeStoryIndex ? 300 : 9999} // Only animate the active story
                          key={`story-${activeStoryIndex}-${index}-${refreshKey}`} // Force re-render when active story changes
                          onComplete={() => {
                            /* Animation complete */
                          }}
                          className="whitespace-pre-line"
                        />
                      </div>
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            // Show a modal with a longer preview (to be implemented)
                            alert(`Read more of "${story.title}" coming soon!`);
                          }}
                        >
                          Read More
                        </Button>
                        <Link href="/story">
                          <Button>Create Your Own</Button>
                        </Link>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel controls */}
            <div className="flex justify-center mt-6 items-center gap-4">
              <button
                onClick={toggleCarouselPause}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label={isCarouselPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
              >
                {isCarouselPaused ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                )}
              </button>

              <div className="flex gap-2">
                {sampleStories.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeStoryIndex ? 'bg-primary scale-125' : 'bg-lavender'}`}
                    onClick={() => goToStory(index)}
                    aria-label={`Go to story ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <motion.button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 dark:bg-midnight/80 rounded-full p-3 shadow-dreamy backdrop-blur-sm hover:bg-white dark:hover:bg-midnight transition-all duration-300"
              onClick={goToPrevStory}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous story"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </motion.button>

            <motion.button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 dark:bg-midnight/80 rounded-full p-3 shadow-dreamy backdrop-blur-sm hover:bg-white dark:hover:bg-midnight transition-all duration-300"
              onClick={goToNextStory}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next story"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-cloud to-sky-50 dark:from-midnight dark:to-teal-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-16 h-16 rounded-full bg-teal animate-float"></div>
          <div className="absolute top-40 right-1/3 w-12 h-12 rounded-full bg-golden animate-float delay-150"></div>
          <div className="absolute bottom-20 left-1/5 w-20 h-20 rounded-full bg-dreamy animate-float delay-300"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-primary text-center mb-4">Start Your Story Journey</h2>
            <p className="text-center text-lg mb-6 max-w-2xl mx-auto">
              Begin creating magical stories for your little ones today. No credit card needed to
              get started!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-golden mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Free Plan Card */}
            <Card
              variant="outline"
              hover={true}
              className="p-8 space-y-6 bg-white/90 dark:bg-midnight/90 backdrop-blur-sm border-2 border-lavender/30 relative overflow-hidden"
            >
              {/* Decorative corner */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-lavender/20 rounded-full"></div>

              <div className="relative">
                <h3 className="text-primary text-center mb-2">Free Plan</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-text-secondary dark:text-text-primary/80 ml-1">/month</span>
                </div>

                <div className="bg-lavender/10 dark:bg-lavender/20 rounded-xl p-5 mb-6">
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal-500">✓</span>
                      </span>
                      <span>3 stories per month</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal-500">✓</span>
                      </span>
                      <span>5 basic themes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal-500">✓</span>
                      </span>
                      <span>Basic customization</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal-500">✓</span>
                      </span>
                      <span>PDF downloads</span>
                    </li>
                  </ul>
                </div>

                <Link href="/story">
                  <Button variant="outline" fullWidth className="group relative overflow-hidden">
                    <span className="relative z-10">Start for Free</span>
                    <span className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 opacity-20"></span>
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Premium Plan Card */}
            <Card
              variant="magical"
              hover={true}
              className="p-8 pt-14 space-y-6 relative overflow-hidden bg-gradient-to-br from-white to-dreamy-light dark:from-midnight dark:to-teal-800 border-2 border-golden/30 shadow-glow"
            >
              {/* Popular badge - woodland themed with leaf */}
              <div className="absolute top-0 left-0 right-0 bg-teal-500/90 text-text-primary font-medium py-2 px-4 text-center shadow-md">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.5 12.5C8.5 10.5 12 10 15.5 12.5C19 15 20.5 19 20.5 19C20.5 19 18.5 18.5 16.5 18.5C14.5 18.5 12 19 9.5 21.5C7 24 4 24 4 24C4 24 4 21.5 6 18.5C8 15.5 9.5 14 9.5 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 12.5C11 12.5 13.5 11 15 8.5C16.5 6 16 3 16 3C16 3 13 3.5 11.5 5.5C10 7.5 9 10 9 12.5C9 15 11 17.5 11 17.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Popular Choice</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-golden/20 rounded-full"></div>

              <div className="relative">
                <h3 className="text-primary text-center mb-2">Premium Plan</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">$4.99</span>
                  <span className="text-text-secondary dark:text-text-primary/80 ml-1">/month</span>
                </div>

                <div className="bg-golden/10 dark:bg-golden/20 rounded-xl p-5 mb-6">
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal-500">✓</span>
                      </span>
                      <span>Unlimited stories</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal-500">✓</span>
                      </span>
                      <span>20+ premium themes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal-500">✓</span>
                      </span>
                      <span>Advanced customization</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal-500">✓</span>
                      </span>
                      <span>PDF downloads with illustrations</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center">
                        <span className="text-teal-500">✓</span>
                      </span>
                      <span>Save & edit stories</span>
                    </li>
                  </ul>
                </div>

                <Link href="/story?plan=premium">
                  <Button fullWidth className="group relative overflow-hidden">
                    <span className="relative z-10">Get Premium</span>
                    <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 opacity-20"></span>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Additional info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-text-secondary dark:text-text-primary/60 italic">
              All plans include a 7-day satisfaction guarantee. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8 bg-white dark:bg-midnight-dark">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-primary text-center mb-6">Frequently Asked Questions</h2>
          <p className="text-center text-text-secondary dark:text-text-primary/80 mb-12 max-w-xl mx-auto">
            Find answers to common questions about our service, pricing, and features.
          </p>

          {/* FAQ Search */}
          <div className="mb-8 relative">
            <Input
              placeholder="Search FAQs..."
              className="pl-10"
              onChange={(e) => {
                // This would be implemented with actual filtering logic
                // console.log('Searching for:', e.target.value);
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="flex justify-center mb-8 gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="rounded-full">
              All
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Pricing
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Features
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Technical
            </Button>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqAccordionItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <p className="text-text-secondary dark:text-text-primary/80 mb-4">
              Still have questions? We're here to help!
            </p>
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-primary-dark text-text-primary">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl mb-4">Step Into Story Time</h3>
              <p className="text-text-primary/70">
                Creating magical moments for families, one story at a time.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  <Image
                    src="/images/illustrations/twitter.svg"
                    alt="Twitter"
                    width={24}
                    height={24}
                    className="text-current"
                  />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <Image
                    src="/images/illustrations/instagram.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                    className="text-current"
                  />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <Image
                    src="/images/illustrations/facebook.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                    className="text-current"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-text-primary/20 pt-6 text-center">
            <p>
              Made with{' '}
              <Image
                src="/images/illustrations/heart.svg"
                alt="love"
                width={16}
                height={16}
                className="inline"
                unoptimized
              />{' '}
              for parents and kids. © {new Date().getFullYear()} Step Into Story Time
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
