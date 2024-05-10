import React from 'react';
import formatTime from '@/helpers/time';

// Interface for the PlaybackControls component props
interface PlaybackControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  currentTime: number;
  duration: number;
}

// PlaybackControls component
const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  togglePlay,
  currentTime,
  duration,
}) => {
  return (
    <div className="space-y-4">
      {/*  Progress bar container */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        {/*  Progress bar fill */}
        <div
          className={`bg-cyan-500 dark:bg-cyan-400 transition-all duration-500 w-full h-2`}
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
      </div>
      {/*  Time display container */}
      <div className="flex justify-between text-sm leading-6 font-medium tabular-nums">
        {/*  Current time display */}
        <div className="text-cyan-500 dark:text-slate-100">{formatTime(currentTime)}</div>
        {/*  Duration display */}
        <div className="text-slate-500 dark:text-slate-400">
          {duration ? formatTime(duration) : '1:02'}
        </div>
      </div>
      {/*  Play/pause button */}
      <button
        type="button"
        className="text-slate-900 bg-slate-100 mx-auto w-12 h-12 rounded-full  flex items-center justify-center"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={togglePlay}
      >
        {/* Play icon */}
        {isPlaying ? (
          <svg
            id="pause-icon"
            width="16"
            height="16"
            viewBox="0 0 24 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="6" height="36" rx="3" className="fill-black" />
            <rect x="18" width="6" height="36" rx="3" className="fill-black" />
          </svg>
        ) : (
          // Pause icon
          <svg
            id="play-icon"
            className="ml-[2px]"
            width="16"
            height="16"
            viewBox="0 0 31 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M29.6901 16.6608L4.00209 0.747111C2.12875 -0.476923 0.599998 0.421814 0.599998 2.75545V33.643C0.599998 35.9728 2.12747 36.8805 4.00209 35.6514L29.6901 19.7402C29.6901 19.7402 30.6043 19.0973 30.6043 18.2012C30.6043 17.3024 29.6901 16.6608 29.6901 16.6608Z"
              className="fill-black"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PlaybackControls;
