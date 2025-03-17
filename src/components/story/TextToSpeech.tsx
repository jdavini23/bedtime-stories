'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from '../common/Button';
import { logger } from '@/utils/loggerInstance';
import { cn } from '@/lib/utils';
import { themeClasses } from '@/config/theme';
import { Card } from '@/components/common/Card';
import { colorOpacityClasses } from '@/utils/colors';
import { PauseIcon, PlayIcon, StopIcon, RotateCw } from 'lucide-react';

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
    // Return early if window is undefined
    if (typeof window === 'undefined') {
      return;
    }

    // Return early if speech synthesis is not supported
    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis not supported in your browser.');
      return;
    }

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
            logger.info('No voices available, using default voice');
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
                logger.error('Error setting voice:', { error: voiceErr });
              }
            }
          }
        } catch (err) {
          logger.error('Error loading voices:', { error: err });
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
        logger.error('Speech synthesis error:', { error: event });
        setError('Error playing audio. Please try again or use a different voice.');
        setIsPlaying(false);
        setIsPaused(false);

        // Try to recover by canceling any ongoing speech
        try {
          window.speechSynthesis.cancel();
        } catch (cancelErr) {
          logger.error('Error canceling speech after error:', { error: cancelErr });
        }
      };

      // Cleanup
      return () => {
        try {
          window.speechSynthesis.cancel();
        } catch (err) {
          logger.error('Error during cleanup:', { error: err });
        }
      };
    } catch (err) {
      logger.error('Error initializing speech synthesis:', { error: err });
      setError('Speech synthesis not available on your browser.');
    }
  }, [text, rate]);

  // Update utterance when voice or rate changes
  useEffect(() => {
    if (utterance && voice) {
      try {
        utterance.voice = voice;
        utterance.rate = rate;
      } catch (err) {
        logger.error('Error updating utterance:', { error: err });
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
            logger.error('Error setting voice before speaking:', { error: voiceErr });
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
      logger.error('Error playing speech:', { error: err });
      setError('Could not play audio. Please try again or use a different voice.');
    }
  }, [utterance, text, isPaused, voice, rate]);

  const handlePause = useCallback(() => {
    try {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } catch (err) {
      logger.error('Error pausing speech:', { error: err });
      setError('Could not pause audio. Please try again.');
    }
  }, []);

  const handleStop = useCallback(() => {
    try {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    } catch (err) {
      logger.error('Error stopping speech:', { error: err });
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
        logger.error('Error changing voice:', { error: err });
        setError('Could not change voice. Please try again.');
      }
    },
    [voices, isPlaying, utterance, handleStop, handlePlay]
  );

  const handleRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const newRate = parseFloat(e.target.value);
        setRate(newRate);

        // If currently playing, update the rate immediately
        if (utterance && isPlaying) {
          utterance.rate = newRate;
        }
      } catch (err) {
        logger.error('Error changing rate:', { error: err });
        setError('Could not change playback speed. Please try again.');
      }
    },
    [utterance, isPlaying]
  );

  const handleRestart = useCallback(() => {
    try {
      handleStop();
      // Small delay to ensure stop completes
      setTimeout(() => {
        handlePlay();
      }, 100);
    } catch (err) {
      logger.error('Error restarting speech:', { error: err });
      setError('Could not restart audio. Please try again.');
    }
  }, [handleStop, handlePlay]);

  // If speech synthesis is not supported
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <Card className="p-6 space-y-6">
      {error && <div className="text-error text-sm p-4 rounded-lg bg-error/10">{error}</div>}

      <div className="flex gap-2 mt-4">
        <Button
          onClick={isPlaying && !isPaused ? handlePause : handlePlay}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            isPlaying && !isPaused
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          )}
          disabled={!voicesLoaded}
        >
          {isPlaying && !isPaused ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
          {isPlaying && !isPaused ? 'Pause' : 'Play'}
        </Button>

        <Button
          onClick={handleStop}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error hover:bg-error-dark text-white"
          disabled={!isPlaying && !isPaused}
        >
          <StopIcon className="w-5 h-5" />
          Stop
        </Button>

        <Button
          onClick={handleRestart}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cloud-400 hover:bg-cloud-500 text-midnight-900"
          disabled={!isPlaying && !isPaused}
        >
          <RotateCw className="w-5 h-5" />
          Restart
        </Button>
      </div>

      {voices.length > 0 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-text-secondary dark:text-text-primary mb-1">
            Voice
          </label>
          <select
            value={voice?.name || ''}
            onChange={handleVoiceChange}
            className="w-full px-3 py-2 border border-border bg-background/70 dark:bg-midnight/30 dark:text-text-primary rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>

          <div>
            <label className="block text-sm font-semibold text-text-secondary dark:text-text-primary mb-1">
              Speed:{' '}
              <span className="text-primary dark:text-primary-light">{rate.toFixed(1)}x</span>
            </label>

            <div className="relative pt-1">
              <div className="h-2 bg-sky/10 dark:bg-sky/5 rounded-lg w-full absolute"></div>
              <div
                className="h-2 bg-gradient-to-r from-sky to-primary rounded-l-lg absolute"
                style={{ width: `${(rate / 2) * 100}%` }}
              ></div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={handleRateChange}
                className="absolute top-0 rounded-full bg-background shadow-dreamy border border-border z-20"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TextToSpeech;
