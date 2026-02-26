'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Gauge,
  Sparkles,
  SplitSquareVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  assignRecommendationStrategy,
  runRecommendationEngine,
  type RecommendationEngineInput,
  type RecommendationStrategy,
} from '@/services/recommendationEngine';
import { buildMockRecommendationInput } from '@/data/recommendationEngineMock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SmartSuggestionCard } from './SmartSuggestionCard';

interface RecommendationEngineProps {
  learnerId: string;
  input?: Omit<RecommendationEngineInput, 'learnerId'>;
  defaultStrategy?: RecommendationStrategy;
  enableStrategyToggle?: boolean;
  className?: string;
}

const strategyLabel: Record<RecommendationStrategy, string> = {
  'weakness-first': 'Weakness first',
  'momentum-balanced': 'Momentum balanced',
};

const strategyDescription: Record<RecommendationStrategy, string> = {
  'weakness-first':
    'Prioritizes topics where test scores and pacing indicate gaps.',
  'momentum-balanced':
    'Blends remediation with topics where progress is already stable.',
};

const speedTone: Record<'fast' | 'on-track' | 'slow', string> = {
  fast: 'text-emerald-600 dark:text-emerald-300',
  'on-track': 'text-sky-600 dark:text-sky-300',
  slow: 'text-amber-600 dark:text-amber-300',
};

const speedLabel: Record<'fast' | 'on-track' | 'slow', string> = {
  fast: 'Faster than expected',
  'on-track': 'On expected pace',
  slow: 'Slower than expected',
};

export function RecommendationEngine({
  learnerId,
  input,
  defaultStrategy,
  enableStrategyToggle = true,
  className,
}: RecommendationEngineProps) {
  const assignedStrategy = useMemo(
    () => defaultStrategy ?? assignRecommendationStrategy(learnerId),
    [defaultStrategy, learnerId],
  );

  const [strategy, setStrategy] =
    useState<RecommendationStrategy>(assignedStrategy);

  const normalizedInput = useMemo<RecommendationEngineInput>(() => {
    if (!input) {
      return buildMockRecommendationInput(learnerId);
    }

    return {
      learnerId,
      lessonTelemetry: input.lessonTelemetry,
      quizTelemetry: input.quizTelemetry,
      catalog: input.catalog,
      maxSuggestions: input.maxSuggestions,
    };
  }, [input, learnerId]);

  const result = useMemo(
    () => runRecommendationEngine(normalizedInput, strategy),
    [normalizedInput, strategy],
  );

  return (
    <Card className={cn('border-primary/20 bg-card/90', className)}>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommendation Engine
            </CardTitle>
            <CardDescription className="mt-1 max-w-2xl">
              Dynamic next-step suggestions based on completion speed, quiz
              performance, and detected topic weaknesses.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">Experiment {result.experimentGroup}</Badge>
            <Badge variant="secondary">{strategyLabel[result.strategy]}</Badge>
          </div>
        </div>

        {enableStrategyToggle && (
          <div className="rounded-md border border-dashed bg-muted/35 p-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <SplitSquareVertical className="h-4 w-4 text-primary" />
              A/B recommendation strategy
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(strategyLabel) as RecommendationStrategy[]).map(
                (option) => (
                  <Button
                    key={option}
                    variant={strategy === option ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStrategy(option)}
                  >
                    {strategyLabel[option]}
                  </Button>
                ),
              )}
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {strategyDescription[strategy]}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Gauge className="h-4 w-4" />
              Completion pace
            </div>
            <div className="mt-2 text-xl font-semibold">
              {result.analysis.averageCompletionSpeedRatio}x
            </div>
            <p
              className={cn(
                'text-xs',
                speedTone[result.analysis.completionSpeedLabel],
              )}
            >
              {speedLabel[result.analysis.completionSpeedLabel]}
            </p>
          </div>

          <div className="rounded-lg border bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4" />
              Average test score
            </div>
            <div className="mt-2 text-xl font-semibold">
              {result.analysis.averageQuizScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across recent quiz attempts
            </p>
          </div>

          <div className="rounded-lg border bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              Weak topics
            </div>
            <div className="mt-2 text-xl font-semibold">
              {result.analysis.weakTopics.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {result.analysis.weakTopics
                .slice(0, 2)
                .map((topic) => topic.topic)
                .join(', ') || 'No critical gaps detected'}
            </p>
          </div>
        </div>

        {result.suggestions.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No recommendations generated for the current profile.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {result.suggestions.map((suggestion) => (
              <SmartSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecommendationEngine;
