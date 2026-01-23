/**
 * Standalone WebSocket server for real-time collaboration
 * Run this with: npx tsx server.ts
 * Or compile and run: npm run dev:server
 */

import http from 'http';
import { createCollaborationServer } from './src/lib/collaboration/server';

const PORT = process.env.WS_PORT || 3001;
const app = http.createServer();

// Create server (now async due to Redis connection)
(async () => {
  try {
    await createCollaborationServer(app);
    console.log('✅ Collaboration server initialized');

    app.listen(PORT, () => {
      console.log(`Collaboration WebSocket server running on port ${PORT}`);
      console.log(
        `Connect from: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,
      );
      if (process.env.REDIS_URL) {
        console.log('✅ Using Redis for session storage');
      } else {
        console.log('📦 Using in-memory storage (Redis not configured)');
      }
    });
  } catch (error) {
    console.error('❌ Failed to initialize collaboration server:', error);
    process.exit(1);
  }
})();

// Graceful shutdown
import { cleanupCollaborationServer } from './src/lib/collaboration/server';

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await cleanupCollaborationServer();
  app.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await cleanupCollaborationServer();
  app.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
