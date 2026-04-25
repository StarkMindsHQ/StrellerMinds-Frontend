'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  AMASession,
  AMAQuestion,
  AMASessionStatus,
  AMAHost,
} from '@/types/ama';
import { toast } from 'sonner';

// ── Mock data helpers ────────────────────────────────────────────────────────

const MOCK_HOST: AMAHost = {
  id: 'host-1',
  name: 'Dr. Sarah Chen',
  avatar: '/avatars/sarah.jpg',
  role: 'Blockchain Instructor',
  bio: 'Expert in Stellar smart contracts with 10+ years of experience in distributed systems.',
};

function generateMockQuestions(sessionId: string): AMAQuestion[] {
  const questions: AMAQuestion[] = [
    {
      id: 'q-1',
      sessionId,
      authorId: 'user-2',
      authorName: 'Miguel Rodriguez',
      authorAvatar: '/avatars/miguel.jpg',
      text: 'How does Stellar consensus differ from proof-of-work blockchains?',
      status: 'answered',
      upvotes: 12,
      upvotedBy: ['user-3', 'user-4', 'user-5'],
      createdAt: Date.now() - 600_000,
      answeredAt: Date.now() - 540_000,
      answer:
        'Stellar uses the Stellar Consensus Protocol (SCP) which is based on Federated Byzantine Agreement. Unlike PoW, it doesn\'t require mining and achieves consensus in 3-5 seconds with minimal energy usage.',
      answeredBy: 'host-1',
      isPinned: true,
    },
    {
      id: 'q-2',
      sessionId,
      authorId: 'user-3',
      authorName: 'Aisha Patel',
      authorAvatar: '/avatars/aisha.jpg',
      text: 'What are the best practices for writing Soroban smart contracts?',
      status: 'answered',
      upvotes: 8,
      upvotedBy: ['user-2', 'user-4'],
      createdAt: Date.now() - 500_000,
      answeredAt: Date.now() - 420_000,
      answer:
        'Key practices include: keeping contracts small and focused, using proper error handling with Result types, writing comprehensive tests, and leveraging Soroban SDK utilities for common patterns.',
      answeredBy: 'host-1',
      isPinned: false,
    },
    {
      id: 'q-3',
      sessionId,
      authorId: 'user-4',
      authorName: 'James Okonkwo',
      text: 'Can you explain how anchors work in the Stellar ecosystem?',
      status: 'pending',
      upvotes: 5,
      upvotedBy: ['user-2'],
      createdAt: Date.now() - 300_000,
      isPinned: false,
    },
    {
      id: 'q-4',
      sessionId,
      authorId: 'user-5',
      authorName: 'Lena Kim',
      text: 'What is the future of DeFi on Stellar?',
      status: 'pending',
      upvotes: 3,
      upvotedBy: [],
      createdAt: Date.now() - 120_000,
      isPinned: false,
    },
  ];
  return questions;
}

function createMockSession(): AMASession {
  const sessionId = `ama-${Date.now()}`;
  return {
    id: sessionId,
    title: 'Stellar Smart Contracts Deep Dive',
    description:
      'Join Dr. Sarah Chen for a live Q&A on Stellar smart contracts, Soroban development, and the future of blockchain on Stellar.',
    host: MOCK_HOST,
    status: 'live',
    scheduledStart: Date.now() - 30 * 60_000, // started 30 min ago
    scheduledEnd: Date.now() + 30 * 60_000, // ends in 30 min
    actualStart: Date.now() - 30 * 60_000,
    participantCount: 47,
    questions: generateMockQuestions(sessionId),
    tags: ['Stellar', 'Smart Contracts', 'Soroban', 'Blockchain'],
  };
}

// ── Sort helpers ─────────────────────────────────────────────────────────────

export type QuestionSortMode = 'newest' | 'popular' | 'oldest';

function sortQuestions(
  questions: AMAQuestion[],
  mode: QuestionSortMode,
): AMAQuestion[] {
  const sorted = [...questions];
  // Pinned always first
  sorted.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    switch (mode) {
      case 'popular':
        return b.upvotes - a.upvotes;
      case 'oldest':
        return a.createdAt - b.createdAt;
      case 'newest':
      default:
        return b.createdAt - a.createdAt;
    }
  });
  return sorted;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface UseAmaSessionOptions {
  sessionId?: string;
  userId: string;
  userName: string;
}

