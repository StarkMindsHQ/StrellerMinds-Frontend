'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Clock, Users, Star, Play, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface VideoRecommendation {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  instructor: string;
  studentsCount: number;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  views: number;
  relevanceScore?: number;
  isLive?: boolean;
}

export interface RealTimeRecommendationsProps {
  currentVideoId: string;
  onVideoSelect: (videoId: string) => void;
  maxRecommendations?: number;
  refreshInterval?: number;
  className?: string;
  showRelevanceScore?: boolean;
  enableWebSocket?: boolean;
}

// Animation variants
const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.8,
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Mock API service
class RecommendationService {
  private websocket: WebSocket | null = null;
  private subscribers: ((recommendations: VideoRecommendation[]) => void)[] =
    [];

  async fetchRecommendations(
    currentVideoId: string,
  ): Promise<VideoRecommendation[]> {
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mockRecommendations: VideoRecommendation[] = [
      {
        id: 'rec-1',
        title: 'Advanced Smart Contract Patterns',
        description:
          'Learn advanced patterns for secure smart contract development',
        duration: 1800,
        thumbnailUrl: undefined,
        instructor: 'Dr. Sarah Chen',
        studentsCount: 3420,
        rating: 4.8,
        level: 'Advanced',
        tags: ['Solidity', 'Security', 'DeFi'],
        views: 12500,
        relevanceScore: 0.95,
        isLive: false,
      },
      {
        id: 'rec-2',
        title: 'DeFi Yield Farming Strategies',
        description: 'Master the art of yield farming and liquidity provision',
        duration: 2400,
        thumbnailUrl: undefined,
        instructor: 'Michael Rodriguez',
        studentsCount: 2890,
        rating: 4.6,
        level: 'Intermediate',
        tags: ['DeFi', 'Yield', 'Trading'],
        views: 8900,
        relevanceScore: 0.88,
        isLive: false,
      },
      {
        id: 'rec-3',
        title: 'Web3 Frontend Development Live',
        description: 'Build modern Web3 applications with React and Ethereum',
        duration: 3600,
        thumbnailUrl: undefined,
        instructor: 'Alex Thompson',
        studentsCount: 1560,
        rating: 4.9,
        level: 'Intermediate',
        tags: ['React', 'Web3', 'Frontend'],
        views: 5400,
        relevanceScore: 0.82,
        isLive: true,
      },
    ];

    return mockRecommendations
      .filter((rec) => rec.id !== currentVideoId)
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  connectWebSocket(currentVideoId: string) {
    if (typeof window === 'undefined') return;

    try {
      this.websocket = new WebSocket('ws://localhost:3001/recommendations');

      this.websocket.onopen = () => {
        console.log('Connected to recommendations WebSocket');
        this.websocket?.send(
          JSON.stringify({
            type: 'subscribe',
            videoId: currentVideoId,
          }),
        );
      };

      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'recommendations_update') {
          this.subscribers.forEach((callback) =>
            callback(data.recommendations),
          );
        }
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.websocket.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 3 seconds
        setTimeout(() => this.connectWebSocket(currentVideoId), 3000);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  disconnectWebSocket() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  subscribe(callback: (recommendations: VideoRecommendation[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }
}

const recommendationService = new RecommendationService();

// Recommendation Card Component
const RecommendationCard: React.FC<{
  recommendation: VideoRecommendation;
  onSelect: (id: string) => void;
  index: number;
  showRelevanceScore?: boolean;
}> = ({ recommendation, onSelect, index, showRelevanceScore }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(recommendation.id)}
      className="group cursor-pointer"
    >
      <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Thumbnail Container */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
          {/* Live Badge */}
          {recommendation.isLive && (
            <div className="absolute top-2 left-2 z-10">
              <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
          )}

          {/* Relevance Score */}
          {showRelevanceScore && recommendation.relevanceScore && (
            <div className="absolute top-2 right-2 z-10">
              <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                {Math.round(recommendation.relevanceScore * 100)}%
              </div>
            </div>
          )}

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white/90 hover:bg-white text-blue-600 rounded-full p-3 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            </motion.div>
          </motion.div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2">
            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
              {formatDuration(recommendation.duration)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {recommendation.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {recommendation.description}
          </p>

          {/* Instructor and Level */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {recommendation.instructor}
            </span>
            <span
              className={cn(
                'text-xs font-semibold px-2 py-1 rounded-full',
                getLevelColor(recommendation.level),
              )}
            >
              {recommendation.level}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {recommendation.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {recommendation.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{recommendation.tags.length - 3}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{recommendation.studentsCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{recommendation.rating}</span>
              </div>
            </div>
            <span>{formatViews(recommendation.views)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export const RealTimeRecommendations: React.FC<
  RealTimeRecommendationsProps
> = ({
  currentVideoId,
  onVideoSelect,
  maxRecommendations = 3,
  refreshInterval = 30000,
  className,
  showRelevanceScore = false,
  enableWebSocket = false,
}) => {
  const [recommendations, setRecommendations] = useState<VideoRecommendation[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch recommendations
  const fetchRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const recs =
        await recommendationService.fetchRecommendations(currentVideoId);
      setRecommendations(recs.slice(0, maxRecommendations));
      setLastUpdated(new Date());

      // Trigger animation
      await controls.start('show');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch recommendations',
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentVideoId, maxRecommendations, controls]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (enableWebSocket) {
      recommendationService.connectWebSocket(currentVideoId);

      const unsubscribe = recommendationService.subscribe(
        (newRecommendations) => {
          setRecommendations(newRecommendations.slice(0, maxRecommendations));
          setLastUpdated(new Date());
        },
      );

      return () => {
        unsubscribe();
        recommendationService.disconnectWebSocket();
      };
    }
  }, [currentVideoId, maxRecommendations, enableWebSocket]);

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchRecommendations();

    if (!enableWebSocket && refreshInterval > 0) {
      const interval = setInterval(fetchRecommendations, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchRecommendations, enableWebSocket, refreshInterval]);

  // Handle video selection
  const handleVideoSelect = useCallback(
    (videoId: string) => {
      onVideoSelect(videoId);
    },
    [onVideoSelect],
  );

  if (error) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="text-red-600 dark:text-red-400 mb-2">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchRecommendations}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recommended for You
          </h2>
        </div>

        {lastUpdated && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && recommendations.length === 0 && (
        <div className="grid gap-4">
          {Array.from({ length: maxRecommendations }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl h-48 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Recommendations Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="grid gap-4"
      >
        <AnimatePresence mode="popLayout">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={`${recommendation.id}-${lastUpdated.getTime()}`}
              recommendation={recommendation}
              onSelect={handleVideoSelect}
              index={index}
              showRelevanceScore={showRelevanceScore}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {!isLoading && recommendations.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-600 dark:text-gray-400">
            No recommendations available yet
          </p>
        </div>
      )}
    </div>
  );
};

export default RealTimeRecommendations;
