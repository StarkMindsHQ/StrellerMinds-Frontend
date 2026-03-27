'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import type { LeaderboardEntry, LeaderboardProps, LeaderboardMetricType } from '@/types/leaderboard';

// Fetch leaderboard data from API
const fetchLeaderboard = async (
  metricType: LeaderboardMetricType,
  courseId?: string,
  limit?: number,
  offset?: number,
  userId?: string
): Promise<any> => {
  const params = new URLSearchParams({
    metricType,
    limit: (limit || 20).toString(),
    offset: (offset || 0).toString(),
  });

  if (courseId) params.append('courseId', courseId);
  if (userId) params.append('userId', userId);

  const response = await fetch(`/api/leaderboard/students?${params}`);
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
};

interface LeaderboardData {
  entries: LeaderboardEntry[];
  totalCount: number;
  currentUserEntry?: LeaderboardEntry;
  hasMore: boolean;
  filters: any;
}

// Rank badge component for top 3 positions
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
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
    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
      {rank}
    </div>
  );
};

// Trend indicator component
const TrendIndicator: React.FC<{ trend?: 'up' | 'down' | 'stable' | 'new' }> = ({ trend }) => {
  if (!trend || trend === 'stable') return null;
  
  if (trend === 'up') {
    return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  }
  if (trend === 'down') {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  if (trend === 'new') {
    return <Sparkles className="h-4 w-4 text-blue-500" />;
  }
  return null;
};

// Leaderboard entry row component
interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isHighlighted?: boolean;
  onClick?: (entry: LeaderboardEntry) => void;
  showTrends?: boolean;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  entry,
  isHighlighted,
  onClick,
  showTrends,
}) => {
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
          : 'bg-card hover:bg-accent/50 border-border'
      )}
      onClick={() => onClick?.(entry)}
    >
      {/* Rank */}
      <div className="flex-shrink-0">
        <RankBadge rank={entry.rank} />
      </div>

      {/* Avatar */}
      <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-primary/20">
        <AvatarImage src={entry.avatarUrl} alt={entry.studentName} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold">
          {entry.studentName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Student Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base truncate">{entry.studentName}</h3>
          {showTrends && entry.trend && (
            <TrendIndicator trend={entry.trend} />
          )}
          {isHighlighted && (
            <Badge variant="secondary" className="text-xs">You</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>{entry.cohort}</span>
          {entry.courseName && (
            <>
              <span>•</span>
              <span className="truncate">{entry.courseName}</span>
            </>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <div className="text-2xl font-bold text-primary">{entry.score}%</div>
        <div className="text-xs text-muted-foreground">
          {entry.metricType === 'completion' && 'Completion'}
          {entry.metricType === 'quiz_score' && 'Quiz Avg'}
          {entry.metricType === 'combined' && 'Combined'}
        </div>
      </div>

      {/* Additional Stats (Desktop) */}
      <div className="hidden md:flex flex-col items-end gap-1 text-xs text-muted-foreground">
        {entry.coursesCompleted !== undefined && (
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            <span>{entry.coursesCompleted} courses</span>
          </div>
        )}
        {entry.quizzesTaken !== undefined && (
          <div className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            <span>{entry.quizzesTaken} quizzes</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Loading skeleton
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

// Main Leaderboard Component
export const TopStudentsLeaderboard: React.FC<LeaderboardProps> = ({
  metricType = 'completion',
  courseId,
  limit = 20,
  showPagination = true,
  highlightUserId,
  showTrends = false,
  enableRealTime = false,
  className,
  onStudentClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const offset = (currentPage - 1) * limit;

  // Fetch leaderboard data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchLeaderboard(metricType, courseId, limit, offset, highlightUserId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [metricType, courseId, offset, limit, highlightUserId]);

  const refetch = async () => {
    try {
      setIsLoading(true);
      const result = await fetchLeaderboard(metricType, courseId, limit, offset, highlightUserId);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricTypeChange = (value: LeaderboardMetricType) => {
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    if (data?.hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const totalPages = Math.ceil((data?.totalCount || 0) / limit);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Top Students Leaderboard
            </CardTitle>
            <CardDescription className="mt-1">
              Ranking by {metricType.replace('_', ' ')} performance
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={metricType} onValueChange={handleMetricTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completion">Course Completion</SelectItem>
                <SelectItem value="quiz_score">Quiz Scores</SelectItem>
                <SelectItem value="combined">Combined Score</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error ? (
          <div className="text-center py-8 text-destructive">
            <p className="font-medium">Failed to load leaderboard</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : isLoading ? (
          <LeaderboardSkeleton />
        ) : !data?.entries || data.entries.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No students found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {data.entries.map((entry: LeaderboardEntry) => (
                <LeaderboardRow
                  key={entry.studentId}
                  entry={entry}
                  isHighlighted={highlightUserId === entry.studentId}
                  onClick={onStudentClick}
                  showTrends={showTrends}
                />
              ))}
            </AnimatePresence>

            {/* Current User Position (if not in top results) */}
            {data.currentUserEntry && 
             !data.entries.some((e: LeaderboardEntry) => e.studentId === highlightUserId) && (
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center">
                  <Badge variant="outline" className="bg-background px-4">
                    Your Position
                  </Badge>
                </div>
              </div>
            )}
            
            {data.currentUserEntry && 
             !data.entries.some((e: LeaderboardEntry) => e.studentId === highlightUserId) && (
              <LeaderboardRow
                entry={data.currentUserEntry}
                isHighlighted={true}
                onClick={onStudentClick}
                showTrends={showTrends}
              />
            )}
          </div>
        )}

        {/* Pagination */}
        {showPagination && data && data.entries.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{offset + 1}</span> to{' '}
              <span className="font-medium">{Math.min(offset + limit, data.totalCount)}</span> of{' '}
              <span className="font-medium">{data.totalCount}</span> students
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Badge variant="outline" className="px-4">
                Page {currentPage} of {totalPages || 1}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!data.hasMore}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopStudentsLeaderboard;
