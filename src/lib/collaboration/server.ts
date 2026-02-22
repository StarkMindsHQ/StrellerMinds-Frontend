/**
 * WebSocket server for real-time collaboration
 * This should be run as a separate server process
 * For Next.js, you can use a custom server or run this separately
 */

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import type {
  CollaborationSession,
  CollaborationUser,
  ChatMessage,
  CursorPosition,
  Selection,
  UserPermission,
  WebSocketMessage,
} from './types';
import { createCollaborationUser, generateSessionId } from './utils';
import { getRedisStore } from './redis-store';

// Fallback in-memory storage (used when Redis is not available)
const sessions = new Map<string, CollaborationSession>();
const userSessions = new Map<string, string>(); // userId -> sessionId
const sessionMessages = new Map<string, ChatMessage[]>(); // sessionId -> messages
const yjsDocStates = new Map<string, Uint8Array>(); // Store Yjs document states

// Get Redis store instance
const redisStore = getRedisStore();

export async function createCollaborationServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Setup Redis adapter for horizontal scaling (if Redis is available)
  if (process.env.REDIS_URL) {
    try {
      const pubClient = createClient({ url: process.env.REDIS_URL });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);

      io.adapter(createAdapter(pubClient, subClient));
      console.log('✅ Redis adapter enabled for Socket.IO');
    } catch (error) {
      console.error('❌ Failed to setup Redis adapter:', error);
      console.log('📦 Continuing without Redis adapter');
    }
  }

  // Connect Redis store
  await redisStore.connect();

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Create session
    socket.on('create-session', async (data: any) => {
      try {
        const {
          name,
          code = '',
          language = 'javascript',
          isPublic = false,
          maxUsers,
          ownerId,
          userId,
          userName,
        } = data;

        const sessionId = generateSessionId();
        const owner = createCollaborationUser(
          ownerId,
          userName || 'Owner',
          'admin',
        );

        const session: CollaborationSession = {
          id: sessionId,
          name,
          ownerId,
          code,
          language,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          users: [owner],
          isPublic,
          maxUsers,
        };

        // Store in Redis or fallback to in-memory
        try {
          if (redisStore.isUsingRedis()) {
            await redisStore.setSession(session);
            await redisStore.setUserSession(userId, sessionId);
            await redisStore.setMessages(sessionId, []);
          } else {
            sessions.set(sessionId, session);
            userSessions.set(userId, sessionId);
            sessionMessages.set(sessionId, []);
          }
        } catch (error) {
          console.error('Error storing session:', error);
          // Fallback to in-memory if Redis fails
          sessions.set(sessionId, session);
          userSessions.set(userId, sessionId);
          sessionMessages.set(sessionId, []);
        }
        socket.join(sessionId);

        const message: WebSocketMessage = {
          type: 'session-created',
          payload: session,
          timestamp: Date.now(),
          sessionId,
        };

        socket.emit('session-created', message);
        console.log(`Session created: ${sessionId} by ${userName}`);
      } catch (error) {
        socket.emit('error', {
          type: 'error',
          payload:
            error instanceof Error ? error.message : 'Failed to create session',
          timestamp: Date.now(),
        });
      }
    });

    // Join session
    socket.on('join-session', async (data: any) => {
      try {
        const { sessionId, userId, userName, permission = 'edit' } = data;

        const session = sessions.get(sessionId);
        if (!session) {
          socket.emit('error', {
            type: 'error',
            payload: 'Session not found',
            timestamp: Date.now(),
          });
          return;
        }

        // Check if session is full
        if (session.maxUsers && session.users.length >= session.maxUsers) {
          socket.emit('error', {
            type: 'error',
            payload: 'Session is full',
            timestamp: Date.now(),
          });
          return;
        }

        // Check if user already in session
        const existingUser = session.users.find((u) => u.id === userId);
        if (existingUser) {
          existingUser.isActive = true;
        } else {
          const user = createCollaborationUser(
            userId,
            userName,
            permission as UserPermission,
          );
          session.users.push(user);
        }

        // Update user-session mapping
        if (redisStore.isUsingRedis()) {
          await redisStore.setUserSession(userId, sessionId);
        } else {
          userSessions.set(userId, sessionId);
        }
        socket.join(sessionId);

        const currentUser = session.users.find((u) => u.id === userId)!;

        // Get message history for this session
        let messages: ChatMessage[] = [];
        if (redisStore.isUsingRedis()) {
          messages = await redisStore.getMessages(sessionId);
        } else {
          messages = sessionMessages.get(sessionId) || [];
        }

        // Save updated session
        if (redisStore.isUsingRedis()) {
          await redisStore.setSession(session);
        } else {
          sessions.set(sessionId, session);
        }

        // Notify the joining user with full session state
        socket.emit('session-joined', {
          type: 'session-joined',
          payload: { session, user: currentUser, messages },
          timestamp: Date.now(),
          sessionId,
        });

        // Notify other users
        socket.to(sessionId).emit('user-joined', {
          type: 'user-joined',
          payload: currentUser,
          timestamp: Date.now(),
          sessionId,
          userId: currentUser.id,
        });

        console.log(`User ${userName} joined session ${sessionId}`);
      } catch (error) {
        socket.emit('error', {
          type: 'error',
          payload:
            error instanceof Error ? error.message : 'Failed to join session',
          timestamp: Date.now(),
        });
      }
    });

    // Leave session
    socket.on('leave-session', async (data: any) => {
      try {
        const { sessionId, userId } = data;
        const session = sessions.get(sessionId);

        if (session) {
          const user = session.users.find((u) => u.id === userId);
          if (user) {
            user.isActive = false;
            socket.leave(sessionId);

            // Update user-session mapping
            if (redisStore.isUsingRedis()) {
              await redisStore.deleteUserSession(userId);
              await redisStore.setSession(session);
            } else {
              userSessions.delete(userId);
              sessions.set(sessionId, session);
            }

            socket.to(sessionId).emit('user-left', {
              type: 'user-left',
              payload: userId,
              timestamp: Date.now(),
              sessionId,
              userId,
            });

            console.log(`User ${user.name} left session ${sessionId}`);
          }
        }
      } catch (error) {
        console.error('Error leaving session:', error);
      }
    });

    // Update code
    socket.on('update-code', async (data: any) => {
      try {
        const { sessionId, userId, code } = data;
        const session = sessions.get(sessionId);

        if (!session) return;

        const user = session.users.find((u) => u.id === userId);
        if (!user || !['edit', 'admin'].includes(user.permission)) {
          socket.emit('error', {
            type: 'error',
            payload: 'You do not have permission to edit',
            timestamp: Date.now(),
          });
          return;
        }

        session.code = code;
        session.updatedAt = Date.now();

        // Save updated session
        if (redisStore.isUsingRedis()) {
          await redisStore.setSession(session);
        } else {
          sessions.set(sessionId, session);
        }

        socket.to(sessionId).emit('code-updated', {
          type: 'code-updated',
          payload: { code, userId },
          timestamp: Date.now(),
          sessionId,
          userId,
        });
      } catch (error) {
        console.error('Error updating code:', error);
      }
    });

    // Update language
    socket.on('update-language', (data: any) => {
      try {
        const { sessionId, userId, language } = data;
        const session = sessions.get(sessionId);

        if (!session) return;

        const user = session.users.find((u) => u.id === userId);
        if (!user || user.permission !== 'admin') {
          socket.emit('error', {
            type: 'error',
            payload: 'Only admins can change the language',
            timestamp: Date.now(),
          });
          return;
        }

        session.language = language;
        session.updatedAt = Date.now();

        io.to(sessionId).emit('language-updated', {
          type: 'language-updated',
          payload: { language, userId },
          timestamp: Date.now(),
          sessionId,
          userId,
        });
      } catch (error) {
        console.error('Error updating language:', error);
      }
    });

    // Update cursor
    socket.on('update-cursor', (data: any) => {
      try {
        const { sessionId, cursor } = data;
        socket.to(sessionId).emit('cursor-updated', {
          type: 'cursor-updated',
          payload: cursor,
          timestamp: Date.now(),
          sessionId,
          userId: cursor.userId,
        });
      } catch (error) {
        console.error('Error updating cursor:', error);
      }
    });

    // Update selection
    socket.on('update-selection', (data: any) => {
      try {
        const { sessionId, selection } = data;
        socket.to(sessionId).emit('selection-updated', {
          type: 'selection-updated',
          payload: selection,
          timestamp: Date.now(),
          sessionId,
          userId: selection?.userId,
        });
      } catch (error) {
        console.error('Error updating selection:', error);
      }
    });

    // Chat message
    socket.on('chat-message', async (data: any) => {
      try {
        const { sessionId, userId, message, type, audioUrl, audioDuration } =
          data;
        const session = sessions.get(sessionId);

        if (!session) return;

        const user = session.users.find((u) => u.id === userId);
        if (!user) return;

        const chatMessage: ChatMessage = {
          id: `msg-${Date.now()}-${userId}`,
          userId,
          userName: user.name,
          message: message || '',
          timestamp: Date.now(),
          type: type || 'text',
          // Only include audioUrl if it exists and is not empty
          ...(audioUrl && audioUrl.trim() !== '' ? { audioUrl } : {}),
          ...(audioDuration ? { audioDuration } : {}),
        };

        // Store message in session history
        if (redisStore.isUsingRedis()) {
          await redisStore.addMessage(sessionId, chatMessage);
        } else {
          const messages = sessionMessages.get(sessionId) || [];
          messages.push(chatMessage);
          // Keep last 100 messages
          if (messages.length > 100) {
            messages.shift();
          }
          sessionMessages.set(sessionId, messages);
        }

        // Debug: Log voice note before sending
        if (chatMessage.type === 'voice') {
          console.log('Sending voice note:', {
            id: chatMessage.id,
            type: chatMessage.type,
            hasAudioUrl: !!chatMessage.audioUrl,
            audioUrlLength: chatMessage.audioUrl?.length || 0,
            duration: chatMessage.audioDuration,
          });
        }

        io.to(sessionId).emit('chat-message', {
          type: 'chat-message',
          payload: chatMessage,
          timestamp: Date.now(),
          sessionId,
          userId,
        });
      } catch (error) {
        console.error('Error sending chat message:', error);
      }
    });

    // Change permission
    socket.on('change-permission', (data: any) => {
      try {
        const { sessionId, userId, permission, changedBy } = data;
        const session = sessions.get(sessionId);

        if (!session) return;

        const changer = session.users.find((u) => u.id === changedBy);
        if (!changer || changer.permission !== 'admin') {
          socket.emit('error', {
            type: 'error',
            payload: 'Only admins can change permissions',
            timestamp: Date.now(),
          });
          return;
        }

        const user = session.users.find((u) => u.id === userId);
        if (user) {
          user.permission = permission as UserPermission;

          io.to(sessionId).emit('permission-changed', {
            type: 'permission-changed',
            payload: { userId, permission },
            timestamp: Date.now(),
            sessionId,
            userId: changedBy,
          });
        }
      } catch (error) {
        console.error('Error changing permission:', error);
      }
    });

    // Yjs document sync handlers
    socket.on('join-yjs-room', (data: any) => {
      const { room } = data;
      socket.join(`yjs-${room}`);
    });

    socket.on('leave-yjs-room', (data: any) => {
      const { room } = data;
      socket.leave(`yjs-${room}`);
    });

    socket.on('yjs-update', (data: any) => {
      try {
        const { room, update } = data;
        if (!room || !update) return;

        // Store the latest state (simplified - in production use proper Yjs state vector)
        const updateArray = new Uint8Array(update);
        yjsDocStates.set(room, updateArray);

        // Broadcast to other clients in the room (not the sender)
        socket.to(`yjs-${room}`).emit('yjs-update', { update });
      } catch (error) {
        console.error('Error handling Yjs update:', error);
      }
    });

    socket.on('yjs-sync-request', async (data: any) => {
      try {
        const { room } = data;
        if (!room) return;

        // Send current document state if available
        let state: Uint8Array | null = null;
        if (redisStore.isUsingRedis()) {
          state = await redisStore.getYjsState(room);
        } else {
          state = yjsDocStates.get(room) || null;
        }

        if (state) {
          socket.emit('yjs-sync-response', {
            state: Array.from(state),
          });
        } else {
          // If no state exists, send empty response (client will initialize)
          socket.emit('yjs-sync-response', {});
        }
      } catch (error) {
        console.error('Error handling Yjs sync request:', error);
      }
    });

    socket.on('yjs-awareness', (data: any) => {
      try {
        const { room, awareness } = data;
        if (!room) return;

        // Broadcast awareness updates to other clients
        socket.to(`yjs-${room}`).emit('yjs-awareness', {
          awareness,
          userId: socket.id,
        });
      } catch (error) {
        console.error('Error handling Yjs awareness:', error);
      }
    });

    // WebRTC Signaling Handlers
    // Store active calls per session
    const activeCalls = new Map<string, Set<string>>(); // sessionId -> Set of userIds in call

    // WebRTC Offer
    socket.on('webrtc-offer', async (data: any) => {
      try {
        const { sessionId, fromUserId, toUserId, offer } = data;
        if (!sessionId || !fromUserId || !offer) return;

        // Mark user as in call
        if (!activeCalls.has(sessionId)) {
          activeCalls.set(sessionId, new Set());
        }
        activeCalls.get(sessionId)!.add(fromUserId);

        // Broadcast offer to target user(s)
        if (toUserId) {
          // Send to specific user
          socket.to(sessionId).emit('webrtc-offer', {
            sessionId,
            fromUserId,
            toUserId,
            offer,
          });
        } else {
          // Broadcast to all other users in session
          socket.to(sessionId).emit('webrtc-offer', {
            sessionId,
            fromUserId,
            offer,
          });
        }

        // Notify all users in session about call state
        io.to(sessionId).emit('webrtc-call-state', {
          sessionId,
          userId: fromUserId,
          isInCall: true,
        });
      } catch (error) {
        console.error('Error handling WebRTC offer:', error);
      }
    });

    // WebRTC Answer
    socket.on('webrtc-answer', (data: any) => {
      try {
        const { sessionId, fromUserId, toUserId, answer } = data;
        if (!sessionId || !fromUserId || !toUserId || !answer) return;

        // Send answer to the user who sent the offer
        socket.to(sessionId).emit('webrtc-answer', {
          sessionId,
          fromUserId,
          toUserId,
          answer,
        });
      } catch (error) {
        console.error('Error handling WebRTC answer:', error);
      }
    });

    // WebRTC ICE Candidate
    socket.on('webrtc-ice-candidate', (data: any) => {
      try {
        const { sessionId, fromUserId, toUserId, candidate } = data;
        if (!sessionId || !fromUserId || !toUserId || !candidate) return;

        // Forward ICE candidate to target user
        socket.to(sessionId).emit('webrtc-ice-candidate', {
          sessionId,
          fromUserId,
          toUserId,
          candidate,
        });
      } catch (error) {
        console.error('Error handling WebRTC ICE candidate:', error);
      }
    });

    // End WebRTC call
    socket.on('webrtc-end-call', (data: any) => {
      try {
        const { sessionId, userId } = data;
        if (!sessionId || !userId) return;

        // Remove user from active calls
        const calls = activeCalls.get(sessionId);
        if (calls) {
          calls.delete(userId);
          if (calls.size === 0) {
            activeCalls.delete(sessionId);
          }
        }

        // Notify all users in session
        io.to(sessionId).emit('webrtc-call-ended', {
          sessionId,
          userId,
        });

        io.to(sessionId).emit('webrtc-call-state', {
          sessionId,
          userId,
          isInCall: false,
        });
      } catch (error) {
        console.error('Error handling WebRTC end call:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      const userId = Array.from(userSessions.entries()).find(([_, sessionId]) =>
        socket.rooms.has(sessionId),
      )?.[0];

      if (userId) {
        const sessionId = userSessions.get(userId);
        if (sessionId) {
          const session = sessions.get(sessionId);
          if (session) {
            const user = session.users.find((u) => u.id === userId);
            if (user) {
              user.isActive = false;
              socket.to(sessionId).emit('user-left', {
                type: 'user-left',
                payload: userId,
                timestamp: Date.now(),
                sessionId,
                userId,
              });
            }
          }
          userSessions.delete(userId);
        }
      }
    });
  });

  // Cleanup on process exit
  process.on('SIGTERM', async () => {
    await redisStore.disconnect();
  });

  process.on('SIGINT', async () => {
    await redisStore.disconnect();
  });

  return io;
}

// Helper function to get session
export async function getSession(
  sessionId: string,
): Promise<CollaborationSession | undefined> {
  if (redisStore.isUsingRedis()) {
    return (await redisStore.getSession(sessionId)) || undefined;
  }
  return sessions.get(sessionId);
}

// Helper function to get all sessions (only works with in-memory, Redis requires scanning)
export function getAllSessions(): CollaborationSession[] {
  if (redisStore.isUsingRedis()) {
    console.warn(
      'getAllSessions() not supported with Redis - use Redis SCAN instead',
    );
    return [];
  }
  return Array.from(sessions.values());
}

// Cleanup function for graceful shutdown
export async function cleanupCollaborationServer(): Promise<void> {
  try {
    await redisStore.disconnect();
    console.log('✅ Collaboration server cleanup complete');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}
