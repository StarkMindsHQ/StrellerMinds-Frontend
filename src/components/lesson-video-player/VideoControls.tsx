import React from 'react';

type Props = {
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onSkip: (sec: number) => void;
  onSpeedChange: (speed: number) => void;
  onFullscreen: () => void;
};

export const VideoControls: React.FC<Props> = ({
  isPlaying,
  progress,
  onPlayPause,
  onSkip,
  onSpeedChange,
  onFullscreen,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent p-4">
      {/* Top Bar */}
      <div className="flex justify-end">
        <button onClick={onFullscreen} className="text-white text-sm">
          Fullscreen
        </button>
      </div>

      {/* Center Controls */}
      <div className="flex justify-center items-center gap-4">
        <button onClick={() => onSkip(-10)} className="text-white">
          ⏪ 10s
        </button>

        <button
          onClick={onPlayPause}
          className="bg-white text-black px-4 py-2 rounded-full"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button onClick={() => onSkip(10)} className="text-white">
          10s ⏩
        </button>
      </div>

      {/* Bottom Controls */}
      <div>
        {/* Progress bar */}
        <div className="w-full bg-gray-400 h-1 rounded">
          <div
            className="bg-blue-500 h-1 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-2 text-white text-sm">
          <select
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="bg-black/50 rounded px-2"
          >
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
    </div>
  );
};
