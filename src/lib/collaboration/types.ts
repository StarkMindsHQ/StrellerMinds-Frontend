/**
 * Types and interfaces for real-time collaboration features
 */

export type UserPermission = 'view' | 'edit' | 'admin';

export interface CollaborationUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  color: string; // Color for cursor/selection highlighting
  permission: UserPermission;
  joinedAt: number;
  isActive: boolean;
}

export interface CursorPosition {
  lineNumber: number;
  column: number;
  userId: string;
}

export interface Selection {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  userId: string;
}

export interface CollaborationSession {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  language: string;
  createdAt: number;
  updatedAt: number;
  users: CollaborationUser[];
  isPublic: boolean;
  maxUsers?: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  type: 'text' | 'system' | 'voice';
  audioUrl?: string; // Base64 encoded audio data or URL
  audioDuration?: number; // Duration in seconds
}

export interface CollaborationState {
  session: CollaborationSession | null;
  currentUser: CollaborationUser | null;
  users: Map<string, CollaborationUser>;
  cursors: Map<string, CursorPosition>;
  selections: Map<string, Selection>;
  messages: ChatMessage[];
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export interface SessionCreateRequest {
  name: string;
  code?: string;
  language?: string;
  isPublic?: boolean;
  maxUsers?: number;
}

export interface SessionJoinRequest {
  sessionId: string;
  userId: string;
  userName: string;
  permission?: UserPermission;
}

export interface WebSocketMessage {
  type:
    | 'session-created'
    | 'session-joined'
    | 'session-left'
    | 'user-joined'
    | 'user-left'
    | 'user-updated'
    | 'code-updated'
    | 'cursor-updated'
    | 'selection-updated'
    | 'chat-message'
    | 'permission-changed'
    | 'error'
    | 'ping'
    | 'pong';
  payload: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface VersionHistory {
  id: string;
  sessionId: string;
  code: string;
  language: string;
  createdBy: string;
  createdAt: number;
  description?: string;
}

// WebRTC Signaling Types
export interface WebRTCOffer {
  type: 'offer';
  sdp: string;
  fromUserId: string;
  toUserId?: string; // If undefined, broadcast to all in session
  sessionId: string;
}

export interface WebRTCAnswer {
  type: 'answer';
  sdp: string;
  fromUserId: string;
  toUserId: string;
  sessionId: string;
}

export interface WebRTCIceCandidate {
  candidate: string;
  sdpMLineIndex: number | null;
  sdpMid: string | null;
  fromUserId: string;
  toUserId: string;
  sessionId: string;
}

export interface WebRTCCallState {
  userId: string;
  isInCall: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
}
