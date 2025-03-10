'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useWizardState } from '../useWizardState';
import { useWizardDispatch } from '../WizardContext';

export function NameStep() {
  const dispatch = useWizardDispatch();
  const { nameInput, setNameInput, handleNameSubmit } = useWizardState();

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
      handleNameSubmit();
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
