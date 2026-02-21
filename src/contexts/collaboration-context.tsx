'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type { Socket } from 'socket.io-client';
import type {
  CollaborationState,
  CollaborationSession,
  CollaborationUser,
  ChatMessage,
  CursorPosition,
  Selection,
  SessionCreateRequest,
  SessionJoinRequest,
  UserPermission,
  WebSocketMessage,
} from '@/lib/collaboration/types';
import {
  createCollaborationUser,
  generateUserId,
  canEdit,
  isAdmin,
} from '@/lib/collaboration/utils';
import { toast } from 'sonner';

// Dynamically import socket.io-client to avoid SSR issues
let io: typeof import('socket.io-client').io | null = null;

async function getSocketIO() {
  if (!io) {
    const socketIO = await import('socket.io-client');
    io = socketIO.io;
  }
  return io;
}

interface CollaborationContextValue {
  state: CollaborationState;
  // Session management
  createSession: (request: SessionCreateRequest) => Promise<string | null>;
  joinSession: (request: SessionJoinRequest) => Promise<boolean>;
  leaveSession: () => void;
  // Code updates
  updateCode: (code: string) => void;
  updateLanguage: (language: string) => void;
  // Cursor and selection
  updateCursor: (position: CursorPosition) => void;
  updateSelection: (selection: Selection | null) => void;
  // Chat
  sendMessage: (message: string) => void;
  sendVoiceNote: (audioBlob: Blob, duration: number) => void;
  // Permissions
  changeUserPermission: (userId: string, permission: UserPermission) => void;
  // WebRTC signaling
  sendWebRTCOffer: (
    offer: RTCSessionDescriptionInit,
    toUserId?: string,
  ) => void;
  sendWebRTCAnswer: (
    answer: RTCSessionDescriptionInit,
    toUserId: string,
  ) => void;
  sendWebRTCIceCandidate: (
    candidate: RTCIceCandidateInit,
    toUserId: string,
  ) => void;
  endWebRTCCall: () => void;
  getSocket: () => Socket | null;
  // Connection
  connect: () => void;
  disconnect: () => void;
  // Getters
  canUserEdit: () => boolean;
  isUserAdmin: () => boolean;
  getCurrentCode: () => string;
}

const CollaborationContext = createContext<CollaborationContextValue | null>(
  null,
);

const initialState: CollaborationState = {
  session: null,
  currentUser: null,
  users: new Map(),
  cursors: new Map(),
  selections: new Map(),
  messages: [],
  isConnected: false,
  isConnecting: false,
  error: null,
};

