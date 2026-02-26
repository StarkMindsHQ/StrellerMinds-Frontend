import {
  type LessonCompletionTelemetry,
  type QuizPerformanceTelemetry,
  type RecommendationEngineInput,
  type SuggestionCatalogItem,
} from '@/services/recommendationEngine';

export const mockLessonTelemetry: LessonCompletionTelemetry[] = [
  {
    lessonId: 'lesson-1',
    lessonTitle: 'Introduction to Blockchain',
    topic: 'Blockchain Basics',
    expectedMinutes: 8,
    actualMinutes: 7,
    completed: true,
  },
  {
    lessonId: 'lesson-2',
    lessonTitle: 'Cryptographic Foundations',
    topic: 'Cryptography',
    expectedMinutes: 10,
    actualMinutes: 16,
    completed: true,
  },
  {
    lessonId: 'lesson-3',
    lessonTitle: 'Distributed Ledger Technology',
    topic: 'Distributed Systems',
    expectedMinutes: 12,
    actualMinutes: 13,
    completed: true,
  },
  {
    lessonId: 'lesson-4',
    lessonTitle: 'Consensus Mechanisms',
    topic: 'Consensus',
    expectedMinutes: 9,
    actualMinutes: 14,
    completed: true,
  },
  {
    lessonId: 'lesson-5',
    lessonTitle: 'Smart Contracts Basics',
    topic: 'Smart Contracts',
    expectedMinutes: 11,
    actualMinutes: 18,
    completed: true,
  },
  {
    lessonId: 'lesson-6',
    lessonTitle: 'Security and Vulnerabilities',
    topic: 'Security',
    expectedMinutes: 10,
    actualMinutes: 15,
    completed: true,
  },
  {
    lessonId: 'lesson-7',
    lessonTitle: 'Future of Blockchain',
    topic: 'DeFi',
    expectedMinutes: 9,
    actualMinutes: 9,
    completed: true,
  },
];

export const mockQuizTelemetry: QuizPerformanceTelemetry[] = [
  {
    quizId: 'quiz-1',
    topic: 'Blockchain Basics',
    score: 88,
    attempts: 1,
    durationMinutes: 7,
  },
  {
    quizId: 'quiz-2',
    topic: 'Cryptography',
    score: 58,
    attempts: 2,
    durationMinutes: 12,
  },
  {
    quizId: 'quiz-3',
    topic: 'Consensus',
    score: 64,
    attempts: 1,
    durationMinutes: 10,
  },
  {
    quizId: 'quiz-4',
    topic: 'Smart Contracts',
    score: 55,
    attempts: 2,
    durationMinutes: 14,
  },
  {
    quizId: 'quiz-5',
    topic: 'Security',
    score: 61,
    attempts: 1,
    durationMinutes: 11,
  },
  {
    quizId: 'quiz-6',
    topic: 'DeFi',
    score: 78,
    attempts: 1,
    durationMinutes: 8,
  },
  {
    quizId: 'quiz-7',
    topic: 'Distributed Systems',
    score: 74,
    attempts: 1,
    durationMinutes: 9,
  },
];

export const recommendationCatalog: SuggestionCatalogItem[] = [
  {
    id: 'supp-crypto-foundations',
    title: 'Cryptography Fast-Track Lesson',
    description:
      'Step-by-step breakdown of hashing, signatures, and key management patterns.',
    type: 'supplementary_lesson',
    topic: 'Cryptography',
    estimatedMinutes: 18,
    difficulty: 2,
  },
  {
    id: 'quiz-crypto-drill',
    title: 'Cryptography Drill Quiz',
    description:
      'Timed practice quiz focused on encryption and signature troubleshooting.',
    type: 'practice_quiz',
    topic: 'Cryptography',
    estimatedMinutes: 12,
    difficulty: 2,
  },
  {
    id: 'resource-crypto-handbook',
    title: 'Applied Cryptography Handbook',
    description:
      'External reference guide with visual examples and attack pattern summaries.',
    type: 'external_resource',
    topic: 'Cryptography',
    estimatedMinutes: 20,
    difficulty: 3,
    url: 'https://www.geeksforgeeks.org/what-is-cryptography/',
  },
  {
    id: 'supp-consensus-mechanics',
    title: 'Consensus Mechanisms Revisited',
    description:
      'Supplementary walkthrough contrasting PoW, PoS, and BFT tradeoffs.',
    type: 'supplementary_lesson',
    topic: 'Consensus',
    estimatedMinutes: 16,
    difficulty: 3,
  },
  {
    id: 'quiz-consensus-practice',
    title: 'Consensus Scenario Quiz',
    description:
      'Case-based quiz on selecting consensus models for real workloads.',
    type: 'practice_quiz',
    topic: 'Consensus',
    estimatedMinutes: 10,
    difficulty: 3,
  },
  {
    id: 'resource-consensus-notes',
    title: 'Consensus Protocol Field Notes',
    description:
      'Reference notes with throughput and fault tolerance comparisons.',
    type: 'external_resource',
    topic: 'Consensus',
    estimatedMinutes: 15,
    difficulty: 3,
    url: 'https://www.ibm.com/think/topics/consensus-algorithm',
  },
  {
    id: 'supp-smart-contract-debugging',
    title: 'Smart Contract Debugging Lab',
    description:
      'Hands-on supplementary lesson focused on test failures and common logic bugs.',
    type: 'supplementary_lesson',
    topic: 'Smart Contracts',
    estimatedMinutes: 22,
    difficulty: 3,
  },
  {
    id: 'quiz-smart-contract-practice',
    title: 'Smart Contract Bug Hunt Quiz',
    description:
      'Practice quiz built around exploit detection and patch selection.',
    type: 'practice_quiz',
    topic: 'Smart Contracts',
    estimatedMinutes: 12,
    difficulty: 3,
  },
  {
    id: 'resource-smart-contract-sec',
    title: 'Solidity Security Guide',
    description:
      'External security checklist covering reentrancy, validation, and access control.',
    type: 'external_resource',
    topic: 'Smart Contracts',
    estimatedMinutes: 18,
    difficulty: 4,
    url: 'https://consensys.github.io/smart-contract-best-practices/',
  },
  {
    id: 'supp-security-foundations',
    title: 'Blockchain Security Primer',
    description:
      'Supplementary lesson on wallet hygiene, threat models, and audit workflow.',
    type: 'supplementary_lesson',
    topic: 'Security',
    estimatedMinutes: 15,
    difficulty: 2,
  },
  {
    id: 'quiz-security-hardening',
    title: 'Security Hardening Quiz',
    description:
      'Practice on vulnerability triage and remediation prioritization.',
    type: 'practice_quiz',
    topic: 'Security',
    estimatedMinutes: 11,
    difficulty: 2,
  },
  {
    id: 'resource-defi-design',
    title: 'DeFi Design Patterns',
    description:
      'External examples of liquidity, lending, and risk controls in production.',
    type: 'external_resource',
    topic: 'DeFi',
    estimatedMinutes: 14,
    difficulty: 3,
    url: 'https://ethereum.org/en/defi/',
  },
];

export const buildMockRecommendationInput = (
  learnerId: string,
): RecommendationEngineInput => ({
  learnerId,
  lessonTelemetry: mockLessonTelemetry,
  quizTelemetry: mockQuizTelemetry,
  catalog: recommendationCatalog,
  maxSuggestions: 4,
});
