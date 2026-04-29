'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  BarChart3,
  Calendar,
  User,
  Filter,
} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type {
  TestScoreLeaderboardEntry,
  TestScoreLeaderboardQueryParams,
  TestScoreLeaderboardFilters,
  TestScoreLeaderboardSortBy,
} from '@/types/testScoreLeaderboard';

// API response type
interface LeaderboardApiResponse {
  data: TestScoreLeaderboardEntry[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
  currentUserEntry?: TestScoreLeaderboardEntry;
  filters: TestScoreLeaderboardFilters;
  sortBy: TestScoreLeaderboardSortBy;
  order: 'asc' | 'desc';
}

// Component props
export interface TestScoreLeaderboardProps {
  courseId?: string;
  testId?: string;
  sortBy?: TestScoreLeaderboardSortBy;
  order?: 'asc' | 'desc';
  limit?: number;
  currentUserId?: string;
  showFilters?: boolean;
  className?: string;
  onEntryClick?: (entry: TestScoreLeaderboardEntry) => void;
}

/**
 * Fetch leaderboard data from API
 */
const fetchLeaderboard = async (
  params: TestScoreLeaderboardQueryParams,
): Promise<LeaderboardApiResponse> => {
  const searchParams = new URLSearchParams();

  if (params.courseId) searchParams.append('courseId', params.courseId);
  if (params.testId) searchParams.append('testId', params.testId);
  if (params.moduleId) searchParams.append('moduleId', params.moduleId);
  searchParams.append('sortBy', params.sortBy || 'score');
  searchParams.append(
    'order',
    params.order || (params.sortBy === 'score' ? 'desc' : 'asc'),
  );
  searchParams.append('limit', (params.limit || 20).toString());
  if (params.cursor) searchParams.append('cursor', params.cursor);
  if (params.currentUserId)
    searchParams.append('currentUserId', params.currentUserId);

  const response = await fetch(`/api/leaderboard/test-scores?${searchParams}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Rank badge component for top 3 positions
 */
const RankBadge: React.FC<{ rank: number; isCurrentUser?: boolean }> = ({
  rank,
  isCurrentUser,
}) => {
  if (rank === 1) {
    return (
      <div className="relative">
        <Trophy className="h-8 w-8 text-yellow-500 drop-shadow-lg" />
        <span className="absolute -bottom-1 -right-1 bg-yellow-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          1
        </span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="relative">
        <Medal className="h-7 w-7 text-gray-400" />
        <span className="absolute -bottom-1 -right-1 bg-gray-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          2
        </span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="relative">
        <Award className="h-6 w-6 text-amber-600" />
        <span className="absolute -bottom-1 -right-1 bg-amber-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          3
        </span>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm',
        isCurrentUser
          ? 'bg-primary text-primary-foreground ring-2 ring-primary'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {rank}
    </div>
  );
};

/**
 * Format time spent in human readable format
 */
const formatTimeSpent = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) {
    return `${hrs}h ${mins % 60}m`;
  }
  return `${mins}m`;
};

/**
 * Format date to relative or absolute
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

/**
 * Leaderboard entry row component
 */
const LeaderboardRow: React.FC<{
  entry: TestScoreLeaderboardEntry;
  isHighlighted: boolean;
  onClick?: (entry: TestScoreLeaderboardEntry) => void;
}> = ({ entry, isHighlighted, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer',
        isHighlighted
          ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/30 shadow-sm'
          : 'bg-card hover:bg-accent/50 border-border',
      )}
      onClick={() => onClick?.(entry)}
    >
      {/* Rank */}
      <div className="flex-shrink-0">
        <RankBadge rank={entry.rank} isCurrentUser={isHighlighted} />
      </div>

      {/* Avatar */}
      <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-primary/20">
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold">
          {entry.userName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-base truncate">{entry.userName}</h3>
          {isHighlighted && (
            <Badge variant="secondary" className="text-xs">
              <User className="h-3 w-3 mr-1" />
              You
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {entry.testTitle && (
            <>
              <span className="truncate max-w-[200px]">{entry.testTitle}</span>
              <span>•</span>
            </>
          )}
          {entry.courseName && (
            <>
              <span className="truncate max-w-[150px]">{entry.courseName}</span>
              <span>•</span>
            </>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(entry.completedAt)}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <div className="text-2xl font-bold text-primary">{entry.score}%</div>
        {entry.totalPoints !== undefined && entry.maxPoints !== undefined && (
          <div className="text-xs text-muted-foreground">
            {entry.totalPoints} / {entry.maxPoints} pts
          </div>
        )}
      </div>

      {/* Additional Stats */}
      <div className="hidden md:flex flex-col items-end gap-1 text-xs text-muted-foreground">
        {entry.timeSpent !== undefined && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTimeSpent(entry.timeSpent)}</span>
          </div>
        )}
        {entry.correctAnswers !== undefined &&
          entry.totalQuestions !== undefined && (
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>
                {entry.correctAnswers}/{entry.totalQuestions}
              </span>
            </div>
          )}
        <div className="flex items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          <span>
            {entry.attempts} attempt{entry.attempts > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Loading skeleton
 */
const LeaderboardSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    ))}
  </div>
);

/**
 * Main Test Score Leaderboard Component
 */
export const TestScoreLeaderboard: React.FC<TestScoreLeaderboardProps> = ({
  courseId,
  testId,
  sortBy = 'score',
  order,
  limit = 20,
  currentUserId,
  showFilters = true,
  className,
  onEntryClick,
}) => {
  const [data, setData] = useState<LeaderboardApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [currentSortBy, setCurrentSortBy] =
    useState<TestScoreLeaderboardSortBy>(sortBy);
  const [currentOrder, setCurrentOrder] = useState<'asc' | 'desc'>(
    order || 'desc',
  );

  // Fetch data
  const fetchData = useCallback(
    async (newCursor?: string, reset = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchLeaderboard({
          courseId,
          testId,
          sortBy: currentSortBy,
          order: currentOrder,
          limit,
          cursor: newCursor,
          currentUserId,
        });

        if (reset || !data) {
          setData(result);
        } else {
          setData((prev) => ({
            ...result,
            data: [...(prev?.data || []), ...result.data],
          }));
        }
        setCursor(result.nextCursor || undefined);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [courseId, testId, currentSortBy, currentOrder, limit, currentUserId, data],
  );

  // Initial load
  useEffect(() => {
    setCursor(undefined);
    fetchData(undefined, true);
  }, [courseId, testId, currentSortBy, currentOrder, limit, currentUserId]);

  // Toggle sort order when clicking sort by
  const handleSortChange = (newSortBy: TestScoreLeaderboardSortBy) => {
    if (newSortBy === currentSortBy) {
      // Toggle order
      setCurrentOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setCurrentSortBy(newSortBy);
      // Set default order based on sort field
      setCurrentOrder(newSortBy === 'score' ? 'desc' : 'asc');
    }
  };

  // Load more (infinite scroll simulation)
  const loadMore = () => {
    if (cursor && !isLoading) {
      fetchData(cursor);
    }
  };

  // Highlighted current user entry (or first entry if viewing their page)
  const highlightedEntryId = currentUserId
    ? data?.currentUserEntry?.userId ||
      data?.data.find((d) => d.userId === currentUserId)?.userId
    : null;

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Test Score Leaderboard
            </CardTitle>
            <CardDescription className="mt-1">
              Rankings for {currentSortBy.replace(/([A-Z])/g, ' $1').trim()}{' '}
              {currentOrder === 'desc' ? '(highest first)' : '(lowest first)'}
            </CardDescription>
          </div>

          {showFilters && (
            <div className="flex items-center gap-2">
              <Select
                value={currentSortBy}
                onValueChange={handleSortChange as any}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Score</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="timeSpent">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Time Spent</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="attempts">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span>Attempts</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {currentSortBy === 'score' && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                  }
                  title={`Currently: ${currentOrder === 'desc' ? 'Highest first' : 'Lowest first'}`}
                >
                  {currentOrder === 'desc' ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchData(undefined, true)}
                disabled={isLoading}
              >
                <RefreshCw
                  className={cn('h-4 w-4', isLoading && 'animate-spin')}
                />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error ? (
          <div className="text-center py-8 text-destructive">
            <p className="font-medium">Failed to load leaderboard</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchData(undefined, true)}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : isLoading && !data ? (
          <LeaderboardSkeleton />
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No test scores found</p>
            {courseId && (
              <p className="text-xs text-muted-foreground mt-1">
                Try selecting a different course or test
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {data.data.map((entry) => (
                  <LeaderboardRow
                    key={`${entry.userId}-${entry.testId}-${entry.attempts}`}
                    entry={entry}
                    isHighlighted={entry.userId === currentUserId}
                    onClick={onEntryClick}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Current user position if not on current page */}
            {data.currentUserEntry &&
              !data.data.some((e) => e.userId === currentUserId) && (
                <>
                  <Separator className="my-4" />
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <Badge variant="outline" className="bg-background px-4">
                        Your Position
                      </Badge>
                    </div>
                  </div>
                  <LeaderboardRow
                    entry={data.currentUserEntry}
                    isHighlighted={true}
                    onClick={onEntryClick}
                  />
                </>
              )}

            {/* Load More Button */}
            {data.hasMore && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Result count info */}
            <div className="text-xs text-muted-foreground text-center mt-4">
              Showing {data.data.length} of {data.totalCount.toLocaleString()}{' '}
              scores
              {data.hasMore && ` (page load limit: ${limit})`}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TestScoreLeaderboard;
