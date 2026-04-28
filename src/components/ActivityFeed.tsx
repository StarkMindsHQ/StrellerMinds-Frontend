'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  Filter, 
  RefreshCw, 
  Users, 
  BookOpen, 
  Trophy, 
  Clock,
  TrendingUp,
  Search
} from 'lucide-react';
import { 
  activityFeedService, 
  getActivityTypeLabel, 
  getActivityTypeIcon, 
  getActivityTypeColor 
} from '@/services/activityFeedService';
import { ActivityEntry, ActivityFilter, ActivityType, ActivityFeedProps } from '@/types/activity';

const PAGE_SIZE = 20;

export default function ActivityFeed({
  filter: initialFilter = {},
  maxItems,
  showFilters = true,
  realTime = true,
  className = ''
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<ActivityFilter>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [realTimeEnabled, setRealTimeEnabled] = useState(realTime);
  const [stats, setStats] = useState(activityFeedService.getStatistics());

  // Load initial activities
  const loadActivities = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = resetPage ? 0 : page;
      const result = await activityFeedService.getActivities(
        filter,
        currentPage,
        PAGE_SIZE
      );
      
      if (resetPage) {
        setActivities(result.activities);
        setPage(0);
      } else {
        setActivities(prev => [...prev, ...result.activities]);
      }
      
      setHasMore(result.hasMore);
      setPage(currentPage);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  // Load more activities
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadActivities(false);
    }
  }, [loading, hasMore, loadActivities]);

  // Refresh activities
  const refresh = useCallback(() => {
    loadActivities(true);
    setStats(activityFeedService.getStatistics());
  }, [loadActivities]);

  // Filter activities by search query
  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    
    const query = searchQuery.toLowerCase();
    return activities.filter(activity => 
      activity.userName.toLowerCase().includes(query) ||
      activity.userEmail?.toLowerCase().includes(query) ||
      activity.targetTitle?.toLowerCase().includes(query) ||
      activity.courseTitle?.toLowerCase().includes(query) ||
      getActivityTypeLabel(activity.action).toLowerCase().includes(query)
    );
  }, [activities, searchQuery]);

  // Apply maxItems limit
  const displayActivities = useMemo(() => {
    return maxItems ? filteredActivities.slice(0, maxItems) : filteredActivities;
  }, [filteredActivities, maxItems]);

  // Initialize and subscribe to real-time updates
  useEffect(() => {
    loadActivities(true);
    
    let unsubscribe: (() => void) | null = null;
    
    if (realTimeEnabled) {
      unsubscribe = activityFeedService.subscribe((newActivities) => {
        setActivities(newActivities.slice(0, (page + 1) * PAGE_SIZE));
        setStats(activityFeedService.getStatistics());
      });
      
      activityFeedService.connectWebSocket();
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
      if (realTimeEnabled) activityFeedService.disconnect();
    };
  }, [loadActivities, realTimeEnabled, page]);

  // Update filter and reload
  const updateFilter = useCallback((newFilter: Partial<ActivityFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  // Format timestamp
  const formatTimestamp = useCallback((timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    
    return timestamp.toLocaleDateString();
  }, []);

  // Get activity description
  const getActivityDescription = useCallback((activity: ActivityEntry) => {
    const actionLabel = getActivityTypeLabel(activity.action);
    
    if (activity.targetTitle) {
      return `${actionLabel}: ${activity.targetTitle}`;
    }
    
    if (activity.courseTitle) {
      return `${actionLabel}: ${activity.courseTitle}`;
    }
    
    return actionLabel;
  }, []);

  // Render activity item
  const renderActivityItem = useCallback((activity: ActivityEntry) => {
    const colorClass = getActivityTypeColor(activity.action);
    const icon = getActivityTypeIcon(activity.action);
    
    return (
      <div key={activity.id} className="flex items-start gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${colorClass} flex-shrink-0`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="w-6 h-6">
              <AvatarImage src={activity.userAvatar} alt={activity.userName} />
              <AvatarFallback className="text-xs">
                {activity.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm text-gray-900">{activity.userName}</span>
            <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
          </div>
          
          <p className="text-sm text-gray-700 mb-1">{getActivityDescription(activity)}</p>
          
          {/* Show metadata */}
          {activity.metadata && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {activity.metadata.score !== undefined && (
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Score: {activity.metadata.score}%
                </span>
              )}
              {activity.metadata.progress !== undefined && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Progress: {activity.metadata.progress}%
                </span>
              )}
              {activity.metadata.achievementTitle && (
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {activity.metadata.achievementTitle}
                </span>
              )}
            </div>
          )}
          
          {/* Show course info */}
          {activity.courseTitle && activity.targetTitle !== activity.courseTitle && (
            <div className="text-xs text-gray-500 mt-1">
              Course: {activity.courseTitle}
            </div>
          )}
        </div>
      </div>
    );
  }, [formatTimestamp, getActivityDescription]);

  // Render skeleton loader
  const renderSkeleton = useCallback(() => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 border-b border-gray-100">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>
      ))}
    </div>
  ), []);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Learning Activity Feed
            {realTimeEnabled && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">Live</span>
              </div>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
              >
                {realTimeEnabled ? 'Pause' : 'Resume'} Live
              </Button>
            )}
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalActivities}</div>
            <div className="text-xs text-gray-500">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.last24Hours}</div>
            <div className="text-xs text-gray-500">Last 24 Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.uniqueUsers}</div>
            <div className="text-xs text-gray-500">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.uniqueCourses}</div>
            <div className="text-xs text-gray-500">Active Courses</div>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select
              value={filter.type || 'all'}
              onValueChange={(value) => updateFilter({ type: value === 'all' ? undefined : value as ActivityType })}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="course_enrollment">Course Enrollments</SelectItem>
                <SelectItem value="lesson_completion">Lesson Completions</SelectItem>
                <SelectItem value="quiz_submission">Quiz Submissions</SelectItem>
                <SelectItem value="certificate_issuance">Certificates</SelectItem>
                <SelectItem value="video_progress">Video Progress</SelectItem>
                <SelectItem value="achievement_unlocked">Achievements</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setFilter({});
                setSearchQuery('');
                setPage(0);
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        {error && (
          <div className="p-4 text-center">
            <div className="text-red-600 mb-2">Error: {error}</div>
            <Button onClick={refresh} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        )}
        
        {loading && activities.length === 0 ? (
          <div className="p-4">
            {renderSkeleton()}
          </div>
        ) : displayActivities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500">
              {searchQuery || filter.type || filter.courseId
                ? 'Try adjusting your filters or search query'
                : 'Activities will appear here as users interact with courses'
              }
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {displayActivities.map(renderActivityItem)}
            
            {hasMore && !maxItems && (
              <div className="p-4 text-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
