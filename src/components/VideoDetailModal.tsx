'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  Users, 
  Star, 
  Play, 
  Heart, 
  Share2, 
  Download, 
  ThumbsUp,
  MessageCircle,
  Calendar,
  Eye,
  Award,
  BookOpen,
  Loader2,
  User
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Types
export interface VideoComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: VideoComment[];
}

export interface VideoStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  downloads: number;
  watchTime: number;
  completionRate: number;
}

export interface VideoDetail {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    subscribers?: number;
  };
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isLive?: boolean;
  stats: VideoStats;
  comments: VideoComment[];
  relatedVideos?: any[];
}

export interface VideoDetailModalProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  showRelatedVideos?: boolean;
  enableComments?: boolean;
  enableStats?: boolean;
}

// Animation variants
const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
    }
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Skeleton Components
const VideoDetailSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>

    {/* Stats Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>

    {/* Description Skeleton */}
    <div className="space-y-3">
      <Skeleton className="h-6 w-24" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>

    {/* Comments Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-20" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Comment Component
const CommentItem: React.FC<{ comment: VideoComment }> = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <motion.div variants={itemVariants} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex-shrink-0">
        {comment.userAvatar ? (
          <img 
            src={comment.userAvatar} 
            alt={comment.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {comment.userName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimestamp(comment.timestamp)}
          </span>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {comment.content}
        </p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              isLiked 
                ? "text-red-600 dark:text-red-400" 
                : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            )}
          >
            <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
            <span>{likesCount}</span>
          </button>
          
          <button className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Mock API service
class VideoDetailService {
  async fetchVideoDetails(videoId: string): Promise<VideoDetail> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    const mockVideo: VideoDetail = {
      id: videoId,
      title: "Advanced React Patterns and Performance Optimization",
      description: "Dive deep into advanced React patterns that will take your development skills to the next level. This comprehensive course covers everything from custom hooks and context optimization to advanced state management patterns and performance tuning techniques. Learn how to build scalable, maintainable React applications that perform flawlessly even with complex requirements. We'll explore real-world scenarios and best practices used by top tech companies, including code splitting, lazy loading, memoization strategies, and much more. By the end of this course, you'll have the confidence and skills to tackle any React challenge that comes your way.",
      duration: 3600,
      thumbnailUrl: undefined,
      instructor: {
        id: "instructor-1",
        name: "Dr. Sarah Chen",
        avatar: undefined,
        bio: "Senior React Engineer with 10+ years of experience",
        subscribers: 125000,
      },
      category: "Web Development",
      level: "Advanced",
      tags: ["React", "JavaScript", "Performance", "Hooks", "State Management"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
      isLive: false,
      stats: {
        views: 45230,
        likes: 3420,
        comments: 156,
        shares: 89,
        downloads: 234,
        watchTime: 720000,
        completionRate: 78.5,
      },
      comments: [
        {
          id: "comment-1",
          userId: "user-1",
          userName: "Alex Johnson",
          content: "This is exactly what I was looking for! The explanations are clear and the examples are practical. Thank you for creating such high-quality content.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 24,
          isLiked: false,
        },
        {
          id: "comment-2",
          userId: "user-2",
          userName: "Maria Garcia",
          content: "The section on custom hooks was particularly helpful. I've already started implementing these patterns in my current project and seeing great results.",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          likes: 18,
          isLiked: true,
        },
        {
          id: "comment-3",
          userId: "user-3",
          userName: "David Kim",
          content: "Would love to see a follow-up video covering React Server Components and how they integrate with these patterns. Keep up the great work!",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          likes: 12,
          isLiked: false,
        },
      ],
    };

    // Simulate occasional errors
    if (Math.random() < 0.1) {
      throw new Error('Failed to load video details. Please try again.');
    }

    return mockVideo;
  }

  async likeVideo(videoId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // API call to like video
  }

  async shareVideo(videoId: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return `https://strellerminds.com/videos/${videoId}`;
  }
}

const videoDetailService = new VideoDetailService();

// Main Component
export const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
  videoId,
  isOpen,
  onClose,
  className,
  showRelatedVideos = true,
  enableComments = true,
  enableStats = true,
}) => {
  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Fetch video details when modal opens
  useEffect(() => {
    if (isOpen && videoId) {
      fetchVideoDetails();
    }
  }, [isOpen, videoId]);

  const fetchVideoDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const details = await videoDetailService.fetchVideoDetails(videoId);
      setVideoDetail(details);
      setLikesCount(details.stats.likes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!videoDetail) return;
    
    try {
      await videoDetailService.likeVideo(videoDetail.id);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Failed to like video:', err);
    }
  };

  const handleShare = async () => {
    if (!videoDetail) return;
    
    try {
      const shareUrl = await videoDetailService.shareVideo(videoDetail.id);
      if (navigator.share) {
        await navigator.share({
          title: videoDetail.title,
          text: videoDetail.description,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        // Show toast notification
      }
    } catch (err) {
      console.error('Failed to share video:', err);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-4xl max-h-[90vh] overflow-hidden",
        className
      )}>
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="h-full flex flex-col"
        >
          {/* Header */}
          <DialogHeader className="flex-shrink-0 pb-4">
            <div className="flex items-start justify-between">
              <DialogTitle className="text-xl font-semibold line-clamp-2 pr-4">
                {videoDetail?.title || 'Loading...'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {isLoading ? (
                <VideoDetailSkeleton />
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 dark:text-red-400 mb-4">
                    <X className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                  <Button onClick={fetchVideoDetails} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : videoDetail ? (
                <>
                  {/* Video Info */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full",
                        getLevelColor(videoDetail.level)
                      )}>
                        {videoDetail.level}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(videoDetail.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(videoDetail.createdAt).toLocaleDateString()}</span>
                      </div>
                      {videoDetail.isLive && (
                        <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                          LIVE
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {videoDetail.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Stats */}
                  {enableStats && (
                    <motion.div variants={itemVariants}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                            <Eye className="w-4 h-4" />
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatNumber(videoDetail.stats.views)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
                        </div>
                        
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                            <ThumbsUp className="w-4 h-4" />
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatNumber(likesCount)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
                        </div>
                        
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatNumber(videoDetail.stats.comments)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Comments</div>
                        </div>
                        
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                            <Award className="w-4 h-4" />
                          </div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {videoDetail.stats.completionRate}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Completion</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div variants={itemVariants} className="flex gap-2">
                    <Button
                      onClick={handleLike}
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "flex items-center gap-2",
                        isLiked && "bg-red-600 hover:bg-red-700 text-white"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                      {isLiked ? "Liked" : "Like"}
                    </Button>
                    
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </motion.div>

                  {/* Description */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <h3 className="text-lg font-semibold">Description</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {videoDetail.description}
                    </p>
                  </motion.div>

                  {/* Instructor Info */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <h3 className="text-lg font-semibold">Instructor</h3>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-shrink-0">
                        {videoDetail.instructor.avatar ? (
                          <img 
                            src={videoDetail.instructor.avatar} 
                            alt={videoDetail.instructor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {videoDetail.instructor.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {videoDetail.instructor.bio}
                        </p>
                        {videoDetail.instructor.subscribers && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{formatNumber(videoDetail.instructor.subscribers)} subscribers</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Comments */}
                  {enableComments && (
                    <motion.div variants={itemVariants} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Comments ({videoDetail.stats.comments})
                        </h3>
                        <Button variant="outline" size="sm">
                          Add Comment
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                          {videoDetail.comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDetailModal;
