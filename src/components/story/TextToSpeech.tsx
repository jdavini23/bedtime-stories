'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../common/Button';
import { logger } from '@/utils/logger';

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(0.9); // Slightly slower than default for bedtime stories

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Create utterance
      const speechUtterance = new SpeechSynthesisUtterance(text);
      setUtterance(speechUtterance);

      // Get available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Try to find a good English voice for stories
        const preferredVoice =
          availableVoices.find(
            (v) =>
              v.name.includes('Female') &&
              (v.name.includes('US') || v.name.includes('UK') || v.name.includes('GB'))
          ) || availableVoices[0];

        if (preferredVoice) {
          setVoice(preferredVoice);
          speechUtterance.voice = preferredVoice;
        }
      };

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      loadVoices();

      // Set initial rate
      speechUtterance.rate = rate;

      // Handle end of speech
      speechUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      // Handle errors
      speechUtterance.onerror = (event) => {
        logger.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsPaused(false);
      };

      // Cleanup
      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, [text]);

  // Update utterance when voice or rate changes
  useEffect(() => {
    if (utterance && voice) {
      utterance.voice = voice;
      utterance.rate = rate;
    }
  }, [utterance, voice, rate]);

  const handlePlay = useCallback(() => {
    if (!utterance) return;

    if (isPaused) {
      window.speechSynthesis.resume();
    } else {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      // Set the text again in case it changed
      utterance.text = text;
      window.speechSynthesis.speak(utterance);
    }

    setIsPlaying(true);
    setIsPaused(false);
  }, [utterance, text, isPaused]);

  const handlePause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const handleVoiceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedVoice = voices.find((v) => v.name === e.target.value) || null;
      setVoice(selectedVoice);
    },
    [voices]
  );

  const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(e.target.value));
  }, []);

  // If speech synthesis is not supported
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
      <h3 className="text-lg font-medium text-indigo-800 mb-3">Listen to the Story</h3>

      <div className="flex flex-wrap gap-3 mb-4">
        {!isPlaying ? (
          <Button onClick={handlePlay} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Play
            </span>
          </Button>
        ) : (
          <>
            {!isPaused ? (
              <Button
                onClick={handlePause}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pause
                </span>
              </Button>
            ) : (
              <Button onClick={handlePlay} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Resume
                </span>
              </Button>
            )}
            <Button onClick={handleStop} className="bg-red-600 hover:bg-red-700 text-white">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clipRule="evenodd"
                  />
                </svg>
                Stop
              </span>
            </Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-1">
            Voice
          </label>
          <select
            id="voice-select"
            value={voice?.name || ''}
            onChange={handleVoiceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rate-slider" className="block text-sm font-medium text-gray-700 mb-1">
            Speed: {rate.toFixed(1)}x
          </label>
          <input
            id="rate-slider"
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={rate}
            onChange={handleRateChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
