'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryInput, StoryTheme, StoryGender, StoryMetadata } from '@/types/story';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  EnhancedStoryInput,
  StoryCharacter,
  UserPreferences,
  CHARACTER_TRAITS,
  CHARACTER_ARCHETYPES,
  THEME_DESCRIPTIONS,
} from '@/services/personalizationEngine';

// Extend the EnhancedStoryInput to include ageGroup
interface ExtendedStoryInput extends EnhancedStoryInput {
  ageGroup?: UserPreferences['ageGroup'];
}

interface ConversationalWizardProps {
  onComplete: (input: ExtendedStoryInput) => Promise<void>;
  isLoading?: boolean;
}

// Define the different types of messages in our conversation
type MessageType =
  | 'welcome'
  | 'theme-question'
  | 'theme-response'
  | 'name-question'
  | 'name-response'
  | 'gender-question'
  | 'gender-response'
  | 'interests-question'
  | 'interests-response'
  | 'traits-question'
  | 'traits-response'
  | 'supporting-character-question'
  | 'supporting-character-response'
  | 'reading-level-question'
  | 'reading-level-response'
  | 'summary'
  | 'generating';

interface Message {
  id: string;
  type: MessageType;
  content: React.ReactNode;
  sender: 'system' | 'user';
  timestamp: Date;
}

// Theme options with emojis and descriptions
const THEME_OPTIONS = [
  {
    value: 'adventure',
    emoji: '🧭',
    label: 'Adventure',
    description: 'Exciting journeys and discoveries',
  },
  { value: 'fantasy', emoji: '✨', label: 'Fantasy', description: 'Magical worlds and creatures' },
  { value: 'science', emoji: '🔬', label: 'Science', description: 'Exploration and discovery' },
  { value: 'nature', emoji: '🌿', label: 'Nature', description: 'Animals and the natural world' },
  { value: 'friendship', emoji: '👫', label: 'Friendship', description: 'Building relationships' },
  { value: 'educational', emoji: '📚', label: 'Educational', description: 'Learning new things' },
  { value: 'courage', emoji: '🦁', label: 'Courage', description: 'Overcoming challenges' },
  { value: 'kindness', emoji: '💖', label: 'Kindness', description: 'Helping others' },
  { value: 'curiosity', emoji: '🔍', label: 'Curiosity', description: 'Exploring the unknown' },
  { value: 'creativity', emoji: '🎨', label: 'Creativity', description: 'Imagination and art' },
];

// Gender options with emojis
const GENDER_OPTIONS = [
  { value: 'boy', emoji: '👦', label: 'Boy' },
  { value: 'girl', emoji: '👧', label: 'Girl' },
  { value: 'neutral', emoji: '🌟', label: 'Other' },
];

// Common interests with emojis
const COMMON_INTERESTS = [
  { value: 'Dinosaurs', emoji: '🦕' },
  { value: 'Space', emoji: '🚀' },
  { value: 'Superheroes', emoji: '🦸' },
  { value: 'Unicorns', emoji: '🦄' },
  { value: 'Pirates', emoji: '🏴‍☠️' },
  { value: 'Princesses', emoji: '👸' },
  { value: 'Animals', emoji: '🐾' },
  { value: 'Magic', emoji: '🪄' },
  { value: 'Adventure', emoji: '🧭' },
  { value: 'Science', emoji: '🔬' },
  { value: 'Robots', emoji: '🤖' },
  { value: 'Dragons', emoji: '🐉' },
  { value: 'Nature', emoji: '🌿' },
  { value: 'Music', emoji: '🎵' },
  { value: 'Art', emoji: '🎨' },
  { value: 'Sports', emoji: '⚽' },
];

// Reading level options with descriptions
const READING_LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner', description: 'Simple words and short sentences' },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'More complex sentences and vocabulary',
  },
  { value: 'advanced', label: 'Advanced', description: 'Rich vocabulary and longer paragraphs' },
];

