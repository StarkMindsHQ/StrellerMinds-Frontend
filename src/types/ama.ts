/**
 * Types for AMA (Ask Me Anything) Session feature
 */

export type AMASessionStatus = 'scheduled' | 'live' | 'ended';

export type QuestionStatus = 'pending' | 'answered' | 'dismissed';

export interface AMAHost {
  id: string;
  name: string;
  avatar?: string;
  role: string; // e.g. "Instructor", "Blockchain Expert"
  bio?: string;
}

export interface AMAQuestion {
  id: string;
  sessionId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  status: QuestionStatus;
  upvotes: number;
  upvotedBy: string[]; // user IDs who upvoted
  createdAt: number;
  answeredAt?: number;
  answer?: string;
  answeredBy?: string; // host user ID
  isPinned: boolean;
}

export interface AMASession {
  id: string;
  title: string;
  description: string;
  host: AMAHost;
  status: AMASessionStatus;
  scheduledStart: number; // Unix timestamp
  scheduledEnd: number;
  actualStart?: number;
  actualEnd?: number;
  participantCount: number;
  questions: AMAQuestion[];
  tags: string[];
}

export interface AMASessionCreateRequest {
  title: string;
  description: string;
  host: AMAHost;
  scheduledStart: number;
  durationMinutes: number;
  tags?: string[];
}

// Socket events specific to AMA
export type AMASocketEvent =
  | 'ama:session-update'
  | 'ama:question-submitted'
  | 'ama:question-answered'
  | 'ama:question-upvoted'
  | 'ama:question-pinned'
  | 'ama:question-dismissed'
  | 'ama:participant-joined'
  | 'ama:participant-left'
  | 'ama:session-started'
  | 'ama:session-ended';
