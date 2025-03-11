'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useWizardState } from '../useWizardState';
import { useWizardDispatch } from '../WizardContext';

export function NameStep() {
  const dispatch = useWizardDispatch();
  const { nameInput, setNameInput, handleNameSubmit, addMessage, setCurrentQuestion } =
    useWizardState();

  const handleSubmit = () => {
    if (nameInput.trim()) {
      console.log('Name submitted:', nameInput);
      // Add the user's response as a message
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          content: nameInput,
          sender: 'user',
          type: 'name-response',
        },
      });

      // Update the story input with the name
      handleNameSubmit();

      // Ask for the child's age
      addMessage({
        type: 'age-question',
        content: (
          <div className="space-y-3">
            <p>How old are you, {nameInput}?</p>
          </div>
        ),
        sender: 'system',
      });
      setCurrentQuestion('age-question');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && nameInput.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <Input
        type="text"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter name..."
        className="flex-1"
        autoFocus
      />
      <Button
        onClick={handleSubmit}
        disabled={!nameInput.trim()}
        className="px-4 py-2 bg-sky/10 hover:bg-sky/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </Button>
    </div>
  );
}
