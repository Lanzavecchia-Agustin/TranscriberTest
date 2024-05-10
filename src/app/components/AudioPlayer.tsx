'use client';
import React from 'react';
import TranscriptionList from './TranscriptionList';
import PlaybackControls from './PlaybackControls';
import ProgressBar from './ProgressBar';
import LogoAndTitle from './LogoAndTitle';
import useTranscriptionPlayer from '@/hooks/ useTranscriptionPlayer';

const AudioPlayer = () => {
  const {
    typedTextAndAccumulatedMessages,
    audioRef,
    listRef,
    currentTime,
    setCurrentTime,
    duration,
    isPlaying,
    togglePlay,
  } = useTranscriptionPlayer();

  return (
    <div className="w-full flex flex-1 flex-col justify-between">
      <LogoAndTitle />
      <TranscriptionList
        isPlaying={isPlaying}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        audioRef={audioRef}
        typedTextAndAccumulatedMessages={typedTextAndAccumulatedMessages}
        listRef={listRef}
      />
      <ProgressBar currentTime={currentTime} duration={duration} />
      <PlaybackControls
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        currentTime={currentTime}
        duration={duration}
      />
      <audio ref={audioRef} src="/audio/TestCall.wav" />
    </div>
  );
};

export default AudioPlayer;