// Age group options
const AGE_GROUP_OPTIONS = [
  { value: '3-5', label: '3-5 years' },
  { value: '6-8', label: '6-8 years' },
  { value: '9-12', label: '9-12 years' },
];

export function ConversationalWizard({ onComplete, isLoading = false }: ConversationalWizardProps) {
  // State for the conversation
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<MessageType>('welcome');
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // State for the story input
  const [storyInput, setStoryInput] = useState<Partial<ExtendedStoryInput>>({
    theme: '' as StoryTheme,
    childName: '',
    gender: 'neutral' as StoryGender,
    mood: 'adventurous',
    interests: [],
    mostLikedCharacterTypes: [],
    readingLevel: 'intermediate' as StoryMetadata['readingLevel'],
    ageGroup: '6-8',
    mainCharacter: {
      traits: [],
      appearance: [],
      skills: [],
    },
    supportingCharacters: [],
  });

  // Input states
  const [nameInput, setNameInput] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [supportingCharacter, setSupportingCharacter] = useState<StoryCharacter>({
    name: '',
    type: 'animal',
    traits: [],
    role: '',
  });

  // Ref for scrolling to bottom of conversation
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to simulate typing effect
  const simulateTyping = (callback: () => void, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  // Start the conversation when component mounts
  useEffect(() => {
    // Only add messages if there are none (prevents duplicates on re-renders)
    if (messages.length === 0) {
      addMessage({
        type: 'welcome',
        content: (
          <div className="space-y-2">
            <p className="text-lg font-medium">Hi there! 👋</p>
            <p>I'm your story assistant, and I'll help you create a personalized bedtime story.</p>
            <p>Let's start by choosing a theme for your story.</p>
          </div>
        ),
        sender: 'system',
      });

      setTimeout(() => {
        addMessage({
          type: 'theme-question',
          content: (
            <div className="space-y-3">
              <p>What kind of story would you like to create today?</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {THEME_OPTIONS.map((theme) => (
                  <Button
                    key={theme.value}
                    variant="outline"
                    className="flex items-center justify-start space-x-2 h-auto py-3 px-4 text-left"
                    onClick={() => handleThemeSelect(theme.value as StoryTheme)}
                  >
                    <span className="text-xl">{theme.emoji}</span>
                    <div>
                      <div className="font-medium">{theme.label}</div>
                      <div className="text-xs text-muted-foreground">{theme.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ),
          sender: 'system',
        });
        setCurrentQuestion('theme-question');
      }, 1000);
    }
  }, [messages.length]);

  // Add a new message to the conversation
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      ...message,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // Handle theme selection
  const handleThemeSelect = (theme: StoryTheme) => {
    setStoryInput((prev) => ({ ...prev, theme }));

    // Add user response
    addMessage({
      type: 'theme-response',
      content: (
        <div className="flex items-center space-x-2">
          <span className="text-xl">{THEME_OPTIONS.find((t) => t.value === theme)?.emoji}</span>
          <span>{THEME_OPTIONS.find((t) => t.value === theme)?.label}</span>
        </div>
      ),
      sender: 'user',
    });

    // Show typing indicator and add next question after a short delay
    simulateTyping(() => {
      addMessage({
        type: 'name-question',
        content: (
          <div className="space-y-3">
            <p>Great choice! Now, what's the name of the main character in our story?</p>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('name-question');
    });
  };

  // Handle name submission
  const handleNameSubmit = () => {
    if (!nameInput.trim()) return;

    setStoryInput((prev) => ({ ...prev, childName: nameInput }));

    // Add user response
    addMessage({
      type: 'name-response',
      content: <p>{nameInput}</p>,
      sender: 'user',
    });

    // Show typing indicator and add next question after a short delay
    simulateTyping(() => {
      addMessage({
        type: 'gender-question',
        content: (
          <div className="space-y-3">
            <p>
              Nice to meet {nameInput}! What gender is {nameInput}?
            </p>
            <div className="flex space-x-2">
              {GENDER_OPTIONS.map((gender) => (
                <Button
                  key={gender.value}
                  variant="outline"
                  className="flex-1 flex items-center justify-center space-x-2"
                  onClick={() => handleGenderSelect(gender.value as StoryGender)}
                >
                  <span className="text-xl">{gender.emoji}</span>
                  <span>{gender.label}</span>
                </Button>
              ))}
            </div>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('gender-question');
    });
  };

  // Handle gender selection
  const handleGenderSelect = (gender: StoryGender) => {
    setStoryInput((prev) => ({ ...prev, gender }));

    // Add user response
    addMessage({
      type: 'gender-response',
      content: (
        <div className="flex items-center space-x-2">
          <span className="text-xl">{GENDER_OPTIONS.find((g) => g.value === gender)?.emoji}</span>
          <span>{GENDER_OPTIONS.find((g) => g.value === gender)?.label}</span>
        </div>
      ),
      sender: 'user',
    });

    // Show typing indicator and add next question after a short delay
    simulateTyping(() => {
      addMessage({
        type: 'interests-question',
        content: (
          <div className="space-y-3">
            <p>What are {nameInput}'s interests? Select from the options below or add your own!</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_INTERESTS.map((interest) => (
                <Button
                  key={interest.value}
                  variant={selectedInterests.includes(interest.value) ? 'primary' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => handleInterestToggle(interest.value)}
                >
                  <span>{interest.emoji}</span>
                  <span>{interest.value}</span>
                </Button>
              ))}
            </div>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('interests-question');
    });
  };

  // Handle interest toggle
  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Handle interests submission
  const handleInterestsSubmit = () => {
    if (selectedInterests.length === 0) return;

    setStoryInput((prev) => ({
      ...prev,
      interests: selectedInterests,
      mostLikedCharacterTypes: selectedInterests,
    }));

    // Add user response
    addMessage({
      type: 'interests-response',
      content: (
        <div className="flex flex-wrap gap-1">
          {selectedInterests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
            >
              {COMMON_INTERESTS.find((i) => i.value === interest)?.emoji || '✨'} {interest}
            </span>
          ))}
        </div>
      ),
      sender: 'user',
    });

    // Show typing indicator and add next question after a short delay
    simulateTyping(() => {
      addMessage({
        type: 'traits-question',
        content: (
          <div className="space-y-3">
            <p>What personality traits does {nameInput} have? (Choose up to 3)</p>
            <div className="flex flex-wrap gap-2">
              {CHARACTER_TRAITS.personality.slice(0, 12).map((trait) => (
                <Button
                  key={trait}
                  variant={selectedTraits.includes(trait) ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleTraitToggle(trait)}
                >
                  {trait}
                </Button>
              ))}
            </div>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('traits-question');
    });
  };

  // Handle trait toggle
  const handleTraitToggle = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((t) => t !== trait)
        : prev.length < 3
          ? [...prev, trait]
          : prev
    );
  };

  // Handle traits submission
  const handleTraitsSubmit = () => {
    if (selectedTraits.length === 0) return;

    setStoryInput((prev) => ({
      ...prev,
      mainCharacter: {
        ...prev.mainCharacter,
        traits: selectedTraits,
      },
    }));

    // Add user response
    addMessage({
      type: 'traits-response',
      content: (
        <div className="flex flex-wrap gap-1">
          {selectedTraits.map((trait) => (
            <span
              key={trait}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
            >
              {trait}
            </span>
          ))}
        </div>
      ),
      sender: 'user',
    });

    // Show typing indicator and add next question after a short delay
    simulateTyping(() => {
      addMessage({
        type: 'reading-level-question',
        content: (
          <div className="space-y-3">
            <p>What reading level would you like for this story?</p>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('reading-level-question');
    });
  };

  // Handle reading level selection
  const handleReadingLevelSelect = (readingLevel: StoryMetadata['readingLevel']) => {
    setStoryInput((prev) => ({ ...prev, readingLevel }));

    // Add user response
    addMessage({
      type: 'reading-level-response',
      content: <p>{READING_LEVEL_OPTIONS.find((l) => l.value === readingLevel)?.label}</p>,
      sender: 'user',
    });

    // Show typing indicator and add next question after a short delay
    simulateTyping(() => {
      addMessage({
        type: 'summary',
        content: (
          <div className="space-y-4">
            <p>Perfect! Here's a summary of the story we're creating:</p>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
              <p>
                <span className="font-medium">Theme:</span>{' '}
                {THEME_OPTIONS.find((t) => t.value === storyInput.theme)?.label}
              </p>
              <p>
                <span className="font-medium">Main Character:</span> {storyInput.childName}
              </p>
              <p>
                <span className="font-medium">Gender:</span>{' '}
                {GENDER_OPTIONS.find((g) => g.value === storyInput.gender)?.label}
              </p>
              <p>
                <span className="font-medium">Interests:</span> {storyInput.interests?.join(', ')}
              </p>
              <p>
                <span className="font-medium">Character Traits:</span>{' '}
                {storyInput.mainCharacter?.traits?.join(', ')}
              </p>
              <p>
                <span className="font-medium">Reading Level:</span>{' '}
                {READING_LEVEL_OPTIONS.find((l) => l.value === storyInput.readingLevel)?.label}
              </p>
            </div>

            <p>Ready to generate your personalized story?</p>

            <Button className="w-full" size="lg" onClick={handleGenerateStory} disabled={isLoading}>
              {isLoading ? 'Creating your story...' : 'Create My Story!'}
            </Button>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('summary');
    }, 1200); // Longer delay for the summary to make it feel like it's "thinking"
  };

  // Handle generate story
  const handleGenerateStory = () => {
    if (isValidStoryInput(storyInput)) {
      // Add generating message
      addMessage({
        type: 'generating',
        content: (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <p>Creating your personalized story...</p>
          </div>
        ),
        sender: 'system',
      });

      // Call the onComplete callback
      onComplete(storyInput as ExtendedStoryInput);
    }
  };

  // Check if story input is valid
  const isValidStoryInput = (input: Partial<ExtendedStoryInput>): input is ExtendedStoryInput => {
    return (
      !!input.theme &&
      !!input.childName &&
      !!input.readingLevel &&
      !!input.gender &&
      Array.isArray(input.mostLikedCharacterTypes) &&
      input.mostLikedCharacterTypes.length > 0
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-4 shadow-dreamy overflow-hidden border-2 border-primary/10 dark:border-primary/20">
        <div className="flex items-center space-x-3 p-3 border-b border-primary/10 dark:border-primary/20 mb-4 bg-primary/5 dark:bg-primary/10 rounded-t-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center shadow-md">
            <span className="text-xl text-white">✨</span>
          </div>
          <div>
            <h2 className="font-medium text-lg text-primary dark:text-primary-foreground">
              Story Assistant
            </h2>
            <p className="text-xs text-primary/70 dark:text-primary-foreground/70">
              Creating magical stories just for you
            </p>
          </div>
        </div>

        <div className="h-[400px] overflow-y-auto p-3 space-y-5 mb-4 bg-muted/30 dark:bg-muted/10 rounded-lg">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'system' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center mr-2 mt-1 shadow-sm">
                    <span className="text-sm text-white">✨</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted dark:bg-muted/50 rounded-tl-none'
                  }`}
                >
                  {message.content}
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center ml-2 mt-1 shadow-sm">
                    <span className="text-sm">👤</span>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center mr-2 mt-1 shadow-sm">
                  <span className="text-sm text-white">✨</span>
                </div>
                <div className="bg-muted dark:bg-muted/50 p-3 rounded-lg rounded-tl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input area - only show when waiting for text input */}
        {currentQuestion === 'name-question' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-2"
          >
            <div className="flex space-x-2 p-2 bg-muted/20 dark:bg-muted/5 rounded-lg border border-primary/10 dark:border-primary/20">
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter character name"
                className="flex-1 border-primary/20 focus-visible:ring-primary/30"
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
              <Button
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-sm"
              >
                <span className="mr-1">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-send-horizontal"
                >
                  <path d="m3 3 3 9-3 9 19-9Z" />
                  <path d="M6 12h16" />
                </svg>
              </Button>
            </div>
            <div className="absolute bottom-full right-4 w-2 h-2 bg-muted/20 dark:bg-muted/5 transform rotate-45 border-r border-b border-primary/10 dark:border-primary/20"></div>
          </motion.div>
        )}

        {/* Custom interest input */}
        {currentQuestion === 'interests-question' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-2"
          >
            <div className="p-2 bg-muted/20 dark:bg-muted/5 rounded-lg border border-primary/10 dark:border-primary/20">
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-2">Selected interests:</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedInterests.length > 0 ? (
                    selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {COMMON_INTERESTS.find((i) => i.value === interest)?.emoji || '✨'}{' '}
                        {interest}
                        <button
                          onClick={() => handleInterestToggle(interest)}
                          className="ml-1 text-primary/70 hover:text-primary"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No interests selected yet</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add a custom interest..."
                  className="flex-1 border-primary/20 focus-visible:ring-primary/30"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleInterestToggle(e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={handleInterestsSubmit}
                  disabled={selectedInterests.length === 0}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-sm"
                >
                  <span className="mr-1">Next</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="absolute bottom-full right-4 w-2 h-2 bg-muted/20 dark:bg-muted/5 transform rotate-45 border-r border-b border-primary/10 dark:border-primary/20"></div>
          </motion.div>
        )}

        {/* Traits input */}
        {currentQuestion === 'traits-question' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-2"
          >
            <div className="p-2 bg-muted/20 dark:bg-muted/5 rounded-lg border border-primary/10 dark:border-primary/20">
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected traits: <span className="text-xs text-primary/70">(max 3)</span>
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedTraits.length > 0 ? (
                    selectedTraits.map((trait) => (
                      <span
                        key={trait}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {trait}
                        <button
                          onClick={() => handleTraitToggle(trait)}
                          className="ml-1 text-primary/70 hover:text-primary"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No traits selected yet</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add a custom trait..."
                  className="flex-1 border-primary/20 focus-visible:ring-primary/30"
                  disabled={selectedTraits.length >= 3}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      e.currentTarget.value.trim() &&
                      selectedTraits.length < 3
                    ) {
                      handleTraitToggle(e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={handleTraitsSubmit}
                  disabled={selectedTraits.length === 0}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-sm"
                >
                  <span className="mr-1">Next</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="absolute bottom-full right-4 w-2 h-2 bg-muted/20 dark:bg-muted/5 transform rotate-45 border-r border-b border-primary/10 dark:border-primary/20"></div>
          </motion.div>
        )}

        {/* Reading level input */}
        {currentQuestion === 'reading-level-question' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-2"
          >
            <div className="p-2 bg-muted/20 dark:bg-muted/5 rounded-lg border border-primary/10 dark:border-primary/20">
              <div className="space-y-2">
                {READING_LEVEL_OPTIONS.map((level) => (
                  <Button
                    key={level.value}
                    variant="outline"
                    className="w-full flex flex-col items-start justify-start p-3 h-auto text-left hover:bg-primary/5 hover:text-primary"
                    onClick={() =>
                      handleReadingLevelSelect(level.value as StoryMetadata['readingLevel'])
                    }
                  >
                    <span className="font-medium">{level.label}</span>
                    <span className="text-xs text-muted-foreground">{level.description}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="absolute bottom-full right-4 w-2 h-2 bg-muted/20 dark:bg-muted/5 transform rotate-45 border-r border-b border-primary/10 dark:border-primary/20"></div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