export function useAmaSession({ sessionId, userId, userName }: UseAmaSessionOptions) {
  const [session, setSession] = useState<AMASession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortMode, setSortMode] = useState<QuestionSortMode>('popular');
  const [isHost, setIsHost] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Load session
  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch — replace with real fetch
    const timer = setTimeout(() => {
      const mockSession = createMockSession();
      setSession(mockSession);
      setIsHost(mockSession.host.id === userId);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [sessionId, userId]);

  // Session countdown timer
  useEffect(() => {
    if (!session || session.status !== 'live') return;

    const tick = () => {
      const remaining = session.scheduledEnd - Date.now();
      setTimeRemaining(Math.max(0, remaining));

      if (remaining <= 0) {
        setSession((prev) =>
          prev ? { ...prev, status: 'ended', actualEnd: Date.now() } : prev,
        );
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.status, session?.scheduledEnd]);

  // Submit a question
  const submitQuestion = useCallback(
    (text: string) => {
      if (!session || session.status !== 'live') {
        toast.error('Session is not live');
        return;
      }

      const newQuestion: AMAQuestion = {
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sessionId: session.id,
        authorId: userId,
        authorName: userName,
        text: text.trim(),
        status: 'pending',
        upvotes: 0,
        upvotedBy: [],
        createdAt: Date.now(),
        isPinned: false,
      };

      setSession((prev) =>
        prev ? { ...prev, questions: [...prev.questions, newQuestion] } : prev,
      );
      toast.success('Question submitted!');
    },
    [session, userId, userName],
  );

  // Upvote a question
  const upvoteQuestion = useCallback(
    (questionId: string) => {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) => {
            if (q.id !== questionId) return q;
            const alreadyVoted = q.upvotedBy.includes(userId);
            return {
              ...q,
              upvotes: alreadyVoted ? q.upvotes - 1 : q.upvotes + 1,
              upvotedBy: alreadyVoted
                ? q.upvotedBy.filter((id) => id !== userId)
                : [...q.upvotedBy, userId],
            };
          }),
        };
      });
    },
    [userId],
  );

  // Answer a question (host only)
  const answerQuestion = useCallback(
    (questionId: string, answer: string) => {
      if (!isHost) {
        toast.error('Only the host can answer questions');
        return;
      }
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  status: 'answered' as const,
                  answer,
                  answeredAt: Date.now(),
                  answeredBy: userId,
                }
              : q,
          ),
        };
      });
      toast.success('Answer posted!');
    },
    [isHost, userId],
  );

  // Pin / unpin a question (host only)
  const togglePinQuestion = useCallback(
    (questionId: string) => {
      if (!isHost) return;
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === questionId ? { ...q, isPinned: !q.isPinned } : q,
          ),
        };
      });
    },
    [isHost],
  );

  // Dismiss a question (host only)
  const dismissQuestion = useCallback(
    (questionId: string) => {
      if (!isHost) return;
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === questionId ? { ...q, status: 'dismissed' as const } : q,
          ),
        };
      });
    },
    [isHost],
  );

  // Start / end session (host only)
  const startSession = useCallback(() => {
    if (!isHost) return;
    setSession((prev) =>
      prev ? { ...prev, status: 'live', actualStart: Date.now() } : prev,
    );
    toast.success('AMA session is now live!');
  }, [isHost]);

  const endSession = useCallback(() => {
    if (!isHost) return;
    setSession((prev) =>
      prev ? { ...prev, status: 'ended', actualEnd: Date.now() } : prev,
    );
    toast.info('AMA session has ended.');
  }, [isHost]);

  // Computed values
  const sortedQuestions = session
    ? sortQuestions(
        session.questions.filter((q) => q.status !== 'dismissed'),
        sortMode,
      )
    : [];

  const answeredCount = session
    ? session.questions.filter((q) => q.status === 'answered').length
    : 0;

  const pendingCount = session
    ? session.questions.filter((q) => q.status === 'pending').length
    : 0;

  return {
    session,
    isLoading,
    isHost,
    sortMode,
    setSortMode,
    timeRemaining,
    sortedQuestions,
    answeredCount,
    pendingCount,
    submitQuestion,
    upvoteQuestion,
    answerQuestion,
    togglePinQuestion,
    dismissQuestion,
    startSession,
    endSession,
  };
}
