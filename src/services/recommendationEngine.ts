export type RecommendationSuggestionType =
  | 'supplementary_lesson'
  | 'practice_quiz'
  | 'external_resource';

export type RecommendationStrategy = 'weakness-first' | 'momentum-balanced';

export interface LessonCompletionTelemetry {
  lessonId: string;
  lessonTitle: string;
  topic: string;
  expectedMinutes: number;
  actualMinutes: number;
  completed: boolean;
}

export interface QuizPerformanceTelemetry {
  quizId: string;
  topic: string;
  score: number;
  attempts: number;
  durationMinutes: number;
}

export interface SuggestionCatalogItem {
  id: string;
  title: string;
  description: string;
  type: RecommendationSuggestionType;
  topic: string;
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  url?: string;
}

export interface RecommendationEngineInput {
  learnerId: string;
  lessonTelemetry: LessonCompletionTelemetry[];
  quizTelemetry: QuizPerformanceTelemetry[];
  catalog: SuggestionCatalogItem[];
  maxSuggestions?: number;
}

export interface TopicWeaknessInsight {
  topic: string;
  averageQuizScore: number;
  completionSpeedRatio: number;
  failureRate: number;
  severity: number;
}

export interface RecommendationAnalysis {
  averageCompletionSpeedRatio: number;
  completionSpeedLabel: 'fast' | 'on-track' | 'slow';
  averageQuizScore: number;
  weakTopics: TopicWeaknessInsight[];
  topicScores: Record<string, number>;
}

export interface RecommendationSuggestion {
  id: string;
  title: string;
  description: string;
  topic: string;
  type: RecommendationSuggestionType;
  estimatedMinutes: number;
  reason: string;
  priority: number;
  confidence: number;
  expectedOutcome: string;
  strategy: RecommendationStrategy;
  url?: string;
}

export interface RecommendationEngineResult {
  strategy: RecommendationStrategy;
  experimentGroup: 'A' | 'B';
  generatedAt: string;
  analysis: RecommendationAnalysis;
  suggestions: RecommendationSuggestion[];
}

type TopicAccumulator = {
  expectedMinutes: number;
  actualMinutes: number;
  scores: number[];
  attempts: number;
  failedAttempts: number;
};

const CLAMP_MIN = 0;
const CLAMP_MAX = 100;

const clamp = (value: number): number =>
  Math.max(CLAMP_MIN, Math.min(CLAMP_MAX, value));

const round = (value: number, precision = 2): number => {
  const scalar = Math.pow(10, precision);
  return Math.round(value * scalar) / scalar;
};

const getSpeedLabel = (
  speedRatio: number,
): RecommendationAnalysis['completionSpeedLabel'] => {
  if (speedRatio < 0.9) {
    return 'fast';
  }

  if (speedRatio > 1.15) {
    return 'slow';
  }

  return 'on-track';
};

const getTypeOutcome = (type: RecommendationSuggestionType): string => {
  switch (type) {
    case 'supplementary_lesson':
      return 'Improve concept clarity and reduce completion time in the next module.';
    case 'practice_quiz':
      return 'Increase quiz confidence and accuracy on the next graded attempt.';
    case 'external_resource':
      return 'Reinforce applied understanding with additional examples.';
    default:
      return 'Improve learning momentum.';
  }
};

const computeTopicAccumulators = (
  lessonTelemetry: LessonCompletionTelemetry[],
  quizTelemetry: QuizPerformanceTelemetry[],
): Map<string, TopicAccumulator> => {
  const topicMap = new Map<string, TopicAccumulator>();

  const getTopicAccumulator = (topic: string): TopicAccumulator => {
    const existing = topicMap.get(topic);
    if (existing) {
      return existing;
    }

    const created: TopicAccumulator = {
      expectedMinutes: 0,
      actualMinutes: 0,
      scores: [],
      attempts: 0,
      failedAttempts: 0,
    };

    topicMap.set(topic, created);
    return created;
  };

  for (const lesson of lessonTelemetry) {
    const accumulator = getTopicAccumulator(lesson.topic);
    accumulator.expectedMinutes += lesson.expectedMinutes;
    accumulator.actualMinutes += lesson.actualMinutes;
  }

  for (const quiz of quizTelemetry) {
    const accumulator = getTopicAccumulator(quiz.topic);
    accumulator.scores.push(quiz.score);
    accumulator.attempts += quiz.attempts;
    accumulator.failedAttempts += quiz.score < 70 ? quiz.attempts : 0;
  }

  return topicMap;
};

