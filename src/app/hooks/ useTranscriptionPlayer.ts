import { useState, useRef, useCallback, useEffect } from 'react';
import Message from '../interfaces/Message';
import transcriptionData from '@/constants/transcription.data';

// Custom hook to manage the transcription player state and behavior
const useTranscriptionPlayer = () => {
  // State to store the typed text and accumulated messages
  const [typedTextAndAccumulatedMessages, setTypedTextAndAccumulatedMessages] = useState<{
    typedText: string;
    accumulatedMessages: Message[];
  }>({
    typedText: '',
    accumulatedMessages: [],
  });

  // Refs to store the audio element and list element
  const audioRef = useRef<HTMLAudioElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const animationFrameIdRef = useRef<number>();
  
  // State to store the current time, duration, and other flags
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Callback to synchronize the transcription with the current time
  const synchronizeTranscription = useCallback((currentTime: number) => {
    // Find the index of the message that corresponds to the current time
    const index = transcriptionData.findIndex((message) => {
      const { start, end } = message;
      return typeof start === 'number' && typeof end === 'number' && currentTime >= start && currentTime <= end;
    });
    setCurrentMessageIndex(index);
  }, []);

  // Callback to handle time updates from the audio element
  const handleTimeUpdate = useCallback(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      // Update the current time and synchronize the transcription
      setCurrentTime(audioElement.currentTime);
      synchronizeTranscription(audioElement.currentTime);
    }
  }, [synchronizeTranscription]);

  // Callback to start the typing animation
  const startTypingAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
  
    let currentMessageIndex = 0;
    let progress = 0;
    let startTime = transcriptionData[currentMessageIndex].start;
  
    const animationFrame = () => {
      if (currentMessageIndex >= transcriptionData.length) {
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current); // Cancelar la animación si hay un identificador almacenado
        }
        setIsAnimating(false);
        return;
      }
  
      const message = transcriptionData[currentMessageIndex];
      const endTime = message.end;
      const content = message?.content;
  
      const currentTime = audioRef.current?.currentTime;
      if (currentTime !== undefined && startTime !== undefined && endTime !== undefined) {
        if (currentTime >= startTime && currentTime <= endTime) {
          progress = Math.max(0, Math.min(1, (currentTime - startTime) / (endTime - startTime)));
          const typedTextLength = Math.floor(progress * content.length);
          setTypedTextAndAccumulatedMessages((prevStates) => ({
            typedText: content.substring(0, typedTextLength),
            accumulatedMessages: prevStates.accumulatedMessages,
          }));
        } else if (currentTime >= endTime) {
          progress = 0;
          currentMessageIndex++;
          startTime = transcriptionData[currentMessageIndex]?.start;
  
          setTypedTextAndAccumulatedMessages((prevStates) => ({
            typedText: '',
            accumulatedMessages: [
              ...prevStates.accumulatedMessages,
              { id: currentMessageIndex - 1, ...message },
            ],
          }));
        }
      }
      animationFrameIdRef.current = requestAnimationFrame(animationFrame); // Almacenar el identificador del próximo frame
    };
  
    // Comenzar la animación
    animationFrameIdRef.current = requestAnimationFrame(animationFrame);
  }, [audioRef, isAnimating]);
  

  // Toggle play/pause button
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (typedTextAndAccumulatedMessages.accumulatedMessages.length === 7) {
      setTypedTextAndAccumulatedMessages(() => ({
        typedText: '',
        accumulatedMessages: [],
      }));
    }
    const audioElement = audioRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.currentTime = currentTime;
        audioElement.play();
      }
    }
  };

  // Handle audio ended event
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Effect to set up audio element event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      setDuration(audioElement.duration || 0);
      audioElement.addEventListener('ended', handleAudioEnded);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        audioElement.removeEventListener('ended', handleAudioEnded);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [handleAudioEnded, handleTimeUpdate]);

// Effect to start typing animation when playing
  useEffect(() => {
    if (isPlaying) {
      startTypingAnimation();
    }
  }, [isPlaying, startTypingAnimation]);

  // Effect to scroll to the bottom of the list when new messages are added
  useEffect(() => {
    if (listRef.current) {
      listRef.current.lastElementChild?.scrollIntoView();
    }
  }, [typedTextAndAccumulatedMessages.typedText]);

  // Return the state and callbacks for use in the component
  return {
    typedTextAndAccumulatedMessages,
    audioRef,
    listRef,
    currentTime,
    setCurrentTime,
    duration,
    isPlaying,
    togglePlay,
  };
};

export default useTranscriptionPlayer;