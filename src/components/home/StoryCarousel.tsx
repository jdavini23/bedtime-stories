import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  title: string;
  excerpt: string;
  image: string;
}

interface StoryCarouselProps {
  stories: Story[];
}

export function StoryCarousel({ stories }: StoryCarouselProps) {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-rotate carousel unless paused
  useEffect(() => {
    if (!isCarouselPaused && carouselRef.current) {
      const interval = setInterval(() => {
        setActiveStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isCarouselPaused, stories.length]);

  // Function to navigate to the next story with circular navigation
  const goToNextStory = useCallback(() => {
    setActiveStoryIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
    setRefreshKey((prev) => prev + 1); // Force re-render of typing animations
  }, [stories.length]);

  // Function to navigate to the previous story with circular navigation
  const goToPrevStory = useCallback(() => {
    setActiveStoryIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
    setRefreshKey((prev) => prev + 1); // Force re-render of typing animations
  }, [stories.length]);

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
    <div
      ref={carouselRef}
      className="relative overflow-hidden rounded-xl shadow-xl h-[400px] md:h-[500px] bg-dreamy-light dark:bg-midnight-light"
      onMouseEnter={handleCarouselMouseEnter}
      onMouseLeave={handleCarouselMouseLeave}
    >
      {/* Carousel items */}
      {stories.map((story, index) => (
        <div
          key={index}
          className={`carousel-item absolute inset-0 transition-opacity duration-500 ${
            index === activeStoryIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">{story.title}</h3>
              <p className="text-text-secondary dark:text-text-primary/80 mb-6">{story.excerpt}</p>
            </div>
            <div className="md:w-1/2 relative flex items-center justify-center p-4">
              <Image
                src={story.image}
                alt={story.title}
                width={400}
                height={400}
                className="object-contain max-h-[300px] md:max-h-[400px] transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={goToPrevStory}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-midnight/80 rounded-full p-2 shadow-md z-20 hover:bg-white dark:hover:bg-midnight-light transition-colors"
        aria-label="Previous story"
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </button>
      <button
        onClick={goToNextStory}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-midnight/80 rounded-full p-2 shadow-md z-20 hover:bg-white dark:hover:bg-midnight-light transition-colors"
        aria-label="Next story"
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStory(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeStoryIndex
                ? 'bg-primary'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary/50 dark:hover:bg-primary/50'
            }`}
            aria-label={`Go to story ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause/Play button */}
      <button
        onClick={toggleCarouselPause}
        className="absolute bottom-4 right-4 bg-white/80 dark:bg-midnight/80 rounded-full p-2 shadow-md z-20 hover:bg-white dark:hover:bg-midnight-light transition-colors"
        aria-label={isCarouselPaused ? 'Play carousel' : 'Pause carousel'}
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
            className="text-primary"
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
            className="text-primary"
          >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        )}
      </button>
    </div>
  );
}

export default StoryCarousel;
