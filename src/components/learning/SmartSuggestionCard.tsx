'use client';

import React from 'react';
import {
  BookOpen,
  Clock3,
  ExternalLink,
  Link2,
  Target,
  Trophy,
} from 'lucide-react';
import {
  type RecommendationSuggestion,
  type RecommendationSuggestionType,
} from '@/services/recommendationEngine';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SmartSuggestionCardProps {
  suggestion: RecommendationSuggestion;
  className?: string;
  onSelect?: (suggestion: RecommendationSuggestion) => void;
}

const typeStyles: Record<
  RecommendationSuggestionType,
  {
    label: string;
    icon: React.ReactNode;
    badgeClassName: string;
    actionLabel: string;
  }
> = {
  supplementary_lesson: {
    label: 'Supplementary Lesson',
    icon: <BookOpen className="h-4 w-4" />,
    badgeClassName:
      'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200',
    actionLabel: 'Start Lesson',
  },
  practice_quiz: {
    label: 'Practice Quiz',
    icon: <Target className="h-4 w-4" />,
    badgeClassName:
      'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
    actionLabel: 'Take Quiz',
  },
  external_resource: {
    label: 'External Resource',
    icon: <Link2 className="h-4 w-4" />,
    badgeClassName:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
    actionLabel: 'Open Resource',
  },
};

export function SmartSuggestionCard({
  suggestion,
  className,
  onSelect,
}: SmartSuggestionCardProps) {
  const style = typeStyles[suggestion.type];

  const handleAction = () => {
    onSelect?.(suggestion);

    if (suggestion.type === 'external_resource' && suggestion.url) {
      window.open(suggestion.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card
      className={cn(
        'border-border/70 bg-card/80 transition-colors hover:border-primary/30',
        className,
      )}
    >
      <CardHeader className="space-y-3 pb-2">
        <div className="flex items-center justify-between gap-2">
          <Badge className={cn('font-medium', style.badgeClassName)}>
            <span className="mr-1">{style.icon}</span>
            {style.label}
          </Badge>
          <Badge variant="outline">Priority {suggestion.priority}</Badge>
        </div>

        <CardTitle className="text-base leading-6">
          {suggestion.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {suggestion.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary">{suggestion.topic}</Badge>
          <Badge variant="outline">Confidence {suggestion.confidence}%</Badge>
          <Badge variant="outline" className="gap-1">
            <Clock3 className="h-3 w-3" />
            {suggestion.estimatedMinutes} min
          </Badge>
        </div>

        <div className="rounded-md border border-dashed bg-muted/30 p-3">
          <p className="text-xs font-medium text-foreground">Why this now</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {suggestion.reason}
          </p>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Trophy className="mt-0.5 h-3.5 w-3.5 text-primary" />
          <span>{suggestion.expectedOutcome}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleAction} className="w-full gap-2" size="sm">
          {style.actionLabel}
          {suggestion.type === 'external_resource' && (
            <ExternalLink className="h-3.5 w-3.5" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SmartSuggestionCard;
