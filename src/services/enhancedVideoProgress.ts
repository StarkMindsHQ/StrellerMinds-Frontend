import { VideoProgress } from '@/types/progress';

export interface EnhancedVideoProgress extends VideoProgress {
  userId: string;
  sessionId: string;
  lastPosition: number;
  watchTime: number; // Total time spent watching in seconds
  sessionWatchTime: number; // Time spent in current session
  completedAt?: Date;
  bookmarks: Array<{
    id: string;
    time: number;
    title?: string;
    createdAt: Date;
  }>;
  playbackSpeed: number;
  quality?: string;
  subtitlesEnabled: boolean;
}

export interface VideoProgressSession {
  id: string;
  userId: string;
  videoId: string;
  startTime: Date;
  endTime?: Date;
  totalWatchTime: number;
  completed: boolean;
  maxPosition: number;
  events: Array<{
    type: 'play' | 'pause' | 'seek' | 'speed_change' | 'quality_change';
    timestamp: Date;
    data?: any;
  }>;
}

class EnhancedVideoProgressService {
  private static instance: EnhancedVideoProgressService;
  private progress: Map<string, EnhancedVideoProgress> = new Map();
  private sessions: Map<string, VideoProgressSession> = new Map();
  private currentUserId: string | null = null;
  private currentSessionId: string | null = null;
  private saveInterval: NodeJS.Timeout | null = null;
  private readonly STORAGE_KEY = 'enhanced_video_progress';
  private readonly SESSION_STORAGE_KEY = 'video_sessions';

  static getInstance(): EnhancedVideoProgressService {
    if (!EnhancedVideoProgressService.instance) {
      EnhancedVideoProgressService.instance = new EnhancedVideoProgressService();
    }
    return EnhancedVideoProgressService.instance;
  }

  constructor() {
    this.loadFromStorage();
    this.startAutoSave();
  }

  // Set current user (should be called when user logs in)
  setCurrentUser(userId: string): void {
    this.currentUserId = userId;
    this.cleanupExpiredSessions();
  }

  // Start a new viewing session
  startSession(videoId: string): string {
    if (!this.currentUserId) {
      throw new Error('No user set. Call setCurrentUser() first.');
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: VideoProgressSession = {
      id: sessionId,
      userId: this.currentUserId,
      videoId,
      startTime: new Date(),
      totalWatchTime: 0,
      completed: false,
      maxPosition: 0,
      events: [
        {
          type: 'play',
          timestamp: new Date(),
        }
      ]
    };

    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;

    // Initialize or get existing progress
    this.getOrCreateProgress(videoId);

    return sessionId;
  }

  // End current session
  endSession(): void {
    if (!this.currentSessionId) return;

    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      session.endTime = new Date();
      
      // Update progress with session data
      const progressKey = `${this.currentUserId}_${session.videoId}`;
      const progress = this.progress.get(progressKey);
      
      if (progress) {
        progress.sessionWatchTime = session.totalWatchTime;
        progress.watchTime += session.totalWatchTime;
        progress.lastPosition = session.maxPosition;
        
        // Check completion (90% threshold)
        if (session.maxPosition / progress.totalSeconds >= 0.9) {
          progress.completed = true;
          progress.completedAt = new Date();
        }
      }
    }

    this.currentSessionId = null;
    this.saveToStorage();
  }

  // Update video position during playback
  updatePosition(videoId: string, currentTime: number, duration: number): void {
    if (!this.currentUserId || !this.currentSessionId) return;

    const progressKey = `${this.currentUserId}_${videoId}`;
    const progress = this.progress.get(progressKey);
    const session = this.sessions.get(this.currentSessionId);

    if (progress && session) {
      // Update progress
      progress.watchedSeconds = Math.min(currentTime, duration);
      progress.totalSeconds = duration;
      progress.lastPosition = currentTime;

      // Update session
      session.maxPosition = Math.max(session.maxPosition, currentTime);
      
      // Calculate watch time (simplified - in production, use actual time deltas)
      const timeDelta = 2; // Update every 2 seconds
      session.totalWatchTime += timeDelta;
      progress.sessionWatchTime = session.totalWatchTime;
    }
  }

  // Handle video events
  recordEvent(eventType: VideoProgressSession['events'][0]['type'], data?: any): void {
    if (!this.currentSessionId) return;

    const session = this.sessions.get(this.currentSessionId);
    if (session) {
      session.events.push({
        type: eventType,
        timestamp: new Date(),
        data
      });
    }
  }

