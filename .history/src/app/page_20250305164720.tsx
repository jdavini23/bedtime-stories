'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { NavBar } from '@/components/home/NavBar';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhyParentsLoveIt } from '@/components/home/WhyParentsLoveIt';
import { FAQ } from '@/components/home/FAQ';

// Dynamically import footer for better initial load performance
const Footer = dynamic(() => import('../components/Footer'), {
  loading: () => (
    <div className="h-40 bg-lavender/10 dark:bg-midnight/30 animate-pulse rounded-t-lg"></div>
  ),
  ssr: false,
});

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll events for sticky header and progress bar
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-cloud to-sky-50 dark:from-midnight dark:to-teal-900">
      <NavBar isScrolled={isScrolled} scrollProgress={scrollProgress} />
      <Hero />
      <HowItWorks />
      <WhyParentsLoveIt />
      <FAQ />
      <Footer />
    </main>
  );
}
