// src/lib/notifications/websocketClient.ts

import { Notification, WebSocketMessage } from '@/types/notification.types';

type MessageHandler = (notification: Notification) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Set<MessageHandler> = new Set();
  private isIntentionallyClosed = false;
  private pingInterval: NodeJS.Timeout | null = null;

  connect(userId: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isIntentionallyClosed = false;
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/notifications?userId=${userId}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.startPing();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === 'notification' && message.payload) {
          const notification: Notification = {
            ...message.payload,
            createdAt: new Date(message.payload.createdAt),
            readAt: message.payload.readAt
              ? new Date(message.payload.readAt)
              : undefined,
            expiresAt: message.payload.expiresAt
              ? new Date(message.payload.expiresAt)
              : undefined,
          };

          this.messageHandlers.forEach((handler) => handler(notification));
        } else if (message.type === 'ping') {
          this.send({ type: 'pong', timestamp: Date.now() });
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.stopPing();

      if (!this.isIntentionallyClosed) {
        this.reconnect(userId);
      }
    };
  }

  private reconnect(userId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(
        `Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts})`,
      );

      setTimeout(() => {
        this.connect(userId);
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', timestamp: Date.now() });
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopPing();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  private send(message: Partial<WebSocketMessage>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  getState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketClient = new WebSocketClient();
