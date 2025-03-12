'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { TypedText } from '@/components/TypedText';
import { SignInButton } from '@/components/auth/SignInButton';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

export default function HeroSection() {
  const { isLoaded, isSignedIn } = useAuth();
  const [childName, setChildName] = useState('Joey');
  const [showPreview, setShowPreview] = useState(false);

  // Sample story preview text that uses the child's name
  const getStoryPreview = (name: string) => {
    return `Once upon a time, in a magical forest filled with talking animals and whispering trees, there lived a brave child named ${name}. ${name} had always dreamed of adventure, and today was the day their wish would come true. As ${name} was exploring near the old oak tree, a tiny woodland fairy with shimmering wings appeared...`;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95 dark:from-midnight dark:to-midnight/95 overflow-hidden py-20">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            className="flex flex-col justify-center space-y-4 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-primary-light dark:to-secondary-light">
                Step Into Story Time, Instantly!
              </h1>
              <div className="max-w-[600px] text-text-secondary dark:text-text-primary/80 md:text-xl mx-auto lg:mx-0">
                {typeof window !== 'undefined' && (
                  <TypedText text="Personalized, AI-powered bedtime stories for your child—crafted in seconds." />
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {!isSignedIn ? (
                <SignInButton>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white dark:bg-primary-light dark:hover:bg-primary-light/90"
                  >
                    Start Your Story
                  </Button>
                </SignInButton>
              ) : (
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white dark:bg-primary-light dark:hover:bg-primary-light/90"
                >
                  Start Your Story
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 dark:border-primary-light dark:text-primary-light dark:hover:bg-primary-light/10"
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Story Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-midnight-light rounded-lg shadow-2xl overflow-hidden">
              {/* Browser-like header */}
              <div className="bg-gray-100 dark:bg-midnight-dark p-2 flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-600 dark:text-gray-300">
                  Joey's Magical Adventure
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="inline-block">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 mb-4 mx-auto"
                    >
                      <span className="text-4xl">📖</span>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">See a personalized story preview!</h3>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter your child's name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    onClick={() => setShowPreview(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white dark:bg-primary-light dark:hover:bg-primary-light/90"
                  >
                    Show Preview
                  </Button>
                </div>

                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gray-50 dark:bg-midnight rounded-lg"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {getStoryPreview(childName)}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="mt-12 grid grid-cols-3 gap-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center p-4 bg-white dark:bg-midnight-light rounded-lg shadow-md">
            <div className="text-2xl font-bold text-primary dark:text-primary-light">10,000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Stories Created</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-midnight-light rounded-lg shadow-md">
            <div className="text-2xl font-bold text-primary dark:text-primary-light">4.9/5</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Parent Rating</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-midnight-light rounded-lg shadow-md">
            <div className="text-2xl font-bold text-primary dark:text-primary-light">5,000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Happy Families</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
