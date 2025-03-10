import { render } from '@testing-library/react';
import { WizardProvider } from '@/components/story/wizard/WizardContext';
import { vi } from 'vitest';

export const renderWithWizardContext = (ui: React.ReactNode) => {
  return render(<WizardProvider>{ui}</WizardProvider>);
};

export const mockWizardState = {
  messages: [],
  currentQuestion: 'welcome',
  isTyping: false,
  waitingForResponse: false,
  selectedInterests: [],
  selectedTraits: [],
  storyInput: {},
  nameInput: '',
  readingLevel: '',
  handleThemeSelect: vi.fn(),
  handleNameSubmit: vi.fn(),
  handleGenderSelect: vi.fn(),
  handleInterestsSubmit: vi.fn(),
  handleTraitsSubmit: vi.fn(),
  handleReadingLevelSubmit: vi.fn(),
  setNameInput: vi.fn(),
  setSelectedInterests: vi.fn(),
  setSelectedTraits: vi.fn(),
  setReadingLevel: vi.fn(),
  addMessage: vi.fn(),
  simulateTyping: vi.fn(),
  updateStoryInput: vi.fn(),
};
