'use client';

import React, { useMemo, useState } from 'react';
import { ClipboardCheck, EyeOff, RefreshCcw, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { RubricCriteria } from '@/types/cms';

interface ReviewAssignment {
  id: string;
  reviewerName: string;
  submissionTitle: string;
  studentName: string;
  assignedAt: string;
  dueAt: string;
  anonymous: boolean;
  status: 'assigned' | 'submitted';
  scores: Record<string, number>;
  feedback: string;
}

interface PeerReviewAssignmentPanelProps {
  assignmentTitle: string;
  rubricCriteria: RubricCriteria[];
}

const PARTICIPANTS = [
  { reviewerName: 'Ada', studentName: 'Samuel' },
  { reviewerName: 'Noah', studentName: 'Miriam' },
  { reviewerName: 'Esther', studentName: 'David' },
];

function createAutoAssignments(
  criteria: RubricCriteria[],
  anonymous: boolean,
): ReviewAssignment[] {
  return PARTICIPANTS.map((pair, index) => ({
    id: `review-${index + 1}`,
    reviewerName: pair.reviewerName,
    submissionTitle: `Submission ${index + 1}: Soroban escrow review`,
    studentName: pair.studentName,
    assignedAt: '2026-04-24T08:00:00.000Z',
    dueAt: '2026-04-27T18:00:00.000Z',
    anonymous,
    status: 'assigned',
    scores: Object.fromEntries(criteria.map((criterion) => [criterion.id, 0])),
    feedback: '',
  }));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function PeerReviewAssignmentPanel({
  assignmentTitle,
  rubricCriteria,
}: PeerReviewAssignmentPanelProps) {
  const [anonymous, setAnonymous] = useState(true);
  const [reviews, setReviews] = useState<ReviewAssignment[]>(
    createAutoAssignments(rubricCriteria, true),
  );

  const submittedCount = reviews.filter(
    (review) => review.status === 'submitted',
  ).length;
  const pendingCount = reviews.length - submittedCount;

  const averageScore = useMemo(() => {
    const submittedReviews = reviews.filter(
      (review) => review.status === 'submitted',
    );
    if (submittedReviews.length === 0) return 0;

    const total = submittedReviews.reduce((sum, review) => {
      return (
        sum +
        rubricCriteria.reduce(
          (criterionSum, criterion) =>
            criterionSum + (review.scores[criterion.id] || 0),
          0,
        )
      );
    }, 0);

    return Math.round((total / submittedReviews.length) * 10) / 10;
  }, [reviews, rubricCriteria]);

  const handleAutoAssign = () => {
    setReviews(createAutoAssignments(rubricCriteria, anonymous));
  };

  const updateReview = (
    reviewId: string,
    updater: (review: ReviewAssignment) => ReviewAssignment,
  ) => {
    setReviews((previous) =>
      previous.map((review) =>
        review.id === reviewId ? updater(review) : review,
      ),
    );
  };

  const toggleAnonymous = (checked: boolean) => {
    setAnonymous(checked);
    setReviews((previous) =>
      previous.map((review) => ({
        ...review,
        anonymous: checked,
      })),
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="border-0 shadow-sm lg:sticky lg:top-6 lg:h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Peer Review Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-sm font-medium">{assignmentTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Auto-assign review pairs, enforce rubric-based scoring, and let
              reviewers submit structured feedback from one workspace.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border bg-background p-4">
            <div>
              <Label htmlFor="anonymous-review">Anonymous review</Label>
              <p className="text-xs text-muted-foreground">
                Hide student names during peer evaluation.
              </p>
            </div>
            <Switch
              id="anonymous-review"
              checked={anonymous}
              onCheckedChange={toggleAnonymous}
            />
          </div>

          <Button className="w-full gap-2" onClick={handleAutoAssign}>
            <RefreshCcw className="h-4 w-4" />
            Auto-assign reviews
          </Button>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-background p-3 text-center">
              <p className="text-2xl font-bold">{reviews.length}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
            <div className="rounded-2xl border bg-background p-3 text-center">
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="rounded-2xl border bg-background p-3 text-center">
              <p className="text-2xl font-bold">{averageScore}</p>
              <p className="text-xs text-muted-foreground">Avg rubric</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-card">
          <CardTitle className="text-xl">
            Peer Review Assignment Component
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Each reviewer gets an automatically assigned submission, an
            anonymous mode when enabled, rubric scoring, and a feedback form for
            final submission.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[780px]">
            <div className="space-y-4 p-6">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="rounded-3xl border bg-muted/10"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {review.submissionTitle}
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Reviewer:{' '}
                          <span className="font-medium text-foreground">
                            {review.reviewerName}
                          </span>{' '}
                          • Reviewing:{' '}
                          <span className="font-medium text-foreground">
                            {review.anonymous
                              ? 'Anonymous peer'
                              : review.studentName}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {review.anonymous && (
                          <Badge variant="secondary" className="gap-1">
                            <EyeOff className="h-3 w-3" />
                            Anonymous
                          </Badge>
                        )}
                        <Badge
                          variant={
                            review.status === 'submitted'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {review.status === 'submitted'
                            ? 'Feedback submitted'
                            : 'Awaiting feedback'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Assigned {formatDate(review.assignedAt)}</span>
                      <span>Due {formatDate(review.dueAt)}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {rubricCriteria.map((criterion) => (
                        <div
                          key={criterion.id}
                          className="rounded-2xl border bg-background p-4"
                        >
                          <div className="space-y-1">
                            <p className="font-semibold">{criterion.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {criterion.description}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <Label htmlFor={`${review.id}-${criterion.id}`}>
                              Score / {criterion.maxPoints}
                            </Label>
                            <Input
                              id={`${review.id}-${criterion.id}`}
                              type="number"
                              min={0}
                              max={criterion.maxPoints}
                              value={review.scores[criterion.id] || 0}
                              onChange={(event) => {
                                const nextValue = Math.min(
                                  criterion.maxPoints,
                                  Math.max(
                                    0,
                                    Number.parseInt(event.target.value, 10) ||
                                      0,
                                  ),
                                );

                                updateReview(review.id, (current) => ({
                                  ...current,
                                  scores: {
                                    ...current.scores,
                                    [criterion.id]: nextValue,
                                  },
                                }));
                              }}
                              className="w-24"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${review.id}-feedback`}>
                        Feedback submission
                      </Label>
                      <Textarea
                        id={`${review.id}-feedback`}
                        value={review.feedback}
                        onChange={(event) =>
                          updateReview(review.id, (current) => ({
                            ...current,
                            feedback: event.target.value,
                          }))
                        }
                        placeholder="Share strengths, gaps, and suggested improvements..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        className="gap-2"
                        onClick={() =>
                          updateReview(review.id, (current) => ({
                            ...current,
                            status: 'submitted',
                          }))
                        }
                      >
                        <Send className="h-4 w-4" />
                        Submit feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
