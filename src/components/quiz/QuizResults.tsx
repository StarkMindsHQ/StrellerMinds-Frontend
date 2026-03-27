'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizResult } from '@/types/quiz';
import { Check, X, Clock, Award, TrendingUp } from 'lucide-react';

interface QuizResultsProps {
  result: QuizResult;
  onRetake?: () => void;
  onExit?: () => void;
  showDetailedResults?: boolean;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  onRetake,
  onExit,
  showDetailedResults = true,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-50 border-green-200';
    if (percentage >= 70) return 'bg-blue-50 border-blue-200';
    if (percentage >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getPerformanceText = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding!';
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 70) return 'Good Job!';
    if (percentage >= 60) return 'Keep Trying!';
    return 'Try Again!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score Card */}
        <Card
          className={`border-2 ${getScoreBgColor(result.percentage)} ${
            result.passed ? 'ring-2 ring-green-300' : 'ring-2 ring-red-300'
          }`}
        >
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              {/* Status Icon */}
              <div className="flex justify-center">
                {result.passed ? (
                  <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                    <X className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              {/* Status Text */}
              <div>
                <p
                  className={`text-4xl font-bold ${getScoreColor(result.percentage)}`}
                >
                  {result.percentage}%
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {getPerformanceText(result.percentage)}
                </p>
                <p
                  className={`text-lg font-semibold mt-2 ${
                    result.passed ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {result.passed ? '✓ Quiz Passed' : '✗ Quiz Failed'}
                </p>
              </div>

              {/* Score Details */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {result.correctAnswers}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-600">
                    {result.totalQuestions - result.correctAnswers}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Incorrect</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-600">
                    {result.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Time Spent</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatTime(result.timeSpent)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-xl font-bold text-gray-800">
                    {result.score}/{result.totalQuestions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-xl font-bold text-gray-800">
                    {Math.round(
                      (result.correctAnswers / result.totalQuestions) * 100,
                    )}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        {showDetailedResults && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800">Question Review</h3>

            {result.detailedResults.map((questionResult, idx) => (
              <Card
                key={questionResult.questionId}
                className={`border-l-4 ${
                  questionResult.isCorrect
                    ? 'border-l-green-500 bg-green-50'
                    : 'border-l-red-500 bg-red-50'
                }`}
              >
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Question Number & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          Question {idx + 1}: {questionResult.question}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                          questionResult.isCorrect
                            ? 'bg-green-200 text-green-700'
                            : 'bg-red-200 text-red-700'
                        }`}
                      >
                        {questionResult.isCorrect ? (
                          <>
                            <Check className="w-4 h-4" />
                            Correct
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Incorrect
                          </>
                        )}
                      </div>
                    </div>

                    {/* Explanation */}
                    {questionResult.explanation && (
                      <div className="p-3 bg-white rounded border border-gray-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Explanation: </span>
                          {questionResult.explanation}
                        </p>
                      </div>
                    )}

                    {/* Answer Info */}
                    {!questionResult.isCorrect && (
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <span className="font-semibold text-red-600">
                            Your answer:
                          </span>{' '}
                          <span>Option {questionResult.selectedOptionId}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-green-600">
                            Correct answer:
                          </span>{' '}
                          <span>Option {questionResult.correctOptionId}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center pt-4">
          {onRetake && (
            <Button
              onClick={onRetake}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Retake Quiz
            </Button>
          )}
          {onExit && (
            <Button onClick={onExit} variant="outline">
              Exit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
