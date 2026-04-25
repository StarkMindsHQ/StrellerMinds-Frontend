'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Calendar,
  Filter,
  Crown,
  Star,
  Zap,
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
import { cn } from '@/lib/utils';

// Types
interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  username: string;
  role: 'student' | 'instructor' | 'admin' | 'moderator';
  rank: number;
  score: number;
  level: number;
  trend?: 'up' | 'down' | 'stable' | 'new';
  stats: {
    posts: number;
    comments: number;
    likes: number;
    shares: number;
    contributions: number;
  };
  badges: string[];
  joinDate: string;
  lastActive: string;
}

interface LeaderboardFilters {
  timeframe: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all-time';
  category: 'overall' | 'posts' | 'comments' | 'likes' | 'contributions';
  role?: 'all' | 'student' | 'instructor' | 'admin';
}

interface CommunityLeaderboardProps {
  currentUserId?: string;
  className?: string;
  showPagination?: boolean;
  itemsPerPage?: number;
  onUserClick?: (user: CommunityUser) => void;
}

// Mock data generator
const generateMockUsers = (count: number): CommunityUser[] => {
  const roles: Array<'student' | 'instructor' | 'admin' | 'moderator'> = [
    'student',
    'instructor',
    'admin',
    'moderator',
  ];
  const badges = [
    'Top Contributor',
    'Helpful',
    'Creative',
    'Mentor',
    'Rising Star',
    'Expert',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    username: `user${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    rank: i + 1,
    score: Math.floor(Math.random() * 10000) + 1000,
    level: Math.floor(Math.random() * 50) + 1,
    trend: ['up', 'down', 'stable', 'new'][
      Math.floor(Math.random() * 4)
    ] as any,
    stats: {
      posts: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 2000),
      shares: Math.floor(Math.random() * 200),
      contributions: Math.floor(Math.random() * 100),
    },
    badges: badges.slice(0, Math.floor(Math.random() * 3) + 1),
    joinDate: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    lastActive: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  }));
};

// Rank badge component for top 3 positions
const RankBadge: React.FC<{ rank: number; isCurrentUser?: boolean }> = ({
  rank,
  isCurrentUser,
}) => {
  if (rank === 1) {
    return (
      <div className="relative">
        <Crown className="h-8 w-8 text-yellow-500 drop-shadow-lg" />
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
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {rank}
    </div>
  );
};

// Trend indicator component
const TrendIndicator: React.FC<{
  trend?: 'up' | 'down' | 'stable' | 'new';
}> = ({ trend }) => {
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

// User role badge
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const variants: Record<
    string,
    {
      variant: 'default' | 'secondary' | 'destructive' | 'outline';
      color: string;
    }
  > = {
    student: { variant: 'secondary', color: 'bg-blue-100 text-blue-800' },
    instructor: { variant: 'default', color: 'bg-purple-100 text-purple-800' },
    admin: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
    moderator: { variant: 'outline', color: 'bg-green-100 text-green-800' },
  };

  const config = variants[role] || variants.student;

  return (
    <Badge variant={config.variant} className={cn('text-xs', config.color)}>
      {role}
    </Badge>
  );
};

// Leaderboard entry row component
interface LeaderboardRowProps {
  user: CommunityUser;
  isHighlighted?: boolean;
  onClick?: (user: CommunityUser) => void;
  showTrends?: boolean;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  user,
  isHighlighted,
  onClick,
  showTrends,
}) => {
  const formatLastActive = (date: string) => {
    const now = new Date();
    const lastActive = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

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
      onClick={() => onClick?.(user)}
    >
      {/* Rank */}
      <div className="flex-shrink-0">
        <RankBadge rank={user.rank} isCurrentUser={isHighlighted} />
      </div>

      {/* Avatar */}
      <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-primary/20">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold">
          {user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-base truncate">{user.name}</h3>
          <span className="text-muted-foreground text-sm">
            @{user.username}
          </span>
          {showTrends && user.trend && <TrendIndicator trend={user.trend} />}
          {isHighlighted && (
            <Badge variant="secondary" className="text-xs">
              You
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <RoleBadge role={user.role} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3" />
            <span>Level {user.level}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>{user.score.toLocaleString()} pts</span>
          </div>
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {user.badges.map((badge, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0.5"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{user.stats.posts}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3 rotate-45" />
            <span>{user.stats.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{user.stats.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            <span>{user.stats.shares}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">•</span>
            <span>{formatLastActive(user.lastActive)}</span>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <div className="text-2xl font-bold text-primary">
          {user.score.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">points</div>
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
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    ))}
  </div>
);

// Main Community Leaderboard Component
export const CommunityLeaderboard: React.FC<CommunityLeaderboardProps> = ({
  currentUserId,
  className,
  showPagination = true,
  itemsPerPage = 20,
  onUserClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeframe: 'week',
    category: 'overall',
    role: 'all',
  });

  // Simulate API call
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUsers = generateMockUsers(100);
      // Add current user if not in top results
      if (currentUserId && !mockUsers.some((u) => u.id === currentUserId)) {
        const currentUser: CommunityUser = {
          id: currentUserId,
          name: 'Current User',
          username: 'currentuser',
          role: 'student',
          rank: 45,
          score: 2500,
          level: 12,
          trend: 'up',
          stats: {
            posts: 25,
            comments: 89,
            likes: 156,
            shares: 12,
            contributions: 8,
          },
          badges: ['Rising Star'],
          joinDate: '2023-06-15T00:00:00Z',
          lastActive: new Date().toISOString(),
        };
        mockUsers.push(currentUser);
      }

      setUsers(mockUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, [filters, currentUserId]);

  // Filter and paginate users
  const filteredUsers = users.filter((user) => {
    if (filters.role !== 'all' && user.role !== filters.role) return false;
    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleFilterChange = (key: keyof LeaderboardFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const refreshLeaderboard = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(generateMockUsers(100));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Community Leaderboard
            </CardTitle>
            <CardDescription className="mt-1">
              Top contributors based on activity and engagement
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filters.timeframe}
              onValueChange={(value) => handleFilterChange('timeframe', value)}
            >
              <SelectTrigger className="w-[120px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
                <SelectItem value="comments">Comments</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
                <SelectItem value="contributions">Contributions</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.role}
              onValueChange={(value) => handleFilterChange('role', value)}
            >
              <SelectTrigger className="w-[120px]">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="instructor">Instructors</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={refreshLeaderboard}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn('h-4 w-4', isLoading && 'animate-spin')}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <LeaderboardSkeleton />
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {paginatedUsers.map((user) => (
                <LeaderboardRow
                  key={user.id}
                  user={user}
                  isHighlighted={currentUserId === user.id}
                  onClick={onUserClick}
                  showTrends={true}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {showPagination && paginatedUsers.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
              </span>{' '}
              of <span className="font-medium">{filteredUsers.length}</span>{' '}
              users
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
                Page {currentPage} of {totalPages}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
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

export default CommunityLeaderboard;
