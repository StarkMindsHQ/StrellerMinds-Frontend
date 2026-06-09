export type ActivityType = 
  | 'course_enrollment'
  | 'lesson_completion'
  | 'quiz_submission'
  | 'certificate_issuance'
  | 'assignment_submission'
  | 'course_start'
  | 'video_progress'
  | 'achievement_unlocked';

export interface ActivityEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  action: ActivityType;
  targetId?: string; // course ID, lesson ID, quiz ID, etc.
  targetTitle?: string; // course title, lesson title, etc.
  metadata?: {
    score?: number;
    progress?: number;
    duration?: number;
    certificateId?: string;
    achievementTitle?: string;
    [key: string]: any;
  };
  timestamp: Date;
  courseId?: string;
  courseTitle?: string;
}

export interface ActivityFilter {
  type?: ActivityType;
  courseId?: string;
  userId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ActivityFeedState {
  activities: ActivityEntry[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  filter: ActivityFilter;
}

export interface ActivityFeedProps {
  filter?: ActivityFilter;
  maxItems?: number;
  showFilters?: boolean;
  realTime?: boolean;
  className?: string;
}
