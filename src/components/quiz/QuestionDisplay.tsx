'use client';

import React, { useMemo } from 'react';
import { QuizQuestion } from '@/types/quiz';
import { Check, X } from 'lucide-react';

interface QuestionDisplayProps {
  question: QuizQuestion;
  selectedOptionId?: string;
  onSelectAnswer: (optionId: string) => void;
  showFeedback?: boolean;
  isSubmitted?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedOptionId,
  onSelectAnswer,
  showFeedback = false,
  isSubmitted = false,
}) => {
  const isAnswered = selectedOptionId !== undefined;
  const isCorrect = selectedOptionId === question.correctOptionId;

  // Show feedback only if showFeedback is true AND question is answered
  const shouldShowFeedback = showFeedback && isAnswered;

  const difficultyColor = {
    easy: 'bg-green-50 border-green-200',
    medium: 'bg-yellow-50 border-yellow-200',
    hard: 'bg-red-50 border-red-200',
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex-1">{question.question}</h2>
          {question.difficulty && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              question.difficulty === 'easy'
                ? 'bg-green-100 text-green-700'
                : question.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
          )}
        </div>

        {question.description && (
          <p className="text-gray-600 text-sm">{question.description}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = option.id === selectedOptionId;
          const isOptionCorrect = option.id === question.correctOptionId;
          const showAsCorrect = shouldShowFeedback && isOptionCorrect;
          const showAsIncorrect = shouldShowFeedback && isSelected && !isCorrect;

          let optionClasses =
            'relative w-full p-4 text-left border rounded-lg transition-all cursor-pointer ';

          if (!isAnswered || !shouldShowFeedback) {
            // Default state - not yet answered or feedback hidden
            optionClasses += isSelected
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50';
          } else {
            // Feedback state
            if (showAsCorrect) {
              optionClasses += 'border-green-500 bg-green-50 ring-2 ring-green-300';
            } else if (showAsIncorrect) {
              optionClasses += 'border-red-500 bg-red-50 ring-2 ring-red-300';
            } else if (isSelected) {
              optionClasses +=
                'border-gray-300 bg-gray-50';
            } else {
              optionClasses +=
                'border-gray-200 bg-white';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => {
                if (!isSubmitted) {
                  onSelectAnswer(option.id);
                }
              }}
              disabled={isSubmitted}
              className={optionClasses}
            >
              <div className="flex items-center gap-3">
                {/* Radio/Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : showAsCorrect
                      ? 'border-green-500 bg-green-500'
                      : showAsIncorrect
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  {showAsCorrect && <Check className="w-3 h-3 text-white" />}
                  {showAsIncorrect && <X className="w-3 h-3 text-white" />}
                </div>

                {/* Option Text */}
                <span
                  className={`flex-1 text-sm font-medium ${
                    showAsCorrect
                      ? 'text-green-700'
                      : showAsIncorrect
                      ? 'text-red-700'
                      : 'text-gray-700'
                  }`}
                >
                  {option.text}
                </span>

                {/* Feedback Icons */}
                {showAsCorrect && (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                    Correct!
                  </span>
                )}
                {showAsIncorrect && (
                  <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
                    Incorrect
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback Message */}
      {shouldShowFeedback && (
        <div
          className={`mt-6 p-4 rounded-lg border-l-4 ${
            isCorrect
              ? 'border-l-green-500 bg-green-50'
              : 'border-l-red-500 bg-red-50'
          }`}
        >
          <div className="flex gap-2 items-start">
            {isCorrect ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`font-semibold mb-1 ${
                  isCorrect ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {question.explanation && (
                <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {question.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Answer Message */}
      {!isAnswered && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
          ⚠️ Please select an answer to continue
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
