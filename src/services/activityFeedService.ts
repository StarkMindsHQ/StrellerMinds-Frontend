import { ActivityEntry, ActivityFilter, ActivityFeedState, ActivityType } from '@/types/activity';

// Mock data for development (in production, this would come from your backend)
const mockUsers = [
  { id: 'user1', name: 'Alice Johnson', email: 'alice@example.com', avatar: '/avatars/alice.jpg' },
  { id: 'user2', name: 'Bob Smith', email: 'bob@example.com', avatar: '/avatars/bob.jpg' },
  { id: 'user3', name: 'Carol Williams', email: 'carol@example.com', avatar: '/avatars/carol.jpg' },
  { id: 'user4', name: 'David Brown', email: 'david@example.com', avatar: '/avatars/david.jpg' },
];

const mockCourses = [
  { id: 'course1', title: 'Blockchain Fundamentals' },
  { id: 'course2', title: 'Smart Contract Development' },
  { id: 'course3', title: 'DeFi Protocols' },
];

const mockLessons = [
  { id: 'lesson1', title: 'Introduction to Blockchain', courseId: 'course1' },
  { id: 'lesson2', title: 'Cryptographic Basics', courseId: 'course1' },
  { id: 'lesson3', title: 'Solidity Basics', courseId: 'course2' },
];

const mockQuizzes = [
  { id: 'quiz1', title: 'Blockchain Basics Quiz', courseId: 'course1' },
  { id: 'quiz2', title: 'Smart Contracts Quiz', courseId: 'course2' },
];

