'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ExtendedStoryInput, Message, MessageType } from './types';
import { StoryGender, StoryMetadata, StoryTheme } from '@/types/story';
import { StoryCharacter } from '@/services/personalization';

interface WizardState {
  messages: Message[];
  currentQuestion: MessageType;
  waitingForResponse: boolean;
  isTyping: boolean;
  storyInput: Partial<ExtendedStoryInput>;
  nameInput: string;
  selectedInterests: string[];
  selectedTraits: string[];
  supportingCharacter: StoryCharacter;
  lastTransitionTimestamp: number;
}

type WizardAction =
  | { type: 'ADD_MESSAGE'; payload: Omit<Message, 'id' | 'timestamp'> }
  | { type: 'SET_CURRENT_QUESTION'; payload: MessageType }
  | { type: 'SET_WAITING_FOR_RESPONSE'; payload: boolean }
  | { type: 'SET_IS_TYPING'; payload: boolean }
  | { type: 'UPDATE_STORY_INPUT'; payload: Partial<ExtendedStoryInput> }
  | { type: 'SET_NAME_INPUT'; payload: string }
  | { type: 'SET_SELECTED_INTERESTS'; payload: string[] }
  | { type: 'SET_SELECTED_TRAITS'; payload: string[] }
  | { type: 'SET_SUPPORTING_CHARACTER'; payload: StoryCharacter };

interface WizardContextType extends WizardState {
  dispatch: React.Dispatch<WizardAction>;
}

const initialState: WizardState = {
  messages: [],
  currentQuestion: 'welcome',
  waitingForResponse: false,
  isTyping: false,
  storyInput: {
    childName: '',
    childAge: 0,
    theme: '',
    characters: [],
    setting: '',
    length: 'medium',
    readingLevel: 'intermediate',
    mainCharacter: {
      traits: [],
      appearance: [],
      skills: [],
    },
    supportingCharacters: [],
    ageGroup: '6-8',
  },
  nameInput: '',
  selectedInterests: [],
  selectedTraits: [],
  supportingCharacter: {
    name: '',
    type: 'animal',
    traits: [],
    role: '',
  },
  lastTransitionTimestamp: Date.now(),
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  const timestamp = new Date().toISOString();

  console.log('[Wizard] Reducer called', {
    actionType: action.type,
    currentQuestion: state.currentQuestion,
    messageCount: state.messages.length,
    isTyping: state.isTyping,
    timestamp,
  });

  switch (action.type) {
    case 'ADD_MESSAGE': {
      console.log('[Wizard] Processing ADD_MESSAGE', {
        type: action.payload.type,
        sender: action.payload.sender,
        currentQuestion: state.currentQuestion,
        messageCount: state.messages.length,
        timestamp,
      });

      // Check for exact duplicate messages in the last 2 seconds
      const recentMessages = state.messages.filter(
        (msg) => Date.now() - msg.timestamp.getTime() < 2000
      );

      const isDuplicate = recentMessages.some(
        (msg) =>
          msg.type === action.payload.type &&
          msg.sender === action.payload.sender &&
          JSON.stringify(msg.content) === JSON.stringify(action.payload.content)
      );

      if (isDuplicate) {
        console.log('[Wizard] Prevented duplicate message', {
          type: action.payload.type,
          sender: action.payload.sender,
          timestamp,
        });
        return state;
      }

      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
        ...action.payload,
      };

      console.log('[Wizard] Adding new message', {
        messageId: newMessage.id,
        type: action.payload.type,
        sender: action.payload.sender,
        timestamp,
      });

      return {
        ...state,
        messages: [...state.messages, newMessage],
        lastTransitionTimestamp: Date.now(),
      };
    }

    case 'SET_CURRENT_QUESTION': {
      console.log('[Wizard] Processing SET_CURRENT_QUESTION', {
        from: state.currentQuestion,
        to: action.payload,
        messageCount: state.messages.length,
        isTyping: state.isTyping,
        timeSinceLastTransition: Date.now() - state.lastTransitionTimestamp,
        timestamp,
      });

      // Only prevent rapid transitions if it's the same question type
      if (
        action.payload === state.currentQuestion &&
        Date.now() - state.lastTransitionTimestamp < 500
      ) {
        console.log('[Wizard] Prevented duplicate transition', {
          from: state.currentQuestion,
          to: action.payload,
          timeSinceLastTransition: Date.now() - state.lastTransitionTimestamp,
          timestamp,
        });
        return state;
      }

      return {
        ...state,
        currentQuestion: action.payload,
        lastTransitionTimestamp: Date.now(),
      };
    }

    case 'SET_WAITING_FOR_RESPONSE':
      return {
        ...state,
        waitingForResponse: action.payload,
      };

    case 'SET_IS_TYPING': {
      // Only update typing state if it's different
      if (state.isTyping === action.payload) {
        console.log('[Wizard] Skipped redundant typing state update', {
          isTyping: action.payload,
          timestamp,
        });
        return state;
      }

      console.log('[Wizard] Updating typing state', {
        from: state.isTyping,
        to: action.payload,
        currentQuestion: state.currentQuestion,
        messageCount: state.messages.length,
        timestamp,
      });

      return {
        ...state,
        isTyping: action.payload,
      };
    }

    case 'UPDATE_STORY_INPUT':
      return {
        ...state,
        storyInput: { ...state.storyInput, ...action.payload },
      };

    case 'SET_NAME_INPUT':
      return {
        ...state,
        nameInput: action.payload,
      };

    case 'SET_SELECTED_INTERESTS':
      return {
        ...state,
        selectedInterests: action.payload,
      };

    case 'SET_SELECTED_TRAITS':
      return {
        ...state,
        selectedTraits: action.payload,
      };

    case 'SET_SUPPORTING_CHARACTER':
      return {
        ...state,
        supportingCharacter: action.payload,
      };

    default:
      return state;
  }
}

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  return <WizardContext.Provider value={{ ...state, dispatch }}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

export function useWizardState() {
  const { dispatch, ...state } = useWizard();
  return state;
}

export function useWizardDispatch() {
  const { dispatch } = useWizard();
  return dispatch;
}
