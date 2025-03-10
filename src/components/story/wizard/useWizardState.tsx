'use client';

import { useCallback } from 'react';
import { useWizard } from './WizardContext';
import { MessageType, READING_LEVEL_OPTIONS } from './types';
import { StoryGender, StoryMetadata, StoryTheme } from '@/types/story';
import { StoryCharacter } from '@/services/personalization';
import { Button } from '@/components/ui/button';

export function useWizardState() {
  const { dispatch, ...state } = useWizard();

  const simulateTyping = useCallback(
    (callback: () => void, delay = 800) => {
      if (state.isTyping) {
        console.log('[Wizard] Typing animation already in progress', {
          currentQuestion: state.currentQuestion,
          messageCount: state.messages.length,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      console.log('[Wizard] Starting typing animation', {
        currentQuestion: state.currentQuestion,
        messageCount: state.messages.length,
        delay,
        timestamp: new Date().toISOString(),
      });

      dispatch({ type: 'SET_IS_TYPING', payload: true });

      const timeoutId = setTimeout(() => {
        console.log('[Wizard] Ending typing animation', {
          currentQuestion: state.currentQuestion,
          messageCount: state.messages.length,
          timestamp: new Date().toISOString(),
        });
        dispatch({ type: 'SET_IS_TYPING', payload: false });
        callback();
      }, delay);

      return () => {
        console.log('[Wizard] Cleaning up typing animation');
        clearTimeout(timeoutId);
      };
    },
    [dispatch, state.isTyping, state.currentQuestion, state.messages.length]
  );

  const addMessage = useCallback(
    (message: { type: MessageType; content: React.ReactNode; sender: 'system' | 'user' }) => {
      if (state.isTyping) {
        console.log('[Wizard] Prevented message add during typing', {
          messageType: message.type,
          sender: message.sender,
          currentQuestion: state.currentQuestion,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      console.log('[Wizard] Adding message', {
        messageType: message.type,
        sender: message.sender,
        currentQuestion: state.currentQuestion,
        timestamp: new Date().toISOString(),
      });

      dispatch({ type: 'ADD_MESSAGE', payload: message });
    },
    [dispatch, state.isTyping, state.currentQuestion]
  );

  const setCurrentQuestion = useCallback(
    (question: MessageType) => {
      if (state.isTyping) {
        console.log('[Wizard] Prevented question change during typing', {
          from: state.currentQuestion,
          to: question,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      console.log('[Wizard] Changing question', {
        from: state.currentQuestion,
        to: question,
        messageCount: state.messages.length,
        timestamp: new Date().toISOString(),
      });

      dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
    },
    [dispatch, state.isTyping, state.currentQuestion, state.messages.length]
  );

  const setWaitingForResponse = useCallback(
    (waiting: boolean) => {
      dispatch({ type: 'SET_WAITING_FOR_RESPONSE', payload: waiting });
    },
    [dispatch]
  );

  const updateStoryInput = useCallback(
    (update: Partial<typeof state.storyInput>) => {
      dispatch({ type: 'UPDATE_STORY_INPUT', payload: update });
    },
    [dispatch]
  );

  const setNameInput = useCallback(
    (name: string) => {
      dispatch({ type: 'SET_NAME_INPUT', payload: name });
    },
    [dispatch]
  );

  const setSelectedInterests = useCallback(
    (interests: string[]) => {
      dispatch({ type: 'SET_SELECTED_INTERESTS', payload: interests });
    },
    [dispatch]
  );

  const setSelectedTraits = useCallback(
    (traits: string[]) => {
      dispatch({ type: 'SET_SELECTED_TRAITS', payload: traits });
    },
    [dispatch]
  );

  const setSupportingCharacter = useCallback(
    (character: StoryCharacter) => {
      dispatch({ type: 'SET_SUPPORTING_CHARACTER', payload: character });
    },
    [dispatch]
  );

  const handleGenderSelect = useCallback(
    (gender: StoryGender) => {
      addMessage({
        type: 'gender-response',
        content: (
          <div className="flex items-center space-x-2">
            <span className="text-xl">{gender === 'boy' ? '👦' : '👧'}</span>
            <span>{gender}</span>
          </div>
        ),
        sender: 'user',
      });

      simulateTyping(() => {
        addMessage({
          type: 'interests-question',
          content: (
            <div className="space-y-3">
              <p>What are some things you like? Choose as many as you want!</p>
            </div>
          ),
          sender: 'system',
        });
        setCurrentQuestion('interests-question');
      });
    },
    [addMessage, setCurrentQuestion, simulateTyping]
  );

  const handleInterestsSubmit = useCallback(() => {
    if (state.selectedInterests.length === 0) return;

    updateStoryInput({ characters: state.selectedInterests });

    addMessage({
      type: 'interests-response',
      content: (
        <div className="flex flex-wrap gap-2">
          {state.selectedInterests.map((interest) => (
            <span key={interest} className="px-2 py-1 rounded-md bg-sky/10">
              {interest}
            </span>
          ))}
        </div>
      ),
      sender: 'user',
    });

    simulateTyping(() => {
      addMessage({
        type: 'traits-question',
        content: (
          <div className="space-y-3">
            <p>What kind of character traits would you like to have in the story?</p>
            <div className="grid grid-cols-2 gap-2">
              {/* Trait options will be rendered here */}
            </div>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('traits-question');
    });
  }, [addMessage, setCurrentQuestion, simulateTyping, state.selectedInterests, updateStoryInput]);

  const handleThemeSelect = useCallback(
    (theme: StoryTheme) => {
      if (state.isTyping) {
        console.log('[Wizard] Prevented theme selection during typing animation');
        return;
      }

      updateStoryInput({ theme });

      addMessage({
        type: 'theme-response',
        content: (
          <div className="flex items-center space-x-2">
            <span className="text-xl">
              {theme === 'adventure' && '🧭'}
              {theme === 'fantasy' && '✨'}
              {theme === 'science' && '🔬'}
              {theme === 'nature' && '🌿'}
              {theme === 'friendship' && '👫'}
              {theme === 'educational' && '📚'}
              {theme === 'courage' && '🦁'}
              {theme === 'kindness' && '💖'}
              {theme === 'curiosity' && '🔍'}
              {theme === 'creativity' && '🎨'}
            </span>
            <span>{theme}</span>
          </div>
        ),
        sender: 'user',
      });

      setTimeout(() => {
        simulateTyping(() => {
          addMessage({
            type: 'name-question',
            content: "What's the name of our main character?",
            sender: 'system',
          });
          setCurrentQuestion('name-question');
        });
      }, 100);
    },
    [addMessage, setCurrentQuestion, simulateTyping, state.isTyping, updateStoryInput]
  );

  const handleNameSubmit = useCallback(() => {
    if (!state.nameInput.trim()) return;

    updateStoryInput({ childName: state.nameInput });

    addMessage({
      type: 'name-response',
      content: state.nameInput,
      sender: 'user',
    });

    simulateTyping(() => {
      addMessage({
        type: 'gender-question',
        content: (
          <div className="space-y-3">
            <p>Nice to meet you, {state.nameInput}! Are you a boy or a girl?</p>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('gender-question');
    });
  }, [addMessage, setCurrentQuestion, simulateTyping, state.nameInput, updateStoryInput]);

  const handleGenerateStory = useCallback(() => {
    setWaitingForResponse(true);
    addMessage({
      type: 'generating',
      content: <p>Generating your personalized story...</p>,
      sender: 'system',
    });
  }, [addMessage, setWaitingForResponse]);

  const handleReadingLevelSelect = useCallback(
    (readingLevel: StoryMetadata['readingLevel']) => {
      updateStoryInput({ readingLevel });

      addMessage({
        type: 'reading-level-response',
        content: (
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {READING_LEVEL_OPTIONS.find((level) => level.value === readingLevel)?.label}
            </span>
          </div>
        ),
        sender: 'user',
      });

      simulateTyping(() => {
        addMessage({
          type: 'summary',
          content: (
            <div className="space-y-3">
              <p>Great! Let me summarize what we have so far:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Name: {state.storyInput.childName}</li>
                <li>Theme: {state.storyInput.theme}</li>
                <li>Interests: {state.selectedInterests.join(', ')}</li>
                <li>Character Traits: {state.selectedTraits.join(', ')}</li>
                <li>Reading Level: {readingLevel}</li>
              </ul>
              <p>Would you like me to generate your story now?</p>
              <Button
                onClick={handleGenerateStory}
                className="mt-4 w-full px-4 py-2 bg-sky/10 hover:bg-sky/20 transition-colors"
              >
                Generate Story
              </Button>
            </div>
          ),
          sender: 'system',
        });
        setCurrentQuestion('summary');
      });
    },
    [
      addMessage,
      handleGenerateStory,
      setCurrentQuestion,
      simulateTyping,
      state.selectedInterests,
      state.selectedTraits,
      state.storyInput.childName,
      state.storyInput.theme,
      updateStoryInput,
    ]
  );

  const handleTraitsSubmit = useCallback(() => {
    if (state.selectedTraits.length === 0) return;

    updateStoryInput({
      mainCharacter: {
        ...state.storyInput.mainCharacter,
        traits: state.selectedTraits,
      },
    });

    addMessage({
      type: 'traits-response',
      content: (
        <div className="flex flex-wrap gap-2">
          {state.selectedTraits.map((trait) => (
            <span key={trait} className="px-2 py-1 rounded-md bg-sky/10">
              {trait}
            </span>
          ))}
        </div>
      ),
      sender: 'user',
    });

    setCurrentQuestion('reading-level-question');
  }, [
    addMessage,
    setCurrentQuestion,
    state.selectedTraits,
    state.storyInput.mainCharacter,
    updateStoryInput,
  ]);

  return {
    ...state,
    simulateTyping,
    addMessage,
    setCurrentQuestion,
    setWaitingForResponse,
    updateStoryInput,
    setNameInput,
    setSelectedInterests,
    setSelectedTraits,
    setSupportingCharacter,
    handleThemeSelect,
    handleNameSubmit,
    handleGenderSelect,
    handleInterestsSubmit,
    handleTraitsSubmit,
    handleReadingLevelSelect,
    handleGenerateStory,
  };
}
