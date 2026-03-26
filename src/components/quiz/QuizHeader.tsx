'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, X } from 'lucide-react';

interface QuizHeaderProps {
  title: string;
  timeLeft: number | null;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  onExit: () => void;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  title,
  timeLeft,
  progress,
  onExit,
}) => {
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{title}</h1>
          <p className="text-gray-600">
            Progress: {progress.current} of {progress.total} questions
          </p>
        </div>

        <div className="flex gap-3 items-start">
          {timeLeft !== null && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg ${
                timeLeft < 60
                  ? 'bg-red-100 text-red-700'
                  : timeLeft < 300
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          <Button
            onClick={onExit}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-red-600"
          >
            <X className="w-4 h-4 mr-1" />
            Exit
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
};

export default QuizHeader;
