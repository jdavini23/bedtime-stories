import { renderHook, act } from '@testing-library/react';
import { useWizardState } from '@/components/story/wizard/useWizardState';
import { WizardProvider } from '@/components/story/wizard/WizardContext';
import { MessageType } from '@/components/story/wizard/types';
import { StoryGender } from '@/types/story';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Helper function to wrap the hook with the required provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WizardProvider>{children}</WizardProvider>
);

describe('useWizardState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should initialize with default state', async () => {
    const { result } = renderHook(() => useWizardState(), { wrapper });

    expect(result.current.messages).toEqual([]);
    expect(result.current.currentQuestion).toBe('welcome');
    expect(result.current.isTyping).toBe(false);
    expect(result.current.waitingForResponse).toBe(false);
    expect(result.current.selectedInterests).toEqual([]);
    expect(result.current.selectedTraits).toEqual([]);
  });

  it('should handle gender selection and transition to interests question', async () => {
    const { result } = renderHook(() => useWizardState(), { wrapper });

    await act(async () => {
      result.current.handleGenderSelect('boy' as StoryGender);
      vi.runAllTimers();
    });

    // Check if gender response message was added
    expect(result.current.messages[0]).toMatchObject({
      type: 'gender-response',
      sender: 'user',
    });

    // Check if interests question was added and current question was updated
    expect(result.current.messages[1]).toMatchObject({
      type: 'interests-question',
      sender: 'system',
    });
    expect(result.current.currentQuestion).toBe('interests-question');
  });

  it('should handle interests submission and transition to traits question', async () => {
    const { result } = renderHook(() => useWizardState(), { wrapper });

    // Set some interests first
    await act(async () => {
      result.current.setSelectedInterests(['dragons', 'magic']);
    });

    // Submit interests
    await act(async () => {
      result.current.handleInterestsSubmit();
      vi.runAllTimers();
    });

    // Check if interests response message was added
    expect(result.current.messages[0]).toMatchObject({
      type: 'interests-response',
      sender: 'user',
    });

    // Check if traits question was added and current question was updated
    expect(result.current.messages[1]).toMatchObject({
      type: 'traits-question',
      sender: 'system',
    });
    expect(result.current.currentQuestion).toBe('traits-question');
  });

  it('should prevent actions during typing animation', async () => {
    const { result } = renderHook(() => useWizardState(), { wrapper });

    // Start typing animation
    await act(async () => {
      result.current.simulateTyping(() => {}, 1000);
    });

    // Try to add a message during typing
    await act(async () => {
      result.current.addMessage({
        type: 'test' as MessageType,
        content: 'test',
        sender: 'user',
      });
    });

    // Check that message was not added
    expect(result.current.messages).toHaveLength(0);

    // Fast-forward typing animation
    await act(async () => {
      vi.runAllTimers();
    });

    // Now message should be added successfully
    await act(async () => {
      result.current.addMessage({
        type: 'test' as MessageType,
        content: 'test',
        sender: 'user',
      });
    });

    expect(result.current.messages).toHaveLength(1);
  });

  it('should update story input correctly', async () => {
    const { result } = renderHook(() => useWizardState(), { wrapper });

    await act(async () => {
      result.current.updateStoryInput({ theme: 'adventure' });
    });

    expect(result.current.storyInput.theme).toBe('adventure');
  });

  it('should handle name input correctly', async () => {
    const { result } = renderHook(() => useWizardState(), { wrapper });

    await act(async () => {
      result.current.setNameInput('Alice');
    });

    expect(result.current.nameInput).toBe('Alice');
  });
});
