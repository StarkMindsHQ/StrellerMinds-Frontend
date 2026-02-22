// server/websocket.js - WebSocket Server for Real-time Notifications

const WebSocket = require('ws');
const url = require('url');

class NotificationWebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // userId -> Set of WebSocket connections

    this.setupServer();
  }

  setupServer() {
    this.wss.on('connection', (ws, req) => {
      const parameters = url.parse(req.url, true);
      const userId = parameters.query.userId;

      if (!userId) {
        ws.close(1008, 'User ID required');
        return;
      }

      console.log(`Client connected: ${userId}`);
      this.addClient(userId, ws);

      // Send initial connection success
      ws.send(
        JSON.stringify({
          type: 'connected',
          timestamp: Date.now(),
        }),
      );

      // Setup ping/pong for connection health
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(userId, ws, data);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      });

      ws.on('close', () => {
        console.log(`Client disconnected: ${userId}`);
        this.removeClient(userId, ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // Setup ping interval
    this.pingInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => {
      clearInterval(this.pingInterval);
    });
  }

  handleMessage(userId, ws, data) {
    switch (data.type) {
      case 'pong':
        ws.isAlive = true;
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  addClient(userId, ws) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId).add(ws);
  }

  removeClient(userId, ws) {
    const userConnections = this.clients.get(userId);
    if (userConnections) {
      userConnections.delete(ws);
      if (userConnections.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  sendToUser(userId, notification) {
    const userConnections = this.clients.get(userId);

    if (!userConnections || userConnections.size === 0) {
      console.log(`No active connections for user: ${userId}`);
      return false;
    }

    const message = JSON.stringify({
      type: 'notification',
      payload: notification,
      timestamp: Date.now(),
    });

    let sent = false;
    userConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        sent = true;
      }
    });

    return sent;
  }

  broadcast(notification, userIds = null) {
    const message = JSON.stringify({
      type: 'notification',
      payload: notification,
      timestamp: Date.now(),
    });

    if (userIds) {
      // Send to specific users
      userIds.forEach((userId) => {
        const userConnections = this.clients.get(userId);
        if (userConnections) {
          userConnections.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(message);
            }
          });
        }
      });
    } else {
      // Broadcast to all connected clients
      this.wss.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  getConnectionCount() {
    return this.wss.clients.size;
  }

  getUserConnectionCount(userId) {
    const userConnections = this.clients.get(userId);
    return userConnections ? userConnections.size : 0;
  }
}

// Usage Example
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wsServer = new NotificationWebSocketServer(server);

// Example endpoint to send notification
app.post('/api/internal/notify', express.json(), (req, res) => {
  const { userId, notification } = req.body;

  const sent = wsServer.sendToUser(userId, notification);

  res.json({
    success: sent,
    message: sent ? 'Notification sent' : 'User not connected',
  });
});

server.listen(3001, () => {
  console.log('WebSocket server running on port 3001');
});

module.exports = { NotificationWebSocketServer };
