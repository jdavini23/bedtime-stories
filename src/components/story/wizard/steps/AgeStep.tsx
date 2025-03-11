'use client';

import React from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useWizardState } from '../useWizardState';
import { useWizardDispatch } from '../WizardContext';

export function AgeStep() {
  const dispatch = useWizardDispatch();
  const { storyInput, updateStoryInput, setCurrentQuestion, addMessage } = useWizardState();

  const handleSubmit = () => {
    const age = storyInput.childAge || 8;
    if (age >= 4 && age <= 12) {
      // Add the user's response as a message
      addMessage({
        type: 'age-response',
        content: `${age} years old`,
        sender: 'user',
      });

      // Update the story input with the age
      updateStoryInput({ childAge: age });

      // Move to the next step
      addMessage({
        type: 'gender-question',
        content: (
          <div className="space-y-3">
            <p>Nice! Are you a boy or a girl?</p>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('gender-question');
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      updateStoryInput({ childAge: value });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      storyInput.childAge &&
      storyInput.childAge >= 4 &&
      storyInput.childAge <= 12
    ) {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <Input
        type="number"
        min={4}
        max={12}
        value={storyInput.childAge || ''}
        onChange={handleAgeChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter age (4-12)..."
        className="flex-1"
        autoFocus
      />
      <Button
        onClick={handleSubmit}
        disabled={!storyInput.childAge || storyInput.childAge < 4 || storyInput.childAge > 12}
        className="px-4 py-2 bg-sky/10 hover:bg-sky/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </Button>
    </div>
  );
}
