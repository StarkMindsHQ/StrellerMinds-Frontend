'use client';

import { ActivityEvent, ActivityMetrics } from '@/hooks/useActivityMonitor';

export interface ActivityLog {
  id: string;
  userId: string;
  lessonId: string;
  courseId?: string;
  sessionId: string;
  startTime: number;
  endTime?: number;
  metrics: ActivityMetrics;
  events: ActivityEvent[];
  deviceInfo?: {
    userAgent: string;
    platform: string;
    screenResolution: string;
  };
}

export interface ActivityLogSummary {
  totalSessions: number;
  averageEngagement: number;
  totalTime: number;
  totalTabSwitches: number;
  totalVideoPauses: number;
  engagementTrend: 'improving' | 'declining' | 'stable';
}

class ActivityLoggerService {
  private sessionId: string;
  private buffer: ActivityLog[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly BUFFER_SIZE = 10;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startAutoFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') return undefined;

    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };
  }

  // Log activity session
  async logActivity(
    userId: string,
    lessonId: string,
    metrics: ActivityMetrics,
    events: ActivityEvent[],
    courseId?: string
  ): Promise<void> {
    const log: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      lessonId,
      courseId,
      sessionId: this.sessionId,
      startTime: Date.now() - metrics.totalTime,
      endTime: Date.now(),
      metrics,
      events,
      deviceInfo: this.getDeviceInfo(),
    };

    this.buffer.push(log);

    // Auto-flush if buffer is full
    if (this.buffer.length >= this.BUFFER_SIZE) {
      await this.flush();
    }
  }

  // Flush buffer to API
  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer = [];

    try {
      const response = await fetch('/api/activity-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: logsToSend }),
      });

      if (!response.ok) {
        console.error('Failed to send activity logs:', response.statusText);
        // Re-add to buffer on failure
        this.buffer.push(...logsToSend);
      }
    } catch (error) {
      console.error('Error sending activity logs:', error);
      // Re-add to buffer on error
      this.buffer.push(...logsToSend);
    }
  }

  // Start auto-flush
  private startAutoFlush(): void {
    if (typeof window === 'undefined') return;

    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  // Stop auto-flush
  stopAutoFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  // Get activity summary for a user
  async getActivitySummary(
    userId: string,
    lessonId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ActivityLogSummary> {
    try {
      const params = new URLSearchParams({
        userId,
        ...(lessonId && { lessonId }),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
      });

      const response = await fetch(`/api/activity-logs/summary?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity summary');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching activity summary:', error);
      throw error;
    }
  }

  // Get detailed logs
  async getActivityLogs(
    userId: string,
    lessonId?: string,
    limit: number = 50
  ): Promise<ActivityLog[]> {
    try {
      const params = new URLSearchParams({
        userId,
        ...(lessonId && { lessonId }),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/activity-logs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  }

  // Calculate engagement trends
  calculateEngagementTrend(logs: ActivityLog[]): 'improving' | 'declining' | 'stable' {
    if (logs.length < 2) return 'stable';

    const sortedLogs = [...logs].sort((a, b) => a.startTime - b.startTime);
    const midpoint = Math.floor(sortedLogs.length / 2);
    
    const firstHalf = sortedLogs.slice(0, midpoint);
    const secondHalf = sortedLogs.slice(midpoint);

    const avgFirstHalf = firstHalf.reduce((sum, log) => sum + log.metrics.engagementScore, 0) / firstHalf.length;
    const avgSecondHalf = secondHalf.reduce((sum, log) => sum + log.metrics.engagementScore, 0) / secondHalf.length;

    const difference = avgSecondHalf - avgFirstHalf;

    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  // Export logs as CSV
  exportLogsAsCSV(logs: ActivityLog[]): string {
    const headers = [
      'Session ID',
      'User ID',
      'Lesson ID',
      'Start Time',
      'End Time',
      'Total Time',
      'Engagement Score',
      'Tab Switches',
      'Video Pauses',
      'Inactive Time',
    ];

    const rows = logs.map(log => [
      log.sessionId,
      log.userId,
      log.lessonId,
      new Date(log.startTime).toISOString(),
      log.endTime ? new Date(log.endTime).toISOString() : '',
      log.metrics.totalTime,
      log.metrics.engagementScore,
      log.metrics.tabSwitches,
      log.metrics.videoPauses,
      log.metrics.inactiveTime,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csv;
  }

  // Download CSV
  downloadCSV(logs: ActivityLog[], filename: string = 'activity-logs.csv'): void {
    const csv = this.exportLogsAsCSV(logs);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
export const activityLogger = new ActivityLoggerService();

export default activityLogger;
