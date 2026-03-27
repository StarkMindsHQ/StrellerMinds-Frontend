'use client';

import React, { useState } from 'react';
import QuizEngine from './QuizEngine';
import QuizResults from './QuizResults';
import { QuizConfig, QuizResult } from '@/types/quiz';

/**
 * Example Quiz Configuration
 * This demonstrates all available options for creating a quiz
 */
const EXAMPLE_QUIZ_CONFIG: QuizConfig = {
  id: 'quiz-001',
  title: 'React Hooks Fundamentals',
  description: 'Test your knowledge of React Hooks',
  passingScore: 70,
  timeLimit: 300, // 5 minutes
  shuffleQuestions: false,
  shuffleOptions: true,
  showFeedback: true,
  feedbackMode: 'instant',
  allowReview: true,
  maxAttempts: 3,
  questions: [
    {
      id: 'q1',
      question: 'What is the primary purpose of the useState hook?',
      description: 'Choose the correct answer',
      options: [
        { id: 'opt1', text: 'To manage component state' },
        { id: 'opt2', text: 'To create side effects' },
        { id: 'opt3', text: 'To optimize performance' },
        { id: 'opt4', text: 'To handle routing' },
      ],
      correctOptionId: 'opt1',
      explanation:
        'useState is a Hook that lets you add state to functional components.',
      difficulty: 'easy',
    },
    {
      id: 'q2',
      question: 'Which hook should be used for side effects in React?',
      options: [
        { id: 'opt1', text: 'useState' },
        { id: 'opt2', text: 'useEffect' },
        { id: 'opt3', text: 'useContext' },
        { id: 'opt4', text: 'useReducer' },
      ],
      correctOptionId: 'opt2',
      explanation:
        'useEffect hook is used to perform side effects in functional components.',
      difficulty: 'easy',
    },
    {
      id: 'q3',
      question: 'What is memoization used for in React?',
      options: [
        { id: 'opt1', text: 'To store data in localStorage' },
        { id: 'opt2', text: 'To prevent unnecessary re-renders' },
        { id: 'opt3', text: 'To manage global state' },
        { id: 'opt4', text: 'To create animations' },
      ],
      correctOptionId: 'opt2',
      explanation:
        'Memoization (via React.memo or useMemo) helps prevent unnecessary re-renders by caching computed values.',
      difficulty: 'medium',
    },
    {
      id: 'q4',
      question: 'How does useCallback differ from useMemo?',
      options: [
        {
          id: 'opt1',
          text: 'useCallback memoizes a function, useMemo memoizes a computed value',
        },
        { id: 'opt2', text: 'They are exactly the same' },
        {
          id: 'opt3',
          text: 'useCallback is for styling, useMemo is for logic',
        },
        {
          id: 'opt4',
          text: 'useMemo is deprecated in favor of useCallback',
        },
      ],
      correctOptionId: 'opt1',
      explanation:
        'useCallback returns a memoized callback function, while useMemo returns a memoized computed value.',
      difficulty: 'hard',
    },
    {
      id: 'q5',
      question: 'What is the dependency array in useEffect used for?',
      options: [
        { id: 'opt1', text: 'To specify when the effect should run' },
        { id: 'opt2', text: 'To import dependencies' },
        { id: 'opt3', text: 'To define state variables' },
        { id: 'opt4', text: 'To cache component props' },
      ],
      correctOptionId: 'opt1',
      explanation:
        "The dependency array tells React when to run the effect. If it's empty, the effect runs once on mount. If it includes values, the effect runs when those values change.",
      difficulty: 'medium',
    },
  ],
};

interface QuizDemoState {
  status: 'initial' | 'in-progress' | 'completed';
  result?: QuizResult;
  quizConfig: QuizConfig;
}

const QuizEngineDemoPage: React.FC = () => {
  const [demoState, setDemoState] = useState<QuizDemoState>({
    status: 'initial',
    quizConfig: EXAMPLE_QUIZ_CONFIG,
  });

  const handleStartQuiz = (configOverrides?: Partial<QuizConfig>) => {
    setDemoState((prev) => ({
      ...prev,
      status: 'in-progress',
      quizConfig: {
        ...prev.quizConfig,
        ...configOverrides,
      },
    }));
  };

  const handleQuizComplete = (result: QuizResult) => {
    setDemoState((prev) => ({
      ...prev,
      status: 'completed',
      result,
    }));
  };

  const handleRetakeQuiz = () => {
    setDemoState((prev) => ({
      ...prev,
      status: 'in-progress',
    }));
  };

  const handleExitQuiz = () => {
    setDemoState({
      status: 'initial',
      quizConfig: EXAMPLE_QUIZ_CONFIG,
    });
  };

  // In-Progress State
  if (demoState.status === 'in-progress') {
    return (
      <QuizEngine
        config={demoState.quizConfig}
        onComplete={handleQuizComplete}
        onExit={handleExitQuiz}
      />
    );
  }

  // Completed State
  if (demoState.status === 'completed' && demoState.result) {
    return (
      <QuizResults
        result={demoState.result}
        onRetake={handleRetakeQuiz}
        onExit={handleExitQuiz}
        showDetailedResults={true}
      />
    );
  }

  // Initial State - Quiz Selection/Start Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Quiz Engine Demo
          </h1>
          <p className="text-xl text-gray-600">
            Take a quiz to test your knowledge. Your score will be calculated
            instantly!
          </p>
        </div>

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiz Card 1: Standard Mode */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600" />
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {EXAMPLE_QUIZ_CONFIG.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {EXAMPLE_QUIZ_CONFIG.description}
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Questions:</span>{' '}
                  {EXAMPLE_QUIZ_CONFIG.questions.length}
                </p>
                <p>
                  <span className="font-semibold">Time Limit:</span>{' '}
                  {EXAMPLE_QUIZ_CONFIG.timeLimit
                    ? `${EXAMPLE_QUIZ_CONFIG.timeLimit / 60} min`
                    : 'No limit'}
                </p>
                <p>
                  <span className="font-semibold">Passing Score:</span>{' '}
                  {EXAMPLE_QUIZ_CONFIG.passingScore}%
                </p>
                <p>
                  <span className="font-semibold">Instant Feedback:</span> Yes
                </p>
              </div>

              <button
                onClick={() => handleStartQuiz()}
                className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>

          {/* Quiz Card 2: Speed Mode */}
          <div className="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-32 bg-gradient-to-r from-amber-500 to-amber-600" />
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Speed Challenge
                </h3>
                <p className="text-gray-600 mt-2">
                  Short time limit to test quick thinking
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Questions:</span> Same quiz
                </p>
                <p>
                  <span className="font-semibold">Time Limit:</span> 2 minutes
                </p>
                <p>
                  <span className="font-semibold">Passing Score:</span> 80%
                </p>
                <p>
                  <span className="font-semibold">Shuffled:</span> Yes
                </p>
              </div>

              <button
                onClick={() =>
                  handleStartQuiz({
                    timeLimit: 120,
                    passingScore: 80,
                    shuffleQuestions: true,
                    title: 'Speed Challenge - React Hooks',
                  })
                }
                className="w-full mt-6 px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors"
              >
                Start Speed Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEngineDemoPage;