  // Add bookmark
  addBookmark(videoId: string, time: number, title?: string): void {
    if (!this.currentUserId) return;

    const progressKey = `${this.currentUserId}_${videoId}`;
    const progress = this.progress.get(progressKey);
    
    if (progress) {
      const bookmark = {
        id: `bookmark_${Date.now()}`,
        time,
        title: title || `Bookmark at ${this.formatTime(time)}`,
        createdAt: new Date()
      };
      
      progress.bookmarks.push(bookmark);
      this.saveToStorage();
    }
  }

  // Remove bookmark
  removeBookmark(videoId: string, bookmarkId: string): void {
    if (!this.currentUserId) return;

    const progressKey = `${this.currentUserId}_${videoId}`;
    const progress = this.progress.get(progressKey);
    
    if (progress) {
      progress.bookmarks = progress.bookmarks.filter(b => b.id !== bookmarkId);
      this.saveToStorage();
    }
  }

  // Get progress for a video
  getProgress(videoId: string): EnhancedVideoProgress | null {
    if (!this.currentUserId) return null;

    const progressKey = `${this.currentUserId}_${videoId}`;
    return this.progress.get(progressKey) || null;
  }

  // Get all progress for current user
  getAllProgress(): EnhancedVideoProgress[] {
    if (!this.currentUserId) return [];

    return Array.from(this.progress.entries())
      .filter(([key]) => key.startsWith(`${this.currentUserId}_`))
      .map(([, progress]) => progress);
  }

  // Get session statistics
  getSessionStats(videoId: string): {
    totalSessions: number;
    totalWatchTime: number;
    averageSessionDuration: number;
    completionRate: number;
  } | null {
    if (!this.currentUserId) return null;

    const userSessions = Array.from(this.sessions.values())
      .filter(s => s.userId === this.currentUserId && s.videoId === videoId);

    if (userSessions.length === 0) return null;

    const totalWatchTime = userSessions.reduce((sum, s) => sum + s.totalWatchTime, 0);
    const completedSessions = userSessions.filter(s => s.completed).length;
    const averageSessionDuration = totalWatchTime / userSessions.length;

    return {
      totalSessions: userSessions.length,
      totalWatchTime,
      averageSessionDuration,
      completionRate: completedSessions / userSessions.length
    };
  }

  // Resume from last position
  getResumePosition(videoId: string): number {
    const progress = this.getProgress(videoId);
    return progress?.lastPosition || 0;
  }

  // Check if video is completed
  isCompleted(videoId: string): boolean {
    const progress = this.getProgress(videoId);
    return progress?.completed || false;
  }

  // Get completion percentage
  getCompletionPercentage(videoId: string): number {
    const progress = this.getProgress(videoId);
    if (!progress || progress.totalSeconds === 0) return 0;
    
    return Math.min((progress.watchedSeconds / progress.totalSeconds) * 100, 100);
  }

  // Private helper methods
  private getOrCreateProgress(videoId: string): EnhancedVideoProgress {
    if (!this.currentUserId) throw new Error('No user set');

    const progressKey = `${this.currentUserId}_${videoId}`;
    let progress = this.progress.get(progressKey);

    if (!progress) {
      progress = {
        userId: this.currentUserId,
        sessionId: this.currentSessionId!,
        lessonId: videoId,
        watchedSeconds: 0,
        totalSeconds: 0,
        completed: false,
        lastPosition: 0,
        watchTime: 0,
        sessionWatchTime: 0,
        bookmarks: [],
        playbackSpeed: 1,
        subtitlesEnabled: false
      };

      this.progress.set(progressKey, progress);
    }

    return progress;
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private startAutoSave(): void {
    // Save progress every 30 seconds
    this.saveInterval = setInterval(() => {
      this.saveToStorage();
    }, 30000);
  }

  private saveToStorage(): void {
    try {
      const data = {
        progress: Array.from(this.progress.entries()),
        sessions: Array.from(this.sessions.entries())
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        
        if (parsed.progress) {
          this.progress = new Map(parsed.progress);
        }
        
        if (parsed.sessions) {
          this.sessions = new Map(parsed.sessions);
        }
      }
    } catch (error) {
      console.error('Failed to load video progress:', error);
    }
  }

  private cleanupExpiredSessions(): void {
    // Clean up sessions older than 7 days
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const [sessionId, session] of this.sessions.entries()) {
      const sessionTime = new Date(session.startTime).getTime();
      if (sessionTime < weekAgo) {
        this.sessions.delete(sessionId);
      }
    }
  }

  // Cleanup method
  destroy(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
    this.saveToStorage();
  }
}

// Export singleton instance
export const enhancedVideoProgressService = EnhancedVideoProgressService.getInstance();
