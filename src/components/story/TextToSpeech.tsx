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
  const [rate, setRate] = useState(0.7); // Default to 0.7x as shown in the image
  const [error, setError] = useState<string | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        // Create utterance
        const speechUtterance = new SpeechSynthesisUtterance(text);
        setUtterance(speechUtterance);

        // Get available voices
        const loadVoices = () => {
          try {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoicesLoaded(true);

            if (availableVoices.length === 0) {
              // If no voices are available, we'll use the default voice
              setVoices([]);
              console.log('No voices available, using default voice');
              return;
            }

            // Filter to only include English voices
            const englishVoices = availableVoices.filter(
              (v) => v.lang.includes('en-') || v.lang.includes('en_')
            );

            const voicesToUse = englishVoices.length > 0 ? englishVoices : availableVoices;
            setVoices(voicesToUse);

            // Try to find a good English voice for stories
            let preferredVoice = null;

            // First try to find a female English voice
            preferredVoice = voicesToUse.find(
              (v) =>
                v.name.includes('Female') &&
                (v.name.includes('US') || v.name.includes('UK') || v.name.includes('GB'))
            );

            // If no specific female voice found, try any English voice
            if (!preferredVoice) {
              preferredVoice = voicesToUse.find(
                (v) => v.lang.includes('en-') || v.lang.includes('en_')
              );
            }

            // If still no voice found, use the first available voice
            if (!preferredVoice && voicesToUse.length > 0) {
              preferredVoice = voicesToUse[0];
            }

            if (preferredVoice) {
              setVoice(preferredVoice);
              // Only set the voice if the utterance exists
              if (speechUtterance) {
                try {
                  speechUtterance.voice = preferredVoice;
                } catch (voiceErr) {
                  console.error('Error setting voice:', voiceErr);
                }
              }
            }
          } catch (err) {
            console.error('Error loading voices:', err);
            setError('Could not load voice options. Using default voice.');
          }
        };

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        // Try to load voices immediately as well (for Firefox/Safari)
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
          console.error('Speech synthesis error:', event);
          setError('Error playing audio. Please try again or use a different voice.');
          setIsPlaying(false);
          setIsPaused(false);

          // Try to recover by canceling any ongoing speech
          try {
            window.speechSynthesis.cancel();
          } catch (cancelErr) {
            console.error('Error canceling speech after error:', cancelErr);
          }
        };

        // Cleanup
        return () => {
          try {
            window.speechSynthesis.cancel();
          } catch (err) {
            console.error('Error during cleanup:', err);
          }
        };
      } catch (err) {
        console.error('Error initializing speech synthesis:', err);
        setError('Speech synthesis not available on your browser.');
      }
    } else {
      setError('Speech synthesis not supported in your browser.');
    }
  }, [text]);

  // Update utterance when voice or rate changes
  useEffect(() => {
    if (utterance && voice) {
      try {
        utterance.voice = voice;
        utterance.rate = rate;
      } catch (err) {
        console.error('Error updating utterance:', err);
        setError('Could not update voice settings. Please try a different voice.');
      }
    }
  }, [utterance, voice, rate]);

  const handlePlay = useCallback(() => {
    if (!utterance) {
      setError('Speech synthesis not initialized. Please refresh the page.');
      return;
    }

    try {
      setError(null);

      if (isPaused) {
        window.speechSynthesis.resume();
      } else {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Set the text again in case it changed
        utterance.text = text;

        // Make sure the voice is set correctly
        if (voice) {
          try {
            utterance.voice = voice;
          } catch (voiceErr) {
            console.error('Error setting voice before speaking:', voiceErr);
            // Continue with default voice if there's an error
          }
        }

        // Set the rate
        utterance.rate = rate;

        // Speak
        window.speechSynthesis.speak(utterance);
      }

      setIsPlaying(true);
      setIsPaused(false);
    } catch (err) {
      console.error('Error playing speech:', err);
      setError('Could not play audio. Please try again or use a different voice.');
    }
  }, [utterance, text, isPaused, voice, rate]);

  const handlePause = useCallback(() => {
    try {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } catch (err) {
      console.error('Error pausing speech:', err);
      setError('Could not pause audio. Please try again.');
    }
  }, []);

  const handleStop = useCallback(() => {
    try {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    } catch (err) {
      console.error('Error stopping speech:', err);
      setError('Could not stop audio. Please try again.');
    }
  }, []);

  const handleVoiceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      try {
        const selectedVoice = voices.find((v) => v.name === e.target.value) || null;
        setVoice(selectedVoice);

        // If currently playing, stop and restart with new voice
        if (isPlaying) {
          handleStop();
          // Small delay to ensure stop completes
          setTimeout(() => {
            if (selectedVoice && utterance) {
              utterance.voice = selectedVoice;
              handlePlay();
            }
          }, 100);
        }
      } catch (err) {
        console.error('Error changing voice:', err);
        setError('Could not change voice. Please try again.');
      }
    },
    [voices, isPlaying, utterance, handleStop, handlePlay]
  );

  const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(e.target.value));
  }, []);

  // If speech synthesis is not supported
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="px-6 pb-6">
      <div className="bg-midnight-light/10 dark:bg-midnight-light/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-lg font-medium text-sky-700 dark:text-sky-300 mb-4">
          Listen to the Story
        </h3>

        {error && (
          <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          {!isPlaying ? (
            <Button
              onClick={handlePlay}
              className="bg-gradient-to-r from-sky to-primary hover:from-sky/90 hover:to-primary/90 text-white shadow-md rounded-lg transition-all duration-200 flex items-center justify-center"
            >
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
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button
                  onClick={handlePause}
                  className="bg-gradient-to-r from-sky to-primary hover:from-sky/90 hover:to-primary/90 text-white shadow-md rounded-lg transition-all duration-200 flex items-center justify-center"
                >
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
                </Button>
              ) : (
                <Button
                  onClick={handlePlay}
                  className="bg-gradient-to-r from-sky to-primary hover:from-sky/90 hover:to-primary/90 text-white shadow-md rounded-lg transition-all duration-200 flex items-center justify-center"
                >
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
                </Button>
              )}
              <Button
                onClick={handleStop}
                className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-500/90 hover:to-red-500/90 text-white shadow-md rounded-lg transition-all duration-200 flex items-center justify-center"
              >
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
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="w-1/2 pr-4">
            <label
              htmlFor="voice-select"
              className="block text-sm font-medium text-gray-800 dark:text-cloud mb-1"
            >
              Voice
            </label>
            <select
              id="voice-select"
              value={voice?.name || ''}
              onChange={handleVoiceChange}
              className="w-full px-3 py-2 border border-sky/30 bg-white/70 dark:bg-midnight-light/30 dark:text-cloud rounded-lg shadow-sm focus:outline-none focus:ring-sky/50 focus:border-sky/50 text-sm"
            >
              {voices.length > 0 ? (
                voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name}
                  </option>
                ))
              ) : (
                <option value="">Default Voice</option>
              )}
            </select>
          </div>

          <div className="w-1/2 pl-4">
            <label
              htmlFor="rate-slider"
              className="block text-sm font-semibold text-gray-800 dark:text-cloud mb-1"
            >
              Speed:{' '}
              <span className="text-primary-600 dark:text-primary-300">{rate.toFixed(1)}x</span>
            </label>
            <div className="relative mt-1">
              <div className="h-2 bg-sky/10 dark:bg-sky/5 rounded-lg w-full absolute"></div>
              <div
                className="h-2 bg-gradient-to-r from-sky-400 to-primary rounded-l-lg absolute"
                style={{ width: `${((rate - 0.5) / 1) * 100}%` }}
              ></div>
              <input
                id="rate-slider"
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={rate}
                onChange={handleRateChange}
                className="w-full h-2 appearance-none cursor-pointer opacity-0 z-10 relative"
              />
              <div
                className="absolute top-0 rounded-full bg-white shadow-md border border-sky/30 z-20"
                style={{
                  left: `${((rate - 0.5) / 1) * 100}%`,
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '16px',
                  marginTop: '0px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
