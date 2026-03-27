'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizConfig } from '@/types/quiz';
import { useQuizEngine } from '@/hooks/useQuizEngine';
import QuestionDisplay from './QuestionDisplay';
import QuizHeader from './QuizHeader';
import QuizNavigation from './QuizNavigation';
import QuestionProgressBar from './QuestionProgressBar';
import QuizAlertDialog from './QuizAlertDialog';

interface QuizEngineProps {
  config: QuizConfig;
  onComplete?: (result: any) => void;
  onExit?: () => void;
  className?: string;
}

const QuizEngine: React.FC<QuizEngineProps> = ({
  config,
  onComplete,
  onExit,
  className = '',
}) => {
  const quiz = useQuizEngine(config);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    onExit?.();
  };

  // Watch for quiz result and trigger callback
  useEffect(() => {
    if (quiz.quizResult) {
      onComplete?.(quiz.quizResult);
    }
  }, [quiz.quizResult, onComplete]);

  const handleSubmit = () => {
    if (!quiz.allQuestionsAnswered) {
      setShowSubmitDialog(true);
      return;
    }

    quiz.submitQuiz();
  };

  const handleConfirmSubmit = () => {
    setShowSubmitDialog(false);
    quiz.submitQuiz();
  };

  if (!quiz.currentQuestion) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${className}`}
      >
        <p className="text-lg text-gray-500">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4 ${className}`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <QuizHeader
          title={config.title}
          timeLeft={quiz.timeLeft}
          progress={quiz.progress}
          onExit={handleExit}
        />

        {/* Timer Warning */}
        {quiz.timeLeft !== null && quiz.timeLeft < 60 && quiz.timeLeft > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
            ⏱️ Less than a minute remaining!
          </div>
        )}

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Question {quiz.progress.current} of {quiz.progress.total}
              </CardTitle>
              <div className="text-sm text-gray-500">
                {quiz.quizState.answers.length}/{quiz.progress.total} answered
              </div>
            </div>
            <QuestionProgressBar progress={quiz.progress} />
          </CardHeader>

          <CardContent className="pt-6">
            {/* Question */}
            <QuestionDisplay
              question={quiz.currentQuestion}
              selectedOptionId={quiz.currentAnswerForQuestion?.selectedOptionId}
              onSelectAnswer={quiz.selectAnswer}
              showFeedback={
                config.showFeedback || config.feedbackMode === 'instant'
              }
              isSubmitted={quiz.quizState.isSubmitted}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <QuizNavigation
          onPrevious={quiz.previousQuestion}
          onNext={quiz.nextQuestion}
          onSubmit={handleSubmit}
          canGoNext={quiz.canProceedToNext()}
          canGoPrevious={!quiz.isFirstQuestion}
          isLastQuestion={quiz.isLastQuestion}
          allAnswered={quiz.allQuestionsAnswered}
          isSubmitted={quiz.quizState.isSubmitted}
        />

        {/* Question Navigator */}
        <div className="mt-6 p-4 bg-white rounded-lg border">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Jump to question:
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {Array.from({ length: quiz.progress.total }).map((_, idx) => {
              const answered = quiz.quizState.answers.some(
                (a) => a.questionId === quiz.questions[idx]?.id,
              );

              return (
                <button
                  key={idx}
                  onClick={() => quiz.goToQuestion(idx)}
                  className={`w-full aspect-square rounded-lg font-medium text-sm transition-all ${
                    idx === quiz.quizState.currentQuestionIndex
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : answered
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={answered ? 'Answered' : 'Not answered'}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <QuizAlertDialog
        isOpen={showExitDialog}
        title="Exit Quiz?"
        description="Are you sure you want to exit? Your progress will not be saved."
        onCancel={() => setShowExitDialog(false)}
        onConfirm={confirmExit}
        confirmText="Exit Quiz"
        isDangerous
      />

      {/* Submit Confirmation Dialog */}
      <QuizAlertDialog
        isOpen={showSubmitDialog}
        title="Submit Quiz?"
        description={`You have ${quiz.progress.total - quiz.quizState.answers.length} unanswered question(s). Do you want to submit anyway?`}
        onCancel={() => setShowSubmitDialog(false)}
        onConfirm={handleConfirmSubmit}
        confirmText="Submit Anyway"
      />
    </div>
  );
};

export default QuizEngine;
