'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TypedText } from '@/components/TypedText';
import { SignInButton } from '@/components/auth/SignInButton';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { useAnimations } from '../hooks/useAnimations';
import { trackInteraction } from '../utils/analytics';
import { measureRenderTime } from '../utils/performance';
import { useEffect } from 'react';

export function HeroSection() {
  const { user } = useSupabase();
  const isSignedIn = !!user;
  const { fadeInVariant, slideInLeftVariant } = useAnimations();

  useEffect(() => {
    const startTime = performance.now();
    return () => measureRenderTime('HeroSection', startTime);
  }, []);

  const handleGetStartedClick = () => {
    trackInteraction('GetStartedButton', 'click');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95 dark:from-midnight dark:to-midnight/95 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <motion.div
            className="flex flex-col justify-center space-y-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            variants={fadeInVariant}
          >
            <motion.div
              className="space-y-2"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-primary-light dark:to-secondary-light">
                Personalized Bedtime Stories
              </h1>
              <p className="max-w-[600px] text-text-secondary dark:text-text-primary/80 md:text-xl mx-auto">
                <TypedText text="Create magical bedtime stories tailored to your child's interests, personality, and reading level." />
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 min-[320px]:flex-col md:flex-row"
              variants={slideInLeftVariant}
            >
              {!isSignedIn ? (
                <SignInButton>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white dark:bg-primary-light dark:hover:bg-primary-light/90"
                    onClick={handleGetStartedClick}
                  >
                    Get Started Now
                  </Button>
                </SignInButton>
              ) : (
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white dark:bg-primary-light dark:hover:bg-primary-light/90"
                  onClick={handleGetStartedClick}
                >
                  Create a Story
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
