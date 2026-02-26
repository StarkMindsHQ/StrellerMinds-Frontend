import { describe, expect, it } from 'vitest';
import {
  analyzeRecommendationSignals,
  assignRecommendationStrategy,
  buildRecommendationSuggestions,
  runRecommendationEngine,
} from '@/services/recommendationEngine';
import { buildMockRecommendationInput } from '@/data/recommendationEngineMock';

describe('recommendationEngine', () => {
  it('analyzes learning behavior and identifies weak topics', () => {
    const input = buildMockRecommendationInput('learner-alpha');
    const analysis = analyzeRecommendationSignals({
      lessonTelemetry: input.lessonTelemetry,
      quizTelemetry: input.quizTelemetry,
    });

    expect(analysis.averageCompletionSpeedRatio).toBeGreaterThan(1);
    expect(analysis.averageQuizScore).toBeLessThan(75);
    expect(analysis.weakTopics.length).toBeGreaterThan(0);
    expect(analysis.weakTopics[0]?.topic).toBeTruthy();
  });

  it('assigns stable A/B strategy by learner id', () => {
    const first = assignRecommendationStrategy('learner-stable-id');
    const second = assignRecommendationStrategy('learner-stable-id');

    expect(first).toBe(second);
  });

  it('produces differentiated recommendations for each strategy', () => {
    const input = buildMockRecommendationInput('learner-beta');
    const analysis = analyzeRecommendationSignals({
      lessonTelemetry: input.lessonTelemetry,
      quizTelemetry: input.quizTelemetry,
    });

    const weaknessFirst = buildRecommendationSuggestions(
      input,
      analysis,
      'weakness-first',
    );
    const momentumBalanced = buildRecommendationSuggestions(
      input,
      analysis,
      'momentum-balanced',
    );

    expect(weaknessFirst.length).toBeGreaterThan(0);
    expect(momentumBalanced.length).toBeGreaterThan(0);
    expect(weaknessFirst.map((item) => item.id)).not.toEqual(
      momentumBalanced.map((item) => item.id),
    );
  });

  it('runs end-to-end recommendation engine output', () => {
    const input = buildMockRecommendationInput('learner-gamma');
    const result = runRecommendationEngine(input, 'weakness-first');

    expect(result.experimentGroup).toBe('A');
    expect(result.strategy).toBe('weakness-first');
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.suggestions[0]?.reason).toContain('target');
  });
});
