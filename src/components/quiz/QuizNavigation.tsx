'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface QuizNavigationProps {
  onPrevious: () => boolean;
  onNext: () => boolean;
  onSubmit: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  allAnswered: boolean;
  isSubmitted: boolean;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  allAnswered,
  isSubmitted,
}) => {
  return (
    <div className="flex gap-3 justify-between">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious || isSubmitted}
        variant="secondary"
        className="font-semibold disabled:opacity-50 text-black"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>

      {!isLastQuestion ? (
        <Button
          onClick={onNext}
          disabled={!canGoNext || isSubmitted}
          variant="default"
          className="font-semibold text-black"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={isSubmitted}
          variant="default"
          className={`font-semibold text-black ${
            allAnswered
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          <Check className="w-4 h-4 mr-2" />
          Submit Quiz
        </Button>
      )}
    </div>
  );
};

export default QuizNavigation;
