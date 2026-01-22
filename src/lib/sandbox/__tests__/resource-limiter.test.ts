import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  checkRateLimit,
  generateSessionId,
  getOrCreateSessionId,
  cleanupRateLimits,
} from '../resource-limiter';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Setup localStorage mock for browser-like environment
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Resource Limiter', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('generateSessionId', () => {
    it('should generate a unique session ID', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();

      expect(id1).toBeDefined();
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(10);
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs containing alphanumeric characters', () => {
      const id = generateSessionId();

      expect(id).toMatch(/^[a-z0-9-]+$/);
    });
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const sessionId = 'test-session-1';

      const result = checkRateLimit(sessionId);

      expect(result.isLimited).toBe(false);
      expect(result.remaining).toBe(59); // 60 - 1
    });

    it('should track multiple requests from same session', () => {
      const sessionId = 'test-session-2';

      // Make several requests
      checkRateLimit(sessionId);
      checkRateLimit(sessionId);
      const result = checkRateLimit(sessionId);

      expect(result.isLimited).toBe(false);
      expect(result.remaining).toBe(57); // 60 - 3
    });

    it('should limit after max requests exceeded', () => {
      const sessionId = 'test-session-3';

      // Make 60 requests (the limit)
      for (let i = 0; i < 60; i++) {
        checkRateLimit(sessionId);
      }

      // 61st request should be limited
      const result = checkRateLimit(sessionId);

      expect(result.isLimited).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it('should provide reset time', () => {
      const sessionId = 'test-session-4';
      const before = Date.now();

      const result = checkRateLimit(sessionId);

      expect(result.resetTime).toBeGreaterThan(before);
      expect(result.resetTime).toBeLessThanOrEqual(before + 60000 + 100); // Within 1 minute + small buffer
    });

    it('should track different sessions independently', () => {
      const session1 = 'session-a';
      const session2 = 'session-b';

      // Make 30 requests from session 1
      for (let i = 0; i < 30; i++) {
        checkRateLimit(session1);
      }

      // Session 2 should still have full quota
      const result = checkRateLimit(session2);

      expect(result.isLimited).toBe(false);
      expect(result.remaining).toBe(59);
    });
  });

  describe('getOrCreateSessionId', () => {
    it('should create a new session ID if none exists', () => {
      const id = getOrCreateSessionId();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should return existing session ID if available', () => {
      const existingId = 'existing-session-id';
      localStorageMock.getItem.mockReturnValueOnce(existingId);

      const id = getOrCreateSessionId();

      expect(id).toBe(existingId);
    });

    it('should persist session ID to localStorage', () => {
      getOrCreateSessionId();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'sandbox-session-id',
        expect.any(String),
      );
    });
  });

  describe('cleanupRateLimits', () => {
    it('should not throw when called', () => {
      expect(() => cleanupRateLimits()).not.toThrow();
    });

    it('should be callable multiple times', () => {
      expect(() => {
        cleanupRateLimits();
        cleanupRateLimits();
        cleanupRateLimits();
      }).not.toThrow();
    });
  });
});