export function CollaborationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<CollaborationState>(initialState);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isRestoringRef = useRef(false);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('collaboration-session');
      const savedUser = localStorage.getItem('collaboration-user');
      const savedMessages = localStorage.getItem('collaboration-messages');
      if (savedSession && savedUser) {
        const session = JSON.parse(savedSession);
        const user = JSON.parse(savedUser);
        const messages = savedMessages ? JSON.parse(savedMessages) : [];
        isRestoringRef.current = true;
        const users = new Map();
        session.users.forEach((u: CollaborationUser) => users.set(u.id, u));
        setState((prev) => ({
          ...prev,
          session,
          currentUser: user,
          users,
          messages,
        }));
      }
    } catch (error) {
      console.error('Error loading session from localStorage:', error);
    }
  }, []);

  // Get WebSocket URL from environment or use default
  const getWebSocketUrl = () => {
    if (typeof window === 'undefined') return '';
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    return wsUrl;
  };

  // Connect to WebSocket server
  const connect = useCallback(async () => {
    if (socketRef.current?.connected) {
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    const wsUrl = getWebSocketUrl();
    if (!wsUrl) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: 'WebSocket URL not configured',
      }));
      return;
    }

    const socketIO = await getSocketIO();
    if (!socketIO) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to load socket.io client',
      }));
      return;
    }

    const socket = socketIO(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to collaboration server');
      setState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        error: null,
      }));
      reconnectAttemptsRef.current = 0;

      // If we have a session, rejoin it
      if (state.session && state.currentUser && !isRestoringRef.current) {
        joinSession({
          sessionId: state.session.id,
          userId: state.currentUser.id,
          userName: state.currentUser.name,
          permission: state.currentUser.permission,
        });
      } else if (isRestoringRef.current && state.session && state.currentUser) {
        // Rejoin restored session
        isRestoringRef.current = false;
        joinSession({
          sessionId: state.session.id,
          userId: state.currentUser.id,
          userName: state.currentUser.name,
          permission: state.currentUser.permission,
        });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from collaboration server:', reason);
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
      }));

      // Attempt to reconnect if not intentional
      if (reason !== 'io client disconnect') {
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 2000 * reconnectAttemptsRef.current);
        }
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      const errorMessage = error.message || 'Failed to connect to server';

      // Provide helpful error message if server is not running
      if (
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('failed')
      ) {
        toast.error(
          'Collaboration server not running. Please start it with: npm run dev:server',
          { duration: 5000 },
        );
      }

      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
    });

    // Handle incoming messages
    socket.on('session-created', (data: WebSocketMessage) => {
      const session = data.payload as CollaborationSession;
      setState((prev) => {
        const users = new Map();
        session.users.forEach((u) => users.set(u.id, u));
        return {
          ...prev,
          session,
          currentUser:
            session.users.find((u) => u.id === session.ownerId) || null,
          users,
          error: null,
        };
      });
      // Save to localStorage
      localStorage.setItem('collaboration-session', JSON.stringify(session));
      if (session.users.find((u) => u.id === session.ownerId)) {
        localStorage.setItem(
          'collaboration-user',
          JSON.stringify(session.users.find((u) => u.id === session.ownerId)),
        );
      }
      toast.success('Session created successfully');
    });

    socket.on('session-joined', (data: WebSocketMessage) => {
      const { session, user, messages } = data.payload as {
        session: CollaborationSession;
        user: CollaborationUser;
        messages?: ChatMessage[];
      };
      setState((prev) => {
        const users = new Map(prev.users);
        session.users.forEach((u) => users.set(u.id, u));
        return {
          ...prev,
          session,
          currentUser: user,
          users,
          messages: messages || prev.messages,
          error: null,
        };
      });
      // Save to localStorage
      localStorage.setItem('collaboration-session', JSON.stringify(session));
      localStorage.setItem('collaboration-user', JSON.stringify(user));
      if (messages) {
        localStorage.setItem(
          'collaboration-messages',
          JSON.stringify(messages),
        );
      }
      toast.success(`Joined session: ${session.name}`);
    });

    socket.on('user-joined', (data: WebSocketMessage) => {
      const user = data.payload as CollaborationUser;
      setState((prev) => {
        const users = new Map(prev.users);
        users.set(user.id, user);
        return {
          ...prev,
          users,
          session: prev.session
            ? {
                ...prev.session,
                users: Array.from(users.values()),
              }
            : null,
        };
      });
      toast.info(`${user.name} joined the session`);
    });

    socket.on('user-left', (data: WebSocketMessage) => {
      const userId = data.payload as string;
      setState((prev) => {
        const users = new Map(prev.users);
        const user = users.get(userId);
        users.delete(userId);
        const cursors = new Map(prev.cursors);
        cursors.delete(userId);
        const selections = new Map(prev.selections);
        selections.delete(userId);

        if (user) {
          toast.info(`${user.name} left the session`);
        }

        return {
          ...prev,
          users,
          cursors,
          selections,
          session: prev.session
            ? {
                ...prev.session,
                users: Array.from(users.values()),
              }
            : null,
        };
      });
    });

    socket.on('code-updated', (data: WebSocketMessage) => {
      const { code, userId } = data.payload as { code: string; userId: string };
      // Update session code (will trigger editor update)
      setState((prev) => {
        if (prev.session && userId !== prev.currentUser?.id) {
          const updatedSession = {
            ...prev.session,
            code,
            updatedAt: Date.now(),
          };
          // Update localStorage
          localStorage.setItem(
            'collaboration-session',
            JSON.stringify(updatedSession),
          );
          return {
            ...prev,
            session: updatedSession,
          };
        }
        return prev;
      });
    });

    socket.on('cursor-updated', (data: WebSocketMessage) => {
      const cursor = data.payload as CursorPosition;
      setState((prev) => {
        const cursors = new Map(prev.cursors);
        cursors.set(cursor.userId, cursor);
        return { ...prev, cursors };
      });
    });

    socket.on('selection-updated', (data: WebSocketMessage) => {
      const selection = data.payload as Selection | null;
      if (selection) {
        setState((prev) => {
          const selections = new Map(prev.selections);
          selections.set(selection.userId, selection);
          return { ...prev, selections };
        });
      } else {
        const userId = data.userId;
        if (userId) {
          setState((prev) => {
            const selections = new Map(prev.selections);
            selections.delete(userId);
            return { ...prev, selections };
          });
        }
      }
    });

    socket.on('chat-message', (data: WebSocketMessage) => {
      const message = data.payload as ChatMessage;

      // Debug: Log received messages
      if (message.type === 'voice') {
        console.log('Received voice note:', {
          id: message.id,
          type: message.type,
          hasAudioUrl: !!message.audioUrl,
          audioUrlLength: message.audioUrl?.length || 0,
          duration: message.audioDuration,
        });
      }

      setState((prev) => {
        const newMessages = [...prev.messages, message].slice(-100);
        // Update localStorage
        localStorage.setItem(
          'collaboration-messages',
          JSON.stringify(newMessages),
        );
        return {
          ...prev,
          messages: newMessages,
        };
      });
    });

    socket.on('permission-changed', (data: WebSocketMessage) => {
      const { userId, permission } = data.payload as {
        userId: string;
        permission: UserPermission;
      };
      setState((prev) => {
        const users = new Map(prev.users);
        const user = users.get(userId);
        if (user) {
          users.set(userId, { ...user, permission });
        }
        if (prev.currentUser?.id === userId) {
          return {
            ...prev,
            users,
            currentUser: prev.currentUser
              ? { ...prev.currentUser, permission }
              : null,
          };
        }
        return { ...prev, users };
      });
      toast.info(`Permission updated for user`);
    });

    socket.on('error', (data: WebSocketMessage) => {
      const error = data.payload as string;
      setState((prev) => ({ ...prev, error }));
      toast.error(error);
    });
  }, [state.session, state.currentUser]);

  // Disconnect from WebSocket server
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setState(initialState);
  }, []);

  // Create a new session
  const createSession = useCallback(
    async (request: SessionCreateRequest): Promise<string | null> => {
      if (!socketRef.current?.connected) {
        toast.error('Not connected to server');
        return null;
      }

      const userId = state.currentUser?.id || generateUserId();
      const user =
        state.currentUser || createCollaborationUser(userId, 'User', 'admin');

      return new Promise((resolve) => {
        socketRef.current?.emit('create-session', {
          ...request,
          ownerId: userId,
          userId,
          userName: user.name,
        });

        socketRef.current?.once('session-created', (data: WebSocketMessage) => {
          const session = data.payload as CollaborationSession;
          resolve(session.id);
        });

        socketRef.current?.once('error', () => {
          resolve(null);
        });
      });
    },
    [state.currentUser],
  );

  // Join an existing session
  const joinSession = useCallback(
    async (request: SessionJoinRequest): Promise<boolean> => {
      if (!socketRef.current?.connected) {
        toast.error('Not connected to server');
        return false;
      }

      return new Promise((resolve) => {
        socketRef.current?.emit('join-session', request);

        socketRef.current?.once('session-joined', () => {
          resolve(true);
        });

        socketRef.current?.once('error', () => {
          resolve(false);
        });
      });
    },
    [],
  );

  // Leave current session
  const leaveSession = useCallback(() => {
    if (socketRef.current?.connected && state.session) {
      socketRef.current.emit('leave-session', {
        sessionId: state.session.id,
        userId: state.currentUser?.id,
      });
    }
    // Clear localStorage
    localStorage.removeItem('collaboration-session');
    localStorage.removeItem('collaboration-user');
    localStorage.removeItem('collaboration-messages');
    setState((prev) => ({
      ...prev,
      session: null,
      currentUser: null,
      users: new Map(),
      cursors: new Map(),
      selections: new Map(),
      messages: [],
    }));
  }, [state.session, state.currentUser]);

  // Update code
  const updateCode = useCallback(
    (code: string) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      socketRef.current.emit('update-code', {
        sessionId: state.session.id,
        userId: state.currentUser.id,
        code,
      });
    },
    [state.session, state.currentUser],
  );

  // Update language
  const updateLanguage = useCallback(
    (language: string) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      if (!isAdmin(state.currentUser.permission)) {
        toast.error('Only admins can change the language');
        return;
      }

      socketRef.current.emit('update-language', {
        sessionId: state.session.id,
        userId: state.currentUser.id,
        language,
      });
    },
    [state.session, state.currentUser],
  );

  // Update cursor position
  const updateCursor = useCallback(
    (position: CursorPosition) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      socketRef.current.emit('update-cursor', {
        sessionId: state.session.id,
        cursor: position,
      });
    },
    [state.session, state.currentUser],
  );

  // Update selection
  const updateSelection = useCallback(
    (selection: Selection | null) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      socketRef.current.emit('update-selection', {
        sessionId: state.session.id,
        selection,
      });
    },
    [state.session, state.currentUser],
  );

  // Send chat message
  const sendMessage = useCallback(
    (message: string) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      socketRef.current.emit('chat-message', {
        sessionId: state.session.id,
        userId: state.currentUser.id,
        message: message.trim(),
      });
    },
    [state.session, state.currentUser],
  );

  // Send voice note
  const sendVoiceNote = useCallback(
    async (audioBlob: Blob, duration: number) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      try {
        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          socketRef.current?.emit('chat-message', {
            sessionId: state.session!.id,
            userId: state.currentUser!.id,
            message: '', // Empty for voice notes
            type: 'voice',
            audioUrl: base64Audio,
            audioDuration: duration,
          });
        };
        reader.readAsDataURL(audioBlob);
      } catch (error) {
        console.error('Error sending voice note:', error);
        toast.error('Failed to send voice note');
      }
    },
    [state.session, state.currentUser],
  );

  // Change user permission
  const changeUserPermission = useCallback(
    (userId: string, permission: UserPermission) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      if (!isAdmin(state.currentUser.permission)) {
        toast.error('Only admins can change permissions');
        return;
      }

      socketRef.current.emit('change-permission', {
        sessionId: state.session.id,
        userId,
        permission,
        changedBy: state.currentUser.id,
      });
    },
    [state.session, state.currentUser],
  );

  // Helper functions
  const canUserEdit = useCallback(() => {
    return state.currentUser ? canEdit(state.currentUser.permission) : false;
  }, [state.currentUser]);

  const isUserAdmin = useCallback(() => {
    return state.currentUser ? isAdmin(state.currentUser.permission) : false;
  }, [state.currentUser]);

  const getCurrentCode = useCallback(() => {
    return state.session?.code || '';
  }, [state.session]);

  // WebRTC signaling functions
  const sendWebRTCOffer = useCallback(
    (offer: RTCSessionDescriptionInit, toUserId?: string) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      socketRef.current.emit('webrtc-offer', {
        sessionId: state.session.id,
        fromUserId: state.currentUser.id,
        toUserId,
        offer,
      });
    },
    [state.session, state.currentUser],
  );

  const sendWebRTCAnswer = useCallback(
    (answer: RTCSessionDescriptionInit, toUserId: string) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      socketRef.current.emit('webrtc-answer', {
        sessionId: state.session.id,
        fromUserId: state.currentUser.id,
        toUserId,
        answer,
      });
    },
    [state.session, state.currentUser],
  );

  const sendWebRTCIceCandidate = useCallback(
    (candidate: RTCIceCandidateInit, toUserId: string) => {
      if (
        !socketRef.current?.connected ||
        !state.session ||
        !state.currentUser
      ) {
        return;
      }

      socketRef.current.emit('webrtc-ice-candidate', {
        sessionId: state.session.id,
        fromUserId: state.currentUser.id,
        toUserId,
        candidate,
      });
    },
    [state.session, state.currentUser],
  );

  const endWebRTCCall = useCallback(() => {
    if (!socketRef.current?.connected || !state.session || !state.currentUser) {
      return;
    }

    socketRef.current.emit('webrtc-end-call', {
      sessionId: state.session.id,
      userId: state.currentUser.id,
    });
  }, [state.session, state.currentUser]);

  // Expose socket for WebRTC component to listen to events
  const getSocket = useCallback(() => {
    return socketRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value: CollaborationContextValue = {
    state,
    createSession,
    joinSession,
    leaveSession,
    updateCode,
    updateLanguage,
    updateCursor,
    updateSelection,
    sendMessage,
    sendVoiceNote,
    changeUserPermission,
    sendWebRTCOffer,
    sendWebRTCAnswer,
    sendWebRTCIceCandidate,
    endWebRTCCall,
    getSocket,
    connect,
    disconnect,
    canUserEdit,
    isUserAdmin,
    getCurrentCode,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error(
      'useCollaboration must be used within CollaborationProvider',
    );
  }
  return context;
}
