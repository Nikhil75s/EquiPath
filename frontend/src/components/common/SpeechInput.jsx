import React, { useState, useEffect, useRef } from 'react';
import { useAnnouncer } from './AriaLiveRegion';

export default function SpeechInput({ onTranscript, placeholder = 'Dictate your response...' }) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const announce = useAnnouncer();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      announce('Listening for dictation. Speak now.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      announce(`Captured: ${transcript}`);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      announce(`Microphone error: ${event.error}`, 'assertive');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript, announce]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    }
  };

  if (!supported) return null; // Don't render if browser doesn't support Web Speech API

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500
        ${isListening 
          ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' 
          : 'bg-surface-100 text-surface-600 hover:bg-primary-100 hover:text-primary-600'
        }`}
      aria-label={isListening ? 'Stop recording' : 'Start dictation'}
      aria-pressed={isListening}
      title={isListening ? 'Stop recording' : placeholder}
    >
      {isListening ? (
        // Stop icon (Square)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <rect x="5" y="5" width="10" height="10" />
        </svg>
      ) : (
        // Mic icon
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-2a5 5 0 01-10 0H3a7.001 7.001 0 006 6.93V17H6v2h8v-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
