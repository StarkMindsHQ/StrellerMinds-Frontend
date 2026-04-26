/**
 * useRandomizedExam
 *
 * A hook that shuffles question order and answer choices
 * per attempt (or per seed for deterministic reproduction).
 *
 * FILE: src/hooks/useRandomizedExam.ts
 */

import { useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionType = 'mcq' | 'multi' | 'true-false' | 'text';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq' | 'multi';
  options: string[];
  correctAnswers: string[]; // for reference / auto-grade
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
}

export type Question = McqQuestion | TrueFalseQuestion | TextQuestion;

export interface RandomizedQuestion extends Omit<McqQuestion, 'type'> {
  type: QuestionType;
  originalId: string;
  shuffledOptions?: string[]; // only for mcq / multi
}

export interface UseRandomizedExamResult {
  questions: RandomizedQuestion[];
  seed: number;
}

// ─── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Shuffle using seeded PRNG ────────────────────────────────────────────────

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Main hook ────────────────────────────────────────────────────────────────

/**
 * @param questions - Source question bank
 * @param seed      - Optional seed for deterministic shuffling (e.g. for debug/preview)
 *                    Pass `0` or omit to get a random seed each mount.
 * @param shuffleAnswers - Whether to also randomize option order (default: true)
 */
export function useRandomizedExam(
  questions: Question[],
  seed?: number,
  shuffleAnswers = true,
): UseRandomizedExamResult {
  const resolvedSeed = useMemo(
    () => seed || Math.floor(Math.random() * 2 ** 32),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Only compute once per mount
  );

  const randomized = useMemo<RandomizedQuestion[]>(() => {
    const rand = mulberry32(resolvedSeed);

    // 1. Shuffle question order
    const shuffledQuestions = seededShuffle(questions, rand);

    // 2. Ensure no duplicate IDs (sanity check)
    const seen = new Set<string>();
    const unique = shuffledQuestions.filter((q) => {
      if (seen.has(q.id)) return false;
      seen.add(q.id);
      return true;
    });

    // 3. For each MCQ/multi, optionally shuffle its options
    return unique.map((q): RandomizedQuestion => {
      const base: RandomizedQuestion = {
        ...(q as McqQuestion),
        originalId: q.id,
        options: (q as McqQuestion).options ?? [],
        correctAnswers: (q as McqQuestion).correctAnswers ?? [],
        shuffledOptions: undefined,
      };

      if ((q.type === 'mcq' || q.type === 'multi') && shuffleAnswers) {
        const mcq = q as McqQuestion;
        base.shuffledOptions = seededShuffle(mcq.options, rand);
      }

      if (q.type === 'true-false') {
        base.options = ['True', 'False'];
        base.shuffledOptions = shuffleAnswers
          ? seededShuffle(['True', 'False'], rand)
          : ['True', 'False'];
      }

      return base;
    });
  }, [questions, resolvedSeed, shuffleAnswers]);

  return { questions: randomized, seed: resolvedSeed };
}

// ─── Standalone utility (non-hook, for server-side or test use) ───────────────

/**
 * Pure function version — useful for SSR, testing, or seeding from backend.
 */
export function randomizeExam(
  questions: Question[],
  seed: number,
  shuffleAnswers = true,
): RandomizedQuestion[] {
  const rand = mulberry32(seed);
  const shuffled = seededShuffle(questions, rand);

  return shuffled.map((q): RandomizedQuestion => {
    const base: RandomizedQuestion = {
      ...(q as McqQuestion),
      originalId: q.id,
      options: (q as McqQuestion).options ?? [],
      correctAnswers: (q as McqQuestion).correctAnswers ?? [],
    };

    if ((q.type === 'mcq' || q.type === 'multi') && shuffleAnswers) {
      base.shuffledOptions = seededShuffle((q as McqQuestion).options, rand);
    }

    if (q.type === 'true-false') {
      base.options = ['True', 'False'];
      base.shuffledOptions = shuffleAnswers
        ? seededShuffle(['True', 'False'], rand)
        : ['True', 'False'];
    }

    return base;
  });
}
