'use client';

import React from 'react';

interface QuestionProgressBarProps {
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
}

const QuestionProgressBar: React.FC<QuestionProgressBarProps> = ({ progress }) => {
  return (
    <div className="mt-3 space-y-1">
      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>Question Progress</span>
        <span>{progress.current} / {progress.total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionProgressBar;
