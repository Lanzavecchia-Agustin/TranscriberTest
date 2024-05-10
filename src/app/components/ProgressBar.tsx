import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, duration }) => {
  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div
        className="bg-cyan-500 dark:bg-cyan-400 transition-all duration-500"
        style={{ width: `${progressPercentage}%`, height: '100%' }}
      ></div>
    </div>
  );
};

export default ProgressBar;
