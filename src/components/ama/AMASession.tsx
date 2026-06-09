'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Clock,
  Users,
  CheckCircle2,
  Pin,
  ChevronDown,
  Trash2,
  Radio,
  Timer,
  ArrowUpDown,
  Mic,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAmaSession, type QuestionSortMode } from '@/hooks/useAmaSession';
import type { AMAQuestion, AMASessionStatus } from '@/types/ama';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getStatusConfig(status: AMASessionStatus) {
  switch (status) {
    case 'live':
      return {
        label: 'LIVE',
        className: 'bg-red-500/10 text-red-500 border-red-500/30',
        icon: Radio,
        pulse: true,
      };
    case 'scheduled':
      return {
        label: 'Scheduled',
        className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
        icon: Clock,
        pulse: false,
      };
    case 'ended':
      return {
        label: 'Ended',
        className: 'bg-muted text-muted-foreground border-border',
        icon: CheckCircle2,
        pulse: false,
      };
  }
}

// ── Question Card ────────────────────────────────────────────────────────────

interface QuestionCardProps {
  question: AMAQuestion;
  currentUserId: string;
  isHost: boolean;
  onUpvote: (id: string) => void;
  onAnswer: (id: string, answer: string) => void;
  onPin: (id: string) => void;
  onDismiss: (id: string) => void;
  isSessionLive: boolean;
}

