import React from 'react';
import Message from '../interfaces/Message';

interface TranscriptionProps {
  messages: Message[];
}

const Transcription: React.FC<TranscriptionProps> = ({ messages }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-md">
      {messages.map((message, index) => (
        <div key={index} className={message.role === 'agent' ? 'text-blue-300' : 'text-green-300'}>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Transcription;
