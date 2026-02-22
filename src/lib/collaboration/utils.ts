/**
 * Utility functions for collaboration features
 */

import { v4 as uuidv4 } from 'uuid';
import type { CollaborationUser, UserPermission } from './types';
import { getUserColor } from './colors';

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session-${uuidv4()}`;
}

/**
 * Generate a unique user ID
 */
export function generateUserId(): string {
  return `user-${uuidv4()}`;
}

/**
 * Create a new collaboration user
 */
export function createCollaborationUser(
  id: string,
  name: string,
  permission: UserPermission = 'edit',
  email?: string,
  avatar?: string,
): CollaborationUser {
  return {
    id,
    name,
    email,
    avatar,
    color: getUserColor(id),
    permission,
    joinedAt: Date.now(),
    isActive: true,
  };
}

/**
 * Check if user has permission to edit
 */
export function canEdit(permission: UserPermission): boolean {
  return permission === 'edit' || permission === 'admin';
}

/**
 * Check if user has admin permission
 */
export function isAdmin(permission: UserPermission): boolean {
  return permission === 'admin';
}

/**
 * Check if user can change permissions
 */
export function canChangePermissions(permission: UserPermission): boolean {
  return permission === 'admin';
}

/**
 * Validate session name
 */
export function validateSessionName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Session name is required' };
  }
  if (name.length > 100) {
    return {
      valid: false,
      error: 'Session name must be less than 100 characters',
    };
  }
  return { valid: true };
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: CollaborationUser): string {
  return user.name || user.email || `User ${user.id.slice(0, 8)}`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