export const analyzeRecommendationSignals = (
  input: Pick<RecommendationEngineInput, 'lessonTelemetry' | 'quizTelemetry'>,
): RecommendationAnalysis => {
  const { lessonTelemetry, quizTelemetry } = input;

  const totalExpected = lessonTelemetry.reduce(
    (sum, lesson) => sum + lesson.expectedMinutes,
    0,
  );
  const totalActual = lessonTelemetry.reduce(
    (sum, lesson) => sum + lesson.actualMinutes,
    0,
  );
  const averageCompletionSpeedRatio = totalExpected
    ? totalActual / totalExpected
    : 1;

  const averageQuizScore = quizTelemetry.length
    ? quizTelemetry.reduce((sum, quiz) => sum + quiz.score, 0) /
      quizTelemetry.length
    : 0;

  const topicMap = computeTopicAccumulators(lessonTelemetry, quizTelemetry);
  const weakTopics: TopicWeaknessInsight[] = [];
  const topicScores: Record<string, number> = {};

  for (const [topic, accumulator] of topicMap.entries()) {
    const topicQuizAverage = accumulator.scores.length
      ? accumulator.scores.reduce((sum, score) => sum + score, 0) /
        accumulator.scores.length
      : averageQuizScore;

    const completionSpeedRatio = accumulator.expectedMinutes
      ? accumulator.actualMinutes / accumulator.expectedMinutes
      : averageCompletionSpeedRatio;

    const failureRate = accumulator.attempts
      ? accumulator.failedAttempts / accumulator.attempts
      : 0;

    const severity = clamp(
      (100 - topicQuizAverage) * 0.6 +
        Math.max(0, completionSpeedRatio - 1) * 100 * 0.25 +
        failureRate * 100 * 0.15,
    );

    topicScores[topic] = round(topicQuizAverage, 2);

    if (severity >= 30) {
      weakTopics.push({
        topic,
        averageQuizScore: round(topicQuizAverage, 2),
        completionSpeedRatio: round(completionSpeedRatio, 2),
        failureRate: round(failureRate, 2),
        severity: round(severity, 2),
      });
    }
  }

  weakTopics.sort((left, right) => right.severity - left.severity);

  return {
    averageCompletionSpeedRatio: round(averageCompletionSpeedRatio, 2),
    completionSpeedLabel: getSpeedLabel(averageCompletionSpeedRatio),
    averageQuizScore: round(averageQuizScore, 2),
    weakTopics,
    topicScores,
  };
};

