/**
 * Redis store for collaboration sessions
 * Provides persistent storage and enables horizontal scaling
 */

import { createClient, RedisClientType } from 'redis';
import type { CollaborationSession, ChatMessage } from './types';

export class RedisStore {
  private client: RedisClientType | null = null;
  private isConnected = false;
  private useRedis: boolean;

  constructor() {
    // Use Redis if REDIS_URL is provided, otherwise use in-memory
    this.useRedis = !!process.env.REDIS_URL;
  }

  async connect(): Promise<void> {
    if (!this.useRedis) {
      console.log('📦 Using in-memory storage (Redis not configured)');
      return;
    }

    try {
      this.client = createClient({
        url: process.env.REDIS_URL,
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Connected to Redis');
        this.isConnected = true;
      });

      await this.client.connect();
      console.log('✅ Redis store initialized');
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error);
      console.log('📦 Falling back to in-memory storage');
      this.useRedis = false;
      this.client = null;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  // Session operations
  async getSession(sessionId: string): Promise<CollaborationSession | null> {
    if (!this.useRedis || !this.client) return null;

    try {
      const data = await this.client.get(`session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting session from Redis:', error);
      return null;
    }
  }

  async setSession(session: CollaborationSession): Promise<void> {
    if (!this.useRedis || !this.client) return;

    try {
      await this.client.setEx(
        `session:${session.id}`,
        86400, // 24 hours TTL
        JSON.stringify(session),
      );
    } catch (error) {
      console.error('Error setting session in Redis:', error);
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (!this.useRedis || !this.client) return;

    try {
      await this.client.del(`session:${sessionId}`);
      // Also delete related data
      await this.client.del(`messages:${sessionId}`);
      await this.client.del(`yjs-state:${sessionId}`);
      // Note: user-session mappings are deleted individually when users leave
    } catch (error) {
      console.error('Error deleting session from Redis:', error);
    }
  }

  // User-session mapping
  async getUserSession(userId: string): Promise<string | null> {
    if (!this.useRedis || !this.client) return null;

    try {
      return await this.client.get(`user-session:${userId}`);
    } catch (error) {
      console.error('Error getting user session from Redis:', error);
      return null;
    }
  }

  async setUserSession(userId: string, sessionId: string): Promise<void> {
    if (!this.useRedis || !this.client) return;

    try {
      await this.client.setEx(`user-session:${userId}`, 86400, sessionId);
    } catch (error) {
      console.error('Error setting user session in Redis:', error);
    }
  }

  async deleteUserSession(userId: string): Promise<void> {
    if (!this.useRedis || !this.client) return;

    try {
      await this.client.del(`user-session:${userId}`);
    } catch (error) {
      console.error('Error deleting user session from Redis:', error);
    }
  }

  // Message operations
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    if (!this.useRedis || !this.client) return [];

    try {
      const data = await this.client.get(`messages:${sessionId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting messages from Redis:', error);
      return [];
    }
  }

  async addMessage(sessionId: string, message: ChatMessage): Promise<void> {
    if (!this.useRedis || !this.client) return;

    try {
      const messages = await this.getMessages(sessionId);
      messages.push(message);
      // Keep last 100 messages
      const trimmedMessages = messages.slice(-100);
      await this.client.setEx(
        `messages:${sessionId}`,
        86400,
        JSON.stringify(trimmedMessages),
      );
    } catch (error) {
      console.error('Error adding message to Redis:', error);
    }
  }

  async setMessages(sessionId: string, messages: ChatMessage[]): Promise<void> {
    if (!this.useRedis || !this.client) return;

    try {
      await this.client.setEx(
        `messages:${sessionId}`,
        86400,
        JSON.stringify(messages),
      );
    } catch (error) {
      console.error('Error setting messages in Redis:', error);
    }
  }

  // Yjs document state
  async getYjsState(sessionId: string): Promise<Uint8Array | null> {
    if (!this.useRedis || !this.client) return null;

    try {
      const data = await this.client.get(`yjs-state:${sessionId}`);
      return data ? new Uint8Array(JSON.parse(data)) : null;
    } catch (error) {
      console.error('Error getting Yjs state from Redis:', error);
      return null;
    }
  }

  async setYjsState(sessionId: string, state: Uint8Array): Promise<void> {
    if (!this.useRedis || !this.client) return;

    try {
      await this.client.setEx(
        `yjs-state:${sessionId}`,
        86400,
        JSON.stringify(Array.from(state)),
      );
    } catch (error) {
      console.error('Error setting Yjs state in Redis:', error);
    }
  }

  // Check if Redis is being used
  isUsingRedis(): boolean {
    return this.useRedis && this.isConnected;
  }
}

// Singleton instance
let redisStoreInstance: RedisStore | null = null;

export function getRedisStore(): RedisStore {
  if (!redisStoreInstance) {
    redisStoreInstance = new RedisStore();
  }
  return redisStoreInstance;
}
