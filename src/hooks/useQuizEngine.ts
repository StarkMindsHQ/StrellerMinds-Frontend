'use client';

import { useState, useCallback, useReducer, useEffect } from 'react';
import {
  QuizConfig,
  QuizState,
  QuizAnswer,
  QuizResult,
  QuestionResult,
  QuizQuestion,
} from '@/types/quiz';

type QuizAction =
  | { type: 'INITIALIZE'; payload: { quizConfig: QuizConfig } }
  | { type: 'SELECT_ANSWER'; payload: { questionId: string; optionId: string } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'GO_TO_QUESTION'; payload: number }
  | { type: 'SUBMIT_QUIZ' }
  | { type: 'PAUSE_QUIZ' }
  | { type: 'RESUME_QUIZ' }
  | { type: 'RESET_QUIZ' };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        quizId: action.payload.quizConfig.id,
        currentQuestionIndex: 0,
        answers: [],
        startedAt: Date.now(),
        isSubmitted: false,
        status: 'in-progress',
      };

    case 'SELECT_ANSWER': {
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );

      let newAnswers = [...state.answers];
      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = {
          ...newAnswers[existingAnswerIndex],
          selectedOptionId: action.payload.optionId,
          answeredAt: Date.now(),
        };
      } else {
        newAnswers.push({
          questionId: action.payload.questionId,
          selectedOptionId: action.payload.optionId,
          answeredAt: Date.now(),
        });
      }

      return {
        ...state,
        answers: newAnswers,
      };
    }

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };

    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
      };

    case 'GO_TO_QUESTION':
      return {
        ...state,
        currentQuestionIndex: action.payload,
      };

    case 'SUBMIT_QUIZ':
      return {
        ...state,
        isSubmitted: true,
        endedAt: Date.now(),
        status: 'submitted',
      };

    case 'PAUSE_QUIZ':
      return {
        ...state,
        status: 'paused',
      };

    case 'RESUME_QUIZ':
      return {
        ...state,
        status: 'in-progress',
      };

    case 'RESET_QUIZ':
      return {
        quizId: state.quizId,
        currentQuestionIndex: 0,
        answers: [],
        startedAt: Date.now(),
        isSubmitted: false,
        status: 'in-progress',
      };

    default:
      return state;
  }
}

