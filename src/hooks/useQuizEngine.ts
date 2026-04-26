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
  | { type: 'SELECT_ANSWER'; payload: { questionId: string; optionIds: string[]; confidence: number } }
  | { type: 'TOGGLE_OPTION'; payload: { questionId: string; optionId: string } } // For multi-select
  | { type: 'SET_CONFIDENCE'; payload: { questionId: string; confidence: number } }
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
        (a) => a.questionId === action.payload.questionId,
      );

      let newAnswers = [...state.answers];
      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = {
          ...newAnswers[existingAnswerIndex],
          selectedOptionIds: action.payload.optionIds,
          answeredAt: Date.now(),
        };
      } else {
        newAnswers.push({
          questionId: action.payload.questionId,
          selectedOptionIds: action.payload.optionIds,
          answeredAt: Date.now(),
        });
      }

      return {
        ...state,
        answers: newAnswers,
      };
    }
    case 'TOGGLE_OPTION': {
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId,
      );

      let newAnswers = [...state.answers];
      const currentSelections = existingAnswerIndex >= 0 
        ? [...newAnswers[existingAnswerIndex].selectedOptionIds] 
        : [];

      const optionIndex = currentSelections.indexOf(action.payload.optionId);
      if (optionIndex >= 0) {
        // Option is already selected, remove it
        currentSelections.splice(optionIndex, 1);
      } else {
        // Option is not selected, add it
        currentSelections.push(action.payload.optionId);
      }

      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = {
          ...newAnswers[existingAnswerIndex],
          selectedOptionIds: currentSelections,
          answeredAt: Date.now(),
        };
      } else {
        newAnswers.push({
          questionId: action.payload.questionId,
          selectedOptionIds: currentSelections,
          answeredAt: Date.now(),
        });
      }

      return {
        ...state,
        answers: newAnswers,
      };
    }
    case 'SET_CONFIDENCE': {
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId,
      );

      let newAnswers = [...state.answers];
      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = {
          ...newAnswers[existingAnswerIndex],
          confidence: action.payload.confidence,
        };
      } else {
        // If no answer exists yet, create one with just confidence
        newAnswers.push({
          questionId: action.payload.questionId,
          selectedOptionIds: [],
          confidence: action.payload.confidence,
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
    if (
      !quizConfig.timeLimit ||
      quizState.isSubmitted ||
      quizState.status !== 'in-progress'
    ) {
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
    (a) => a.questionId === currentQuestion?.id,
  );

   const handleSelectAnswer = useCallback(
     (optionIds: string[]) => {
       if (!currentQuestion || quizState.isSubmitted) return;

       dispatch({
         type: 'SELECT_ANSWER',
         payload: {
           questionId: currentQuestion.id,
           optionIds,
         },
       });
     },
     [currentQuestion, quizState.isSubmitted],
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
     [questions.length],
   );

   const handleSetConfidence = useCallback(
     (confidence: number) => {
       if (!currentQuestion || quizState.isSubmitted) return;
       
       // Clamp confidence between 0 and 100
       const clampedConfidence = Math.max(0, Math.min(100, confidence));
       
       dispatch({
         type: 'SET_CONFIDENCE',
         payload: {
           questionId: currentQuestion.id,
           confidence: clampedConfidence,
         },
       });
     },
     [currentQuestion, quizState.isSubmitted],
   );

   const calculateResult = useCallback((): QuizResult => {
     const passingScore = quizConfig.passingScore ?? 70;
     const totalQuestions = questions.length;
     let totalScore = 0;
     let maxScore = 0;
     let correctCount = 0; // Questions with exact correct answers
     let partialCorrectCount = 0; // Questions with partial credit

     const detailedResults: QuestionResult[] = questions.map((question) => {
       const answer = quizState.answers.find(
         (a) => a.questionId === question.id,
       );
       
       // Default values
       let selectedOptionIds = answer?.selectedOptionIds || [];
       let confidence = answer?.confidence || 0;
       
       // Determine correct option IDs based on question type
       const correctOptionIds = Array.isArray(question.correctOptionId)
         ? question.correctOptionId
         : [question.correctOptionId];
       
       let isCorrect = false;
       let partialScore = 0;
       let questionMaxPoints = 1; // Default to 1 point per question
       
       // Calculate points based on grading mode
       switch (question.gradingMode) {
         case 'partial':
         case 'partial-penalty':
           // For multi-select questions with partial scoring
           const correctSelected = selectedOptionIds.filter(id => 
             correctOptionIds.includes(id)
           );
           const incorrectSelected = selectedOptionIds.filter(id => 
             !correctOptionIds.includes(id)
           );
           
           // Base points per correct option
           const pointsPerCorrect = question.pointsPerOption ?? 1;
           const penaltyPerIncorrect = question.penaltyPerIncorrectOption ?? 0;
           
           // Calculate score
           partialScore = (correctSelected.length * pointsPerCorrect) - 
                         (incorrectSelected.length * penaltyPerIncorrect);
                         
           // Ensure score doesn't go below 0 for penalty mode
           if (question.gradingMode === 'partial-penalty' && partialScore < 0) {
             partialScore = 0;
           }
           
           // Calculate max points for this question
           questionMaxPoints = correctOptionIds.length * (question.pointsPerOption ?? 1);
           
           // Consider correct if all correct options selected and no incorrect ones (for exact match)
           isCorrect = (correctSelected.length === correctOptionIds.length && 
                       incorrectSelected.length === 0);
           break;
           
         case 'exact':
         default:
           // Traditional exact match scoring
           const isCorrectOption = 
             selectedOptionIds.length === 1 && 
             selectedOptionIds[0] === question.correctOptionId;
           
           isCorrect = isCorrectOption;
           partialScore = isCorrect ? 1 : 0;
           questionMaxPoints = 1;
           break;
       }
       
       // Update totals
       totalScore += partialScore;
       maxScore += questionMaxPoints;
       
       if (isCorrect) correctCount++;
       if (partialScore > 0 && partialScore < questionMaxPoints) partialCorrectCount++;
       
       return {
         questionId: question.id,
         question: question.question,
         selectedOptionIds,
         correctOptionIds,
         isCorrect,
         partialScore,
         maxPoints: questionMaxPoints,
         confidence,
         explanation: question.explanation,
       };
     });

     const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
     const passed = percentage >= passingScore;

     // Calculate average confidence
     const answeredQuestions = quizState.answers.filter(a => a.selectedOptionIds.length > 0);
     const averageConfidence = answeredQuestions.length > 0 
       ? answeredQuestions.reduce((sum, ans) => sum + (ans.confidence || 0), 0) / answeredQuestions.length
       : 0;

     const result: QuizResult = {
       quizId: quizConfig.id,
       score: totalScore,
       maxScore,
       percentage: Math.round(percentage),
       passed,
       totalQuestions,
       correctAnswers: correctCount,
       partialCorrectAnswers: partialCorrectCount,
       startedAt: quizState.startedAt,
       completedAt: quizState.endedAt || Date.now(),
       timeSpent: Math.floor(
         ((quizState.endedAt || Date.now()) - quizState.startedAt) / 1000,
       ),
       answers: quizState.answers,
       detailedResults,
       averageConfidence: Math.round(averageConfidence),
     };

     return result;
   }, [
     quizConfig,
     quizState.answers,
     quizState.startedAt,
     quizState.endedAt,
     questions,
   ]);

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
     setConfidence: handleSetConfidence,

     // Validation
     canProceedToNext,
     isLastQuestion: quizState.currentQuestionIndex === questions.length - 1,
     isFirstQuestion: quizState.currentQuestionIndex === 0,
     allQuestionsAnswered: quizState.answers.length === questions.length,
   };
}
