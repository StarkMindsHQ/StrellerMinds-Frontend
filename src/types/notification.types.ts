export enum NotificationType {
  COURSE_UPDATE = 'course_update',
  ASSIGNMENT_DEADLINE = 'assignment_deadline',
  QUIZ_RESULT = 'quiz_result',
  ACHIEVEMENT = 'achievement',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  ANNOUNCEMENT = 'announcement',
  REMINDER = 'reminder',
  FEEDBACK = 'feedback',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  userId: string;
  metadata?: Record<string, any>;
  actionUrl?: string;
  imageUrl?: string;
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    [NotificationChannel.IN_APP]: ChannelPreference;
    [NotificationChannel.EMAIL]: ChannelPreference;
    [NotificationChannel.PUSH]: ChannelPreference;
    [NotificationChannel.SMS]: ChannelPreference;
  };
  quietHours?: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
    timezone: string;
  };
  frequency?: {
    digest: boolean;
    digestTime?: string; // "09:00"
    maxPerHour?: number;
  };
}

export interface ChannelPreference {
  enabled: boolean;
  types: {
    [key in NotificationType]: boolean;
  };
}

export interface NotificationFilter {
  status?: NotificationStatus;
  type?: NotificationType;
  priority?: NotificationPriority;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

export interface WebSocketMessage {
  type: 'notification' | 'ping' | 'pong';
  payload?: Notification;
  timestamp: number;
}