export function useQuizEngine(quizConfig: QuizConfig) {
  const [quizState, dispatch] = useReducer(quizReducer, {
    quizId: quizConfig.id,
    currentQuestionIndex: 0,
    answers: [],
    startedAt: 0,
    isSubmitted: false,
    status: 'not-started',
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Initialize quiz
  useEffect(() => {
    let shuffledQuestions = [...quizConfig.questions];

    if (quizConfig.shuffleQuestions) {
      shuffledQuestions = shuffledQuestions.sort(() => Math.random() - 0.5);
    }

    // Shuffle options if needed
    if (quizConfig.shuffleOptions) {
      shuffledQuestions = shuffledQuestions.map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      }));
    }

    setQuestions(shuffledQuestions);

    if (quizConfig.timeLimit && quizState.status === 'not-started') {
      setTimeLeft(quizConfig.timeLimit);
      dispatch({
        type: 'INITIALIZE',
        payload: { quizConfig },
      });
    } else if (quizState.status === 'not-started') {
      dispatch({
        type: 'INITIALIZE',
        payload: { quizConfig },
      });
    }
  }, [quizConfig, quizState.status]);

  // Timer countdown
  useEffect(() => {
    if (!quizConfig.timeLimit || quizState.isSubmitted || quizState.status !== 'in-progress') {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          // Auto-submit when time is up
          dispatch({ type: 'SUBMIT_QUIZ' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizConfig.timeLimit, quizState.isSubmitted, quizState.status]);

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const currentAnswerForQuestion = quizState.answers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  const handleSelectAnswer = useCallback(
    (optionId: string) => {
      if (!currentQuestion || quizState.isSubmitted) return;

      dispatch({
        type: 'SELECT_ANSWER',
        payload: {
          questionId: currentQuestion.id,
          optionId,
        },
      });
    },
    [currentQuestion, quizState.isSubmitted]
  );

  const canProceedToNext = useCallback((): boolean => {
    return currentAnswerForQuestion !== undefined;
  }, [currentAnswerForQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (!canProceedToNext()) {
      return false;
    }

    if (quizState.currentQuestionIndex < questions.length - 1) {
      dispatch({ type: 'NEXT_QUESTION' });
      return true;
    }

    return false;
  }, [canProceedToNext, quizState.currentQuestionIndex, questions.length]);

  const handlePreviousQuestion = useCallback(() => {
    if (quizState.currentQuestionIndex > 0) {
      dispatch({ type: 'PREVIOUS_QUESTION' });
      return true;
    }
    return false;
  }, [quizState.currentQuestionIndex]);

  const handleGoToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        dispatch({ type: 'GO_TO_QUESTION', payload: index });
        return true;
      }
      return false;
    },
    [questions.length]
  );

  const calculateResult = useCallback((): QuizResult => {
    const passingScore = quizConfig.passingScore ?? 70;
    const totalQuestions = questions.length;
    let correctCount = 0;

    const detailedResults: QuestionResult[] = questions.map((question) => {
      const answer = quizState.answers.find((a) => a.questionId === question.id);
      const isCorrect = answer?.selectedOptionId === question.correctOptionId;

      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        question: question.question,
        selectedOptionId: answer?.selectedOptionId || '',
        correctOptionId: question.correctOptionId,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const score = correctCount;
    const percentage = (correctCount / totalQuestions) * 100;
    const passed = percentage >= passingScore;

    const result: QuizResult = {
      quizId: quizConfig.id,
      score,
      percentage: Math.round(percentage),
      passed,
      totalQuestions,
      correctAnswers: correctCount,
      startedAt: quizState.startedAt,
      completedAt: quizState.endedAt || Date.now(),
      timeSpent: Math.floor(
        ((quizState.endedAt || Date.now()) - quizState.startedAt) / 1000
      ),
      answers: quizState.answers,
      detailedResults,
    };

    return result;
  }, [quizConfig, quizState.answers, quizState.startedAt, quizState.endedAt, questions]);

  const handleSubmitQuiz = useCallback(() => {
    if (quizState.isSubmitted) return false;

    dispatch({ type: 'SUBMIT_QUIZ' });
    const result = calculateResult();
    setQuizResult(result);

    return true;
  }, [quizState.isSubmitted, calculateResult]);

  const handlePauseQuiz = useCallback(() => {
    dispatch({ type: 'PAUSE_QUIZ' });
  }, []);

  const handleResumeQuiz = useCallback(() => {
    dispatch({ type: 'RESUME_QUIZ' });
  }, []);

  const handleResetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
    setQuizResult(null);
    if (quizConfig.timeLimit) {
      setTimeLeft(quizConfig.timeLimit);
    }
  }, [quizConfig.timeLimit]);

  const progress = {
    current: quizState.currentQuestionIndex + 1,
    total: questions.length,
    percentage: (quizState.answers.length / questions.length) * 100,
  };

  return {
    // State
    quizState,
    questions,
    currentQuestion,
    currentAnswerForQuestion,
    quizResult,
    timeLeft,
    progress,

    // Actions
    selectAnswer: handleSelectAnswer,
    nextQuestion: handleNextQuestion,
    previousQuestion: handlePreviousQuestion,
    goToQuestion: handleGoToQuestion,
    submitQuiz: handleSubmitQuiz,
    pauseQuiz: handlePauseQuiz,
    resumeQuiz: handleResumeQuiz,
    resetQuiz: handleResetQuiz,

    // Validation
    canProceedToNext,
    isLastQuestion: quizState.currentQuestionIndex === questions.length - 1,
    isFirstQuestion: quizState.currentQuestionIndex === 0,
    allQuestionsAnswered: quizState.answers.length === questions.length,
  };
}
