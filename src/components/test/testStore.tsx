'use client';

import React, { createContext, useReducer, useContext } from 'react';
import { mockQuestions } from './mockQuestions';

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

type State = {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number>;
  timeLeft: number;
  isSubmitted: boolean;
};

type Action =
  | {
      type: 'SELECT_ANSWER';
      payload: { questionId: number; optionIndex: number };
    }
  | { type: 'GO_TO_QUESTION'; payload: number }
  | { type: 'TICK' }
  | { type: 'SUBMIT' }
  | { type: 'RESET' };

const TestContext = createContext<any>(null);
const TIME_PER_QUESTION = 25;

const initialState: State = {
  questions: mockQuestions,
  currentIndex: 0,
  answers: {},
  timeLeft: mockQuestions.length * TIME_PER_QUESTION,
  isSubmitted: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.optionIndex,
        },
      };

    case 'GO_TO_QUESTION':
      return { ...state, currentIndex: action.payload };

    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };

    case 'SUBMIT':
      return { ...state, isSubmitted: true };

    case 'RESET':
      return {
        questions: mockQuestions,
        currentIndex: 0,
        answers: {},
        timeLeft: mockQuestions.length * TIME_PER_QUESTION,
        isSubmitted: false,
      };

    default:
      return state;
  }
}

export function TestProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TestContext.Provider value={{ state, dispatch }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used inside TestProvider');
  }
  return context;
}

// helper used by result screen to tally correct answers
export function calculateScore(state: State): number {
  return state.questions.reduce((sum, q) => {
    const answer = state.answers[q.id];
    return sum + (answer === q.correctAnswer ? 1 : 0);
  }, 0);
}
