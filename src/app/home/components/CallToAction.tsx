'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@/components/auth/SignInButton';
import { useSupabase } from '@/providers/SupabaseAuthProvider';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { trackSectionVisibility, trackInteraction } from '../utils/analytics';
import { measureRenderTime } from '../utils/performance';
export function CallToAction() {
  const { supabase } = useSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsSignedIn(!!session?.user);
    };
    getSession();
  }, [supabase.auth]);

  useEffect(() => {
    const startTime = performance.now();
    return () => measureRenderTime('CallToAction', startTime);
  }, []);

  useEffect(() => {
    trackSectionVisibility('CallToAction', isIntersecting);
  }, [isIntersecting]);

  const handleGetStartedClick = () => {
    trackInteraction('CTAButton', 'click');
  };

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-b from-background to-background/95 dark:from-midnight dark:to-midnight/95"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Create Magical Stories?
          </h2>
          <p className="text-text-secondary dark:text-text-primary/80 md:text-xl max-w-[600px]">
            Join thousands of parents who are making bedtime stories more magical and educational
            for their children.
          </p>

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

          <p className="text-sm text-text-secondary dark:text-text-primary/60">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
