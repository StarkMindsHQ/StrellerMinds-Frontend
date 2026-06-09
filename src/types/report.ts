export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  MISINFORMATION = 'MISINFORMATION',
  OTHER = 'OTHER',
}

export enum ReportContentType {
  COURSE = 'COURSE',
  LESSON = 'LESSON',
  MODULE = 'MODULE',
  REVIEW = 'REVIEW',
  COMMENT = 'COMMENT',
  USER = 'USER',
  OTHER = 'OTHER',
}

export interface Report {
  id: string;
  contentType: ReportContentType;
  contentId: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  reporterId: string;
  reporter: {
    id: string;
    name: string | null;
    email: string;
  };
  resolvedBy: string | null;
  resolvedByUser: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  resolvedAt: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportInput {
  contentType: ReportContentType;
  contentId: string;
  reason: ReportReason;
  details?: string;
}

export interface UpdateReportInput {
  status?: ReportStatus;
  adminNotes?: string;
}

export interface ReportsListResponse {
  success: boolean;
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateReportResponse {
  success: boolean;
  message: string;
  report: Report;
}

export interface UpdateReportResponse {
  success: boolean;
  message: string;
  report: Report;
}

export const REASONS = [
  { value: ReportReason.SPAM, label: 'Spam' },
  { value: ReportReason.HARASSMENT, label: 'Harassment' },
  { value: ReportReason.INAPPROPRIATE_CONTENT, label: 'Inappropriate Content' },
  { value: ReportReason.MISINFORMATION, label: 'Misinformation' },
  { value: ReportReason.OTHER, label: 'Other' },
];

export const CONTENT_TYPES = [
  { value: ReportContentType.COURSE, label: 'Course' },
  { value: ReportContentType.LESSON, label: 'Lesson' },
  { value: ReportContentType.MODULE, label: 'Module' },
  { value: ReportContentType.REVIEW, label: 'Review' },
  { value: ReportContentType.COMMENT, label: 'Comment' },
  { value: ReportContentType.USER, label: 'User' },
  { value: ReportContentType.OTHER, label: 'Other' },
];

export const STATUSES = [
  { value: ReportStatus.PENDING, label: 'Pending' },
  { value: ReportStatus.REVIEWED, label: 'Reviewed' },
  { value: ReportStatus.RESOLVED, label: 'Resolved' },
  { value: ReportStatus.DISMISSED, label: 'Dismissed' },
];
