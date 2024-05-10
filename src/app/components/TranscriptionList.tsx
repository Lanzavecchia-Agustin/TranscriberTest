import React from 'react';
import Message from '../interfaces/Message';
import formatTime from '@/helpers/time';

// Define the props interface for the TranscriptionList component
interface TranscriptionListProps {
  currentTime: number; // current time of the audio
  setCurrentTime: (time: number) => void; // function to set the current time of the audio
  audioRef: React.RefObject<HTMLAudioElement>; // reference to the audio element
  typedTextAndAccumulatedMessages: {
    // object containing the typed text and accumulated messages
    typedText: string;
    accumulatedMessages: Message[];
  };
  listRef: React.RefObject<HTMLUListElement>; // reference to the list element
  isPlaying: boolean; // indicates if audio is currently playing
}

const TranscriptionList: React.FC<TranscriptionListProps> = ({
  currentTime,
  setCurrentTime,
  audioRef,
  typedTextAndAccumulatedMessages,
  listRef,
  isPlaying,
}) => {
  return (
    <div className="px-4" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
      {/* Render the title and message when audio is not playing and there is no text */}
      {!isPlaying &&
        typedTextAndAccumulatedMessages.accumulatedMessages.length === 0 &&
        typedTextAndAccumulatedMessages.typedText === '' && (
          <div className="text-center">
            <h1 className="text-4xl font-semibold mb-4">Transcription App</h1>
            <p className="text-gray-500">Press the play button to start</p>
          </div>
        )}

      {/* Render the list of messages if typedTextAndAccumulatedMessages is not null */}
      {typedTextAndAccumulatedMessages && (
        <div>
          {/* Render the list of messages */}
          <ul className="space-y-5" ref={listRef}>
            {typedTextAndAccumulatedMessages.accumulatedMessages.map((message, index) => (
              <li
                key={index}
                className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${
                  message.role === 'assistant'
                    ? ' text-white bg-cyan-100'
                    : message.role === 'user'
                    ? 'text-white bg-sky-900'
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => {
                  // When a message is clicked, set the current time of the audio to the start time of the message
                  if (message.start !== undefined) {
                    setCurrentTime(message.start);
                    if (audioRef.current) {
                      // Pause the audio, set the current time to the start time of the message, and play the audio
                      audioRef.current.pause();
                      audioRef.current.currentTime = message.start;
                      audioRef.current.play();
                    }
                  }
                }}
                style={{ transition: 'transform 0.2s' }}
                onMouseEnter={(e) => {
                  // On mouse enter, scale the message up
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  // On mouse leave, scale the message back down
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* Render the message content */}
                <p className="text-md font-bold uppercase">{message.role}:</p>
                {message.content}
                <p className="mt-4 text-sm text-gray-500">
                  {/* Render the start and end times of the message, or a message if the times are not available */}
                  {message.start !== undefined && message.end !== undefined
                    ? `${formatTime(message.start)} - ${formatTime(message.end)}`
                    : 'Start Time or End Time not available'}
                </p>
              </li>
            ))}
          </ul>

          {/* Render the typed text if it's not empty */}
          {typedTextAndAccumulatedMessages.typedText && (
            <p className={`py-2 my-5 px-4 rounded-lg bg-green-600 text-white`}>
              {typedTextAndAccumulatedMessages.typedText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TranscriptionList;
