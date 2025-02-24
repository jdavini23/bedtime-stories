'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  
  const sampleStories = [
    {
      title: "Ava's Adventure in Dreamland",
      excerpt: "Once upon a time, in a magical dreamland filled with cotton candy clouds and rainbow rivers, there lived a brave girl named Ava...",
      image: "/images/story-preview-1.jpg"
    },
    {
      title: "Leo and the Space Dragons",
      excerpt: "Far beyond the stars, in a galaxy of wonders, a curious boy named Leo discovered a mysterious map that led to the legendary Space Dragons...",
      image: "/images/story-preview-2.jpg"
    },
    {
      title: "Maya's Underwater Kingdom",
      excerpt: "Deep beneath the ocean waves, where sunlight danced on coral reefs, Maya discovered a hidden entrance to an underwater kingdom...",
      image: "/images/story-preview-3.jpg"
    }
  ];

  const faqs = [
    {
      question: "How much does it cost?",
      answer: "We offer a free tier with 3 stories per month. Our premium plan at $4.99/month gives you unlimited stories, more themes, and the ability to save and print your creations."
    },
    {
      question: "Can I edit my stories?",
      answer: "Yes! All stories can be edited after generation. Premium users get access to advanced editing features including custom illustrations."
    },
    {
      question: "What age group is this for?",
      answer: "Our stories are designed for children ages 2-10. You can select the appropriate reading level during story creation to match your child's abilities."
    },
    {
      question: "Can I print the stories?",
      answer: "Absolutely! All stories can be downloaded as PDFs for easy printing. Premium users get access to special formatting options and illustration quality."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 dark:from-midnight dark:to-indigo-950">
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
              {/* Replace with actual image */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-golden/20 rounded-2xl flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-white dark:bg-midnight-light rounded-lg shadow-dreamy transform rotate-3 animate-float">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">📚✨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-8 bg-white dark:bg-midnight-dark">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-primary text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card hover className="space-y-4 text-center p-6 bg-sky-50 dark:bg-midnight">
              <div className="w-16 h-16 bg-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-primary">Choose a Theme</h3>
              <p className="text-text-secondary dark:text-text-primary/80">
                Pirates? Space? Talking animals? Pick a world of adventure!
              </p>
              <div className="flex gap-2 flex-wrap mt-4 justify-center">
                <Button variant="outline" size="sm">🚀 Space</Button>
                <Button variant="outline" size="sm">🧚‍♀️ Fantasy</Button>
                <Button variant="outline" size="sm">🏴‍☠️ Pirates</Button>
              </div>
            </Card>

            {/* Step 2 */}
            <Card hover className="space-y-4 text-center p-6 bg-sky-50 dark:bg-midnight">
              <div className="w-16 h-16 bg-dreamy rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-primary">Customize the Hero</h3>
              <p className="text-text-secondary dark:text-text-primary/80">
                Give your child the starring role! Add their name, traits, and interests.
              </p>
              <Input 
                placeholder="Child's name"
                className="mt-4"
              />
            </Card>

            {/* Step 3 */}
            <Card hover className="space-y-4 text-center p-6 bg-sky-50 dark:bg-midnight">
              <div className="w-16 h-16 bg-golden rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-primary">Generate & Read</h3>
              <p className="text-text-secondary dark:text-text-primary/80">
                Watch the magic unfold! Your personalized bedtime story is ready to read or share.
              </p>
              <span className="twinkling-star text-3xl block mt-4">✨📖✨</span>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/story">
              <Button size="lg">
                Try It Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Parents Love It */}
      <section className="py-16 px-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-primary text-center mb-12">Why Parents Love It</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 space-y-4 bg-white dark:bg-midnight">
              <div className="flex items-start gap-4">
                <span className="text-2xl text-green-500">✅</span>
                <div>
                  <h3 className="text-primary text-xl">Personalized for Your Child</h3>
                  <p className="text-text-secondary dark:text-text-primary/80">
                    Makes bedtime extra special with stories featuring your child's name, interests, and adventures.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 bg-white dark:bg-midnight">
              <div className="flex items-start gap-4">
                <span className="text-2xl text-green-500">✅</span>
                <div>
                  <h3 className="text-primary text-xl">Instant & Effortless</h3>
                  <p className="text-text-secondary dark:text-text-primary/80">
                    AI crafts beautiful stories in seconds, saving you time while delighting your child.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 bg-white dark:bg-midnight">
              <div className="flex items-start gap-4">
                <span className="text-2xl text-green-500">✅</span>
                <div>
                  <h3 className="text-primary text-xl">Encourages Reading & Creativity</h3>
                  <p className="text-text-secondary dark:text-text-primary/80">
                    A fun way to spark imagination and develop a love for reading from an early age.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 space-y-4 bg-white dark:bg-midnight">
              <div className="flex items-start gap-4">
                <span className="text-2xl text-green-500">✅</span>
                <div>
                  <h3 className="text-primary text-xl">Safe & Family-Friendly</h3>
                  <p className="text-text-secondary dark:text-text-primary/80">
                    Thoughtfully designed for young readers with age-appropriate content and themes.
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Testimonial */}
          <Card variant="magical" className="mt-12 p-8 text-center bg-white/80 dark:bg-midnight/80 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-lavender rounded-full mb-4"></div>
              <p className="text-lg italic mb-4">
                "My daughter asks for a new story every night! It's become our special bedtime ritual, and I love how each story incorporates her interests."
              </p>
              <p className="font-bold">Sarah T., Parent of 6-year-old</p>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-golden text-xl">★</span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Story Previews */}
      <section className="py-16 px-8 bg-white dark:bg-midnight-dark">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-primary text-center mb-12">Story Previews</h2>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${activeStoryIndex * 100}%)` }}>
                {sampleStories.map((story, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card variant="outline" className="p-8 space-y-6 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-midnight dark:to-indigo-900">
                      <div className="relative w-full h-48 bg-lavender/20 rounded-lg mb-4">
                        {/* Replace with actual image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl">📚</span>
                        </div>
                      </div>
                      <h3 className="text-primary text-center">{story.title}</h3>
                      <div className="story-text">
                        <p>{story.excerpt}</p>
                      </div>
                      <div className="flex justify-center">
                        <Link href="/story">
                          <Button>
                            Create Your Own Story
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-6 gap-2">
              {sampleStories.map((_, index) => (
                <button 
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === activeStoryIndex ? 'bg-primary' : 'bg-lavender'}`}
                  onClick={() => setActiveStoryIndex(index)}
                />
              ))}
            </div>
            
            <button 
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white dark:bg-midnight rounded-full p-2 shadow-dreamy"
              onClick={() => setActiveStoryIndex(prev => Math.max(0, prev - 1))}
              disabled={activeStoryIndex === 0}
            >
              ←
            </button>
            
            <button 
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white dark:bg-midnight rounded-full p-2 shadow-dreamy"
              onClick={() => setActiveStoryIndex(prev => Math.min(sampleStories.length - 1, prev + 1))}
              disabled={activeStoryIndex === sampleStories.length - 1}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-16 px-8 bg-gradient-to-b from-sky-50 to-indigo-50 dark:from-midnight dark:to-indigo-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-primary text-center mb-4">Start Your Story Journey</h2>
          <p className="text-center text-lg mb-12 max-w-2xl mx-auto">
            Begin creating magical stories for your little ones today. No credit card needed to get started!
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 space-y-6 bg-white dark:bg-midnight">
              <h3 className="text-primary text-center">Free Plan</h3>
              <div className="text-center">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-text-secondary dark:text-text-primary/80">/month</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>3 stories per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>5 basic themes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Basic customization</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>PDF downloads</span>
                </li>
              </ul>
              <Link href="/story">
                <Button variant="outline" fullWidth>
                  Start for Free
                </Button>
              </Link>
            </Card>
            
            <Card variant="magical" className="p-8 space-y-6 relative overflow-hidden bg-gradient-to-br from-white to-indigo-50 dark:from-midnight dark:to-indigo-900">
              <div className="absolute top-0 right-0 bg-primary text-text-primary px-4 py-1 rounded-bl-lg">
                Popular
              </div>
              <h3 className="text-primary text-center">Premium Plan</h3>
              <div className="text-center">
                <span className="text-3xl font-bold">$4.99</span>
                <span className="text-text-secondary dark:text-text-primary/80">/month</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Unlimited stories</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>20+ premium themes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Advanced customization</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>PDF downloads with illustrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Save & edit stories</span>
                </li>
              </ul>
              <Link href="/story?plan=premium">
                <Button fullWidth>
                  Get Premium
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-8 bg-white dark:bg-midnight-dark">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-primary text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 bg-sky-50 dark:bg-midnight">
                <h3 className="text-primary text-xl mb-2">{faq.question}</h3>
                <p className="text-text-secondary dark:text-text-primary/80">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-indigo-900 text-text-primary">
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
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  <span>🐦</span>
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <span>📸</span>
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <span>👍</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-text-primary/20 pt-6 text-center">
            <p>Made with ❤️ for parents and kids. © {new Date().getFullYear()} Step Into Story Time</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