function QuestionCard({
  question,
  currentUserId,
  isHost,
  onUpvote,
  onAnswer,
  onPin,
  onDismiss,
  isSessionLive,
}: QuestionCardProps) {
  const [answerText, setAnswerText] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const hasUpvoted = question.upvotedBy.includes(currentUserId);
  const isAnswered = question.status === 'answered';

  const handleSubmitAnswer = () => {
    if (answerText.trim()) {
      onAnswer(question.id, answerText.trim());
      setAnswerText('');
      setShowAnswerForm(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        className={cn(
          'transition-all duration-200',
          isAnswered &&
            'border-green-500/30 bg-green-500/5 dark:border-green-400/20 dark:bg-green-400/5',
          question.isPinned &&
            'border-primary/40 bg-primary/5 ring-1 ring-primary/20',
        )}
      >
        <CardContent className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage
                  src={question.authorAvatar}
                  alt={question.authorName}
                />
                <AvatarFallback className="text-xs">
                  {getInitials(question.authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium truncate">
                    {question.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(question.createdAt)}
                  </span>
                  {question.isPinned && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-primary/40 text-primary"
                    >
                      <Pin className="h-2.5 w-2.5 mr-0.5" />
                      Pinned
                    </Badge>
                  )}
                  {isAnswered && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-green-500/40 text-green-600 dark:text-green-400"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                      Answered
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed">{question.text}</p>
              </div>
            </div>

            {/* Upvote button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpvote(question.id)}
              disabled={!isSessionLive && !isAnswered}
              className={cn(
                'shrink-0 flex flex-col items-center gap-0 h-auto py-1.5 px-2',
                hasUpvoted && 'text-primary',
              )}
            >
              <ThumbsUp
                className={cn('h-4 w-4', hasUpvoted && 'fill-primary')}
              />
              <span className="text-xs font-medium">{question.upvotes}</span>
            </Button>
          </div>

          {/* Answer section */}
          {isAnswered && question.answer && (
            <div className="mt-3 ml-11 p-3 rounded-md bg-green-500/10 dark:bg-green-400/10 border border-green-500/20">
              <div className="flex items-center gap-1.5 mb-1">
                <Mic className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                  Host Answer
                </span>
                {question.answeredAt && (
                  <span className="text-[10px] text-muted-foreground">
                    {timeAgo(question.answeredAt)}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed">{question.answer}</p>
            </div>
          )}

          {/* Host actions */}
          {isHost && isSessionLive && !isAnswered && (
            <div className="mt-3 ml-11 flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => setShowAnswerForm(!showAnswerForm)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Answer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={() => onPin(question.id)}
              >
                <Pin className="h-3 w-3 mr-1" />
                {question.isPinned ? 'Unpin' : 'Pin'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-destructive hover:text-destructive"
                onClick={() => onDismiss(question.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            </div>
          )}

          {/* Answer form */}
          {showAnswerForm && isHost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 ml-11"
            >
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your answer..."
                className="w-full min-h-[80px] p-2 text-sm border rounded-md bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSubmitAnswer();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">
                  Ctrl + Enter to submit
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setShowAnswerForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs h-7"
                    onClick={handleSubmitAnswer}
                    disabled={!answerText.trim()}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Submit Answer
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────

function AMASessionSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Main AMA Session Component ───────────────────────────────────────────────

export interface AMASessionProps {
  sessionId?: string;
  userId?: string;
  userName?: string;
  className?: string;
}

export default function AMASession({
  sessionId,
  userId = 'user-current',
  userName = 'Current User',
  className,
}: AMASessionProps) {
  const {
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
  } = useAmaSession({ sessionId, userId, userName });

  const [questionText, setQuestionText] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'answered' | 'pending'>(
    'all',
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmitQuestion = () => {
    if (questionText.trim()) {
      submitQuestion(questionText);
      setQuestionText('');
      inputRef.current?.focus();
    }
  };

  if (isLoading) return <AMASessionSkeleton />;
  if (!session)
    return (
      <div className="text-center py-12 text-muted-foreground">
        Session not found.
      </div>
    );

  const statusConfig = getStatusConfig(session.status);
  const StatusIcon = statusConfig.icon;

  const filteredQuestions = sortedQuestions.filter((q) => {
    if (filterTab === 'answered') return q.status === 'answered';
    if (filterTab === 'pending') return q.status === 'pending';
    return true;
  });

  return (
    <div className={cn('max-w-3xl mx-auto space-y-6', className)}>
      {/* ── Session Header ─────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-xl">{session.title}</CardTitle>
                <Badge
                  variant="outline"
                  className={cn('text-xs', statusConfig.className)}
                >
                  {statusConfig.pulse && (
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
              <CardDescription>{session.description}</CardDescription>
            </div>

            {/* Timer */}
            {session.status === 'live' && (
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span
                  className={cn(
                    'font-mono text-lg font-semibold',
                    timeRemaining < 5 * 60_000
                      ? 'text-red-500'
                      : 'text-foreground',
                  )}
                >
                  {formatTimeRemaining(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          {/* Host info */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.host.avatar} alt={session.host.name} />
              <AvatarFallback>{getInitials(session.host.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {session.host.name}
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Host
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {session.host.role}
              </p>
            </div>
          </div>

          {/* Tags */}
          {session.tags.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {session.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Stats bar */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{session.participantCount} participants</span>
            </div>
            <div className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              <span>{session.questions.length} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{answeredCount} answered</span>
            </div>
          </div>

          {/* Host controls */}
          {isHost && (
            <div className="flex gap-2 mt-4">
              {session.status === 'scheduled' && (
                <Button size="sm" onClick={startSession}>
                  <Radio className="h-4 w-4 mr-1" />
                  Go Live
                </Button>
              )}
              {session.status === 'live' && (
                <Button size="sm" variant="destructive" onClick={endSession}>
                  End Session
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Question Submission ────────────────────────────────── */}
      {session.status === 'live' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 shrink-0 mt-1">
                <AvatarFallback className="text-xs">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ask a question..."
                  rows={2}
                  className="w-full p-2 text-sm border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleSubmitQuestion();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">
                    Ctrl + Enter to submit
                  </span>
                  <Button
                    size="sm"
                    onClick={handleSubmitQuestion}
                    disabled={!questionText.trim()}
                    className="h-8"
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Ask
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {session.status === 'ended' && (
        <div className="text-center py-4 px-6 bg-muted/50 rounded-lg border text-sm text-muted-foreground">
          This AMA session has ended. Browse the questions and answers below.
        </div>
      )}

      {/* ── Filter & Sort Bar ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1">
          {(
            [
              { key: 'all', label: 'All', count: sortedQuestions.length },
              { key: 'pending', label: 'Pending', count: pendingCount },
              { key: 'answered', label: 'Answered', count: answeredCount },
            ] as const
          ).map((tab) => (
            <Button
              key={tab.key}
              variant={filterTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              className="text-xs h-8"
              onClick={() => setFilterTab(tab.key)}
            >
              {tab.label}
              <span className="ml-1 text-[10px] opacity-70">
                ({tab.count})
              </span>
            </Button>
          ))}
        </div>

        <Select
          value={sortMode}
          onValueChange={(v) => setSortMode(v as QuestionSortMode)}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <ArrowUpDown className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Questions List ─────────────────────────────────────── */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredQuestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                {filterTab === 'all'
                  ? 'No questions yet. Be the first to ask!'
                  : `No ${filterTab} questions.`}
              </p>
            </motion.div>
          ) : (
            filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                currentUserId={userId}
                isHost={isHost}
                onUpvote={upvoteQuestion}
                onAnswer={answerQuestion}
                onPin={togglePinQuestion}
                onDismiss={dismissQuestion}
                isSessionLive={session.status === 'live'}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