const hashLearnerId = (learnerId: string): number => {
  let hash = 0;
  for (let index = 0; index < learnerId.length; index += 1) {
    hash = (hash << 5) - hash + learnerId.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

export const assignRecommendationStrategy = (
  learnerId: string,
): RecommendationStrategy =>
  hashLearnerId(learnerId) % 2 === 0 ? 'weakness-first' : 'momentum-balanced';

export const recommendationStrategyToExperimentGroup = (
  strategy: RecommendationStrategy,
): 'A' | 'B' => (strategy === 'weakness-first' ? 'A' : 'B');

const getWeaknessMap = (
  weakTopics: TopicWeaknessInsight[],
): Record<string, TopicWeaknessInsight> =>
  weakTopics.reduce<Record<string, TopicWeaknessInsight>>(
    (accumulator, topic) => {
      accumulator[topic.topic] = topic;
      return accumulator;
    },
    {},
  );

const typeBias: Record<RecommendationSuggestionType, number> = {
  supplementary_lesson: 11,
  practice_quiz: 10,
  external_resource: 8,
};

const getDifficultyPenalty = (
  difficulty: SuggestionCatalogItem['difficulty'],
  averageQuizScore: number,
): number => {
  if (averageQuizScore >= 80) {
    return 0;
  }

  return Math.max(0, difficulty - 3) * 3;
};

const getItemScore = (
  item: SuggestionCatalogItem,
  strategy: RecommendationStrategy,
  analysis: RecommendationAnalysis,
): number => {
  const weaknessMap = getWeaknessMap(analysis.weakTopics);
  const weakness = weaknessMap[item.topic]?.severity ?? 0;
  const quizScore =
    analysis.topicScores[item.topic] ?? analysis.averageQuizScore;

  if (strategy === 'weakness-first') {
    return (
      weakness * 1.2 +
      typeBias[item.type] -
      getDifficultyPenalty(item.difficulty, analysis.averageQuizScore) +
      (100 - quizScore) * 0.12
    );
  }

  const momentumBoost = quizScore >= 75 ? 14 : 0;
  const balanceBoost = item.type === 'practice_quiz' ? 10 : 6;

  return (
    weakness * 0.75 +
    momentumBoost +
    balanceBoost +
    typeBias[item.type] -
    getDifficultyPenalty(item.difficulty, analysis.averageQuizScore)
  );
};

const getReason = (
  item: SuggestionCatalogItem,
  strategy: RecommendationStrategy,
  analysis: RecommendationAnalysis,
): string => {
  const weakness = analysis.weakTopics.find(
    (topic) => topic.topic === item.topic,
  );

  if (weakness) {
    return `${item.topic} is trending below target (${weakness.averageQuizScore}% avg quiz) with a ${weakness.completionSpeedRatio}x completion pace.`;
  }

  if (strategy === 'momentum-balanced') {
    return `${item.topic} is a stable area. This recommendation keeps momentum while balancing remediation work.`;
  }

  return `${item.topic} reinforces prerequisite context needed for your next lesson block.`;
};

const deduplicateByTopicAndType = (
  items: SuggestionCatalogItem[],
): SuggestionCatalogItem[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.topic}:${item.type}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const buildRecommendationSuggestions = (
  input: RecommendationEngineInput,
  analysis: RecommendationAnalysis,
  strategy: RecommendationStrategy,
): RecommendationSuggestion[] => {
  const maxSuggestions = input.maxSuggestions ?? 4;

  const scoredCandidates = deduplicateByTopicAndType(input.catalog)
    .map((item) => ({
      item,
      score: getItemScore(item, strategy, analysis),
    }))
    .sort((left, right) => right.score - left.score);

  const selected = scoredCandidates.slice(0, Math.max(1, maxSuggestions));

  return selected.map((candidate, index) => {
    const confidence = clamp(55 + candidate.score * 0.6);

    return {
      id: candidate.item.id,
      title: candidate.item.title,
      description: candidate.item.description,
      topic: candidate.item.topic,
      type: candidate.item.type,
      estimatedMinutes: candidate.item.estimatedMinutes,
      reason: getReason(candidate.item, strategy, analysis),
      priority: index + 1,
      confidence: round(confidence, 0),
      expectedOutcome: getTypeOutcome(candidate.item.type),
      strategy,
      url: candidate.item.url,
    };
  });
};

export const runRecommendationEngine = (
  input: RecommendationEngineInput,
  overrideStrategy?: RecommendationStrategy,
): RecommendationEngineResult => {
  const strategy =
    overrideStrategy ?? assignRecommendationStrategy(input.learnerId);
  const analysis = analyzeRecommendationSignals(input);
  const suggestions = buildRecommendationSuggestions(input, analysis, strategy);

  return {
    strategy,
    experimentGroup: recommendationStrategyToExperimentGroup(strategy),
    generatedAt: new Date().toISOString(),
    analysis,
    suggestions,
  };
};
