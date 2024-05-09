import React from 'react';
import Transcription from '@/components/Transcription';
import transcriptionData from '@/constants/transcription.data';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
      <div className="mb-8">
        <Transcription messages={transcriptionData} />
      </div>
    </div>
  );
};

export default Home;