// Generate mock activities
function generateMockActivities(count: number = 50): ActivityEntry[] {
  const activities: ActivityEntry[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const course = mockCourses[Math.floor(Math.random() * mockCourses.length)];
    const lesson = mockLessons[Math.floor(Math.random() * mockLessons.length)];
    const quiz = mockQuizzes[Math.floor(Math.random() * mockQuizzes.length)];
    
    const actionTypes: ActivityType[] = [
      'course_enrollment',
      'lesson_completion', 
      'quiz_submission',
      'certificate_issuance',
      'assignment_submission',
      'course_start',
      'video_progress',
      'achievement_unlocked'
    ];
    
    const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    
    // Generate timestamp within last 24 hours
    const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    
    let activity: ActivityEntry = {
      id: `activity-${i}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      action,
      timestamp,
      courseId: course.id,
      courseTitle: course.title,
    };
    
    // Add action-specific metadata
    switch (action) {
      case 'course_enrollment':
        activity.targetId = course.id;
        activity.targetTitle = course.title;
        break;
      case 'lesson_completion':
        activity.targetId = lesson.id;
        activity.targetTitle = lesson.title;
        activity.metadata = { progress: 100 };
        break;
      case 'quiz_submission':
        activity.targetId = quiz.id;
        activity.targetTitle = quiz.title;
        activity.metadata = { score: Math.floor(Math.random() * 40) + 60 }; // 60-100
        break;
      case 'certificate_issuance':
        activity.targetId = course.id;
        activity.targetTitle = course.title;
        activity.metadata = { 
          certificateId: `cert-${Date.now()}-${i}`,
          score: Math.floor(Math.random() * 20) + 80 // 80-100
        };
        break;
      case 'video_progress':
        activity.targetId = lesson.id;
        activity.targetTitle = lesson.title;
        activity.metadata = { 
          progress: Math.floor(Math.random() * 100),
          duration: Math.floor(Math.random() * 3600) // 0-3600 seconds
        };
        break;
      case 'achievement_unlocked':
        activity.metadata = { 
          achievementTitle: ['Fast Learner', 'Quiz Master', 'Perfect Score', 'Dedicated Student'][Math.floor(Math.random() * 4)]
        };
        break;
    }
    
    activities.push(activity);
  }
  
  // Sort by timestamp (newest first)
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

class ActivityFeedService {
  private activities: ActivityEntry[] = [];
  private listeners: Set<(activities: ActivityEntry[]) => void> = new Set();
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    // Initialize with mock data
    this.activities = generateMockActivities();
  }

  // Get activities with filtering and pagination
  async getActivities(
    filter: ActivityFilter = {},
    page: number = 0,
    pageSize: number = 20
  ): Promise<{
    activities: ActivityEntry[];
    hasMore: boolean;
    total: number;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredActivities = [...this.activities];
    
    // Apply filters
    if (filter.type) {
      filteredActivities = filteredActivities.filter(a => a.action === filter.type);
    }
    
    if (filter.courseId) {
      filteredActivities = filteredActivities.filter(a => a.courseId === filter.courseId);
    }
    
    if (filter.userId) {
      filteredActivities = filteredActivities.filter(a => a.userId === filter.userId);
    }
    
    if (filter.dateRange) {
      filteredActivities = filteredActivities.filter(a => 
        a.timestamp >= filter.dateRange!.start && 
        a.timestamp <= filter.dateRange!.end
      );
    }
    
    // Apply pagination
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedActivities = filteredActivities.slice(startIndex, endIndex);
    
    return {
      activities: paginatedActivities,
      hasMore: endIndex < filteredActivities.length,
      total: filteredActivities.length
    };
  }

  // Subscribe to real-time updates
  subscribe(callback: (activities: ActivityEntry[]) => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of updates
  private notifyListeners() {
    this.listeners.forEach(callback => callback([...this.activities]));
  }

  // Add new activity (simulates real-time update)
  addActivity(activity: Omit<ActivityEntry, 'id' | 'timestamp'>) {
    const newActivity: ActivityEntry = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };
    
    this.activities.unshift(newActivity);
    this.notifyListeners();
    
    // Broadcast via WebSocket if connected
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: 'new_activity',
        payload: newActivity
      }));
    }
  }

  // Connect to WebSocket for real-time updates
  connectWebSocket(userId?: string) {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/activity-feed${userId ? `?userId=${userId}` : ''}`;
    
    try {
      this.wsConnection = new WebSocket(wsUrl);
      
      this.wsConnection.onopen = () => {
        console.log('Activity feed WebSocket connected');
        this.reconnectAttempts = 0;
      };
      
      this.wsConnection.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'new_activity' && message.payload) {
            const activity: ActivityEntry = {
              ...message.payload,
              timestamp: new Date(message.payload.timestamp),
            };
            
            this.activities.unshift(activity);
            this.notifyListeners();
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.wsConnection.onclose = () => {
        console.log('Activity feed WebSocket disconnected');
        this.attemptReconnect();
      };
      
      this.wsConnection.onerror = (error) => {
        console.error('Activity feed WebSocket error:', error);
      };
      
    } catch (error) {
      console.error('Failed to connect to activity feed WebSocket:', error);
    }
  }

  // Attempt to reconnect WebSocket
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect to activity feed (attempt ${this.reconnectAttempts})`);
        this.connectWebSocket();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached for activity feed');
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  // Get activity statistics
  getStatistics() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentActivities = this.activities.filter(a => a.timestamp >= last24Hours);
    const weeklyActivities = this.activities.filter(a => a.timestamp >= lastWeek);
    
    const actionCounts = this.activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<ActivityType, number>);
    
    return {
      totalActivities: this.activities.length,
      last24Hours: recentActivities.length,
      lastWeek: weeklyActivities.length,
      actionCounts,
      uniqueUsers: new Set(this.activities.map(a => a.userId)).size,
      uniqueCourses: new Set(this.activities.map(a => a.courseId).filter(Boolean)).size,
    };
  }

  // Simulate real-time activity (for development/testing)
  simulateActivity() {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const course = mockCourses[Math.floor(Math.random() * mockCourses.length)];
    const lesson = mockLessons[Math.floor(Math.random() * mockLessons.length)];
    
    const actionTypes: ActivityType[] = [
      'course_enrollment',
      'lesson_completion',
      'quiz_submission',
      'video_progress',
      'achievement_unlocked'
    ];
    
    const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    
    this.addActivity({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      action,
      courseId: course.id,
      courseTitle: course.title,
      targetId: lesson.id,
      targetTitle: lesson.title,
      metadata: action === 'quiz_submission' 
        ? { score: Math.floor(Math.random() * 40) + 60 }
        : action === 'video_progress'
        ? { progress: Math.floor(Math.random() * 100) }
        : undefined
    });
  }
}

// Export singleton instance
export const activityFeedService = new ActivityFeedService();

// Export utility functions
export const getActivityTypeLabel = (type: ActivityType): string => {
  const labels: Record<ActivityType, string> = {
    course_enrollment: 'Enrolled in course',
    lesson_completion: 'Completed lesson',
    quiz_submission: 'Submitted quiz',
    certificate_issuance: 'Earned certificate',
    assignment_submission: 'Submitted assignment',
    course_start: 'Started course',
    video_progress: 'Video progress',
    achievement_unlocked: 'Achievement unlocked'
  };
  return labels[type] || type;
};

export const getActivityTypeIcon = (type: ActivityType): string => {
  const icons: Record<ActivityType, string> = {
    course_enrollment: '📚',
    lesson_completion: '✅',
    quiz_submission: '📝',
    certificate_issuance: '🎓',
    assignment_submission: '📋',
    course_start: '🚀',
    video_progress: '🎬',
    achievement_unlocked: '🏆'
  };
  return icons[type] || '📌';
};

export const getActivityTypeColor = (type: ActivityType): string => {
  const colors: Record<ActivityType, string> = {
    course_enrollment: 'text-blue-600 bg-blue-100',
    lesson_completion: 'text-green-600 bg-green-100',
    quiz_submission: 'text-purple-600 bg-purple-100',
    certificate_issuance: 'text-yellow-600 bg-yellow-100',
    assignment_submission: 'text-orange-600 bg-orange-100',
    course_start: 'text-indigo-600 bg-indigo-100',
    video_progress: 'text-pink-600 bg-pink-100',
    achievement_unlocked: 'text-red-600 bg-red-100'
  };
  return colors[type] || 'text-gray-600 bg-gray-100';
};
