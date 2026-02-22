/**
 * Custom Yjs provider that works with Socket.IO
 * This bridges Yjs CRDT operations with our Socket.IO server
 */

import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { io, Socket } from 'socket.io-client';

export class SocketIOProvider {
  doc: Y.Doc;
  awareness: Awareness;
  socket: Socket;
  room: string;
  synced: boolean = false;
  _updateHandler: (update: Uint8Array, origin: any) => void;
  _awarenessUpdateHandler: () => void;

  constructor(room: string, doc: Y.Doc, wsUrl: string) {
    this.doc = doc;
    this.room = room;
    this.awareness = new Awareness(doc);

    // Connect to Socket.IO server
    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    // Handle document updates - send to server when local changes occur
    this._updateHandler = (update: Uint8Array, origin: any) => {
      // Only send updates that didn't come from the server (this provider)
      if (origin !== this && this.socket.connected) {
        this.socket.emit('yjs-update', {
          room,
          update: Array.from(update),
        });
      }
    };

    // Handle awareness updates (cursor, selection, etc.)
    this._awarenessUpdateHandler = () => {
      const awarenessUpdate = this.awareness.getLocalState();
      this.socket.emit('yjs-awareness', {
        room,
        awareness: awarenessUpdate,
      });
    };

    // Listen for updates from server
    this.socket.on('connect', () => {
      this.socket.emit('join-yjs-room', { room });

      // Request sync state when connected
      this.socket.emit('yjs-sync-request', { room });
    });

    this.socket.on('yjs-update', (data: { update: number[] }) => {
      try {
        const update = new Uint8Array(data.update);
        Y.applyUpdate(this.doc, update, this);
      } catch (error) {
        console.error('Error applying Yjs update:', error);
      }
    });

    this.socket.on('yjs-sync-response', (data: { state?: number[] }) => {
      try {
        if (data.state && data.state.length > 0) {
          const state = new Uint8Array(data.state);
          Y.applyUpdate(this.doc, state, this);
          this.synced = true;
        }
      } catch (error) {
        console.error('Error applying Yjs sync state:', error);
      }
    });

    this.socket.on(
      'yjs-awareness',
      (data: { awareness: any; userId?: string }) => {
        // Update awareness from other clients
        // Note: Full awareness sync requires proper encoding/decoding
        // For now, we'll handle cursor/selection through separate events
      },
    );

    // Start syncing
    this.doc.on('update', this._updateHandler);
    this.awareness.on('update', this._awarenessUpdateHandler);
  }

  destroy() {
    this.doc.off('update', this._updateHandler);
    this.awareness.off('update', this._awarenessUpdateHandler);
    this.socket.emit('leave-yjs-room', { room: this.room });
    this.socket.disconnect();
    this.awareness.destroy();
  }
}
