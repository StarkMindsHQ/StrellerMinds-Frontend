/**
 * Resource Limiter for Code Execution Sandbox
 *
 * Implements rate limiting and resource tracking to prevent abuse
 * and ensure fair usage across all users.
 */

import type { ResourceLimits, RateLimitInfo } from './types';

// Rate limiting storage (in-memory for client-side, could be Redis for server)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Default rate limit: 60 executions per minute
const DEFAULT_RATE_LIMIT = 60;
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds

/**
 * Check if a session is rate limited
 */
export function checkRateLimit(sessionId: string): RateLimitInfo {
  const now = Date.now();
  const record = rateLimitStore.get(sessionId);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitStore.set(sessionId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return {
      remaining: DEFAULT_RATE_LIMIT - 1,
      resetTime: now + RATE_LIMIT_WINDOW,
      isLimited: false,
    };
  }

  if (record.count >= DEFAULT_RATE_LIMIT) {
    return {
      remaining: 0,
      resetTime: record.resetTime,
      isLimited: true,
    };
  }

  record.count++;
  return {
    remaining: DEFAULT_RATE_LIMIT - record.count,
    resetTime: record.resetTime,
    isLimited: false,
  };
}

/**
 * Generate a unique session ID for rate limiting
 */
export function generateSessionId(): string {
  // Use a combination of timestamp and random values
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
}

/**
 * Get or create a session ID from localStorage
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return generateSessionId();
  }

  const storageKey = 'sandbox-session-id';
  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

/**
 * Create code that instruments loops and recursion for resource limiting
 */
export function instrumentCode(code: string, limits: ResourceLimits): string {
  const instrumentedCode = `
    // Resource limiting instrumentation
    let __iterationCount__ = 0;
    let __recursionDepth__ = 0;
    let __outputSize__ = 0;
    const __maxIterations__ = ${limits.maxIterations};
    const __maxRecursion__ = ${limits.maxRecursionDepth};
    const __maxOutput__ = ${limits.maxOutputSize};
    const __startTime__ = Date.now();
    const __maxTime__ = ${limits.maxExecutionTime};

    function __checkLimits__() {
      if (Date.now() - __startTime__ > __maxTime__) {
        throw new Error('Execution time limit exceeded');
      }
      __iterationCount__++;
      if (__iterationCount__ > __maxIterations__) {
        throw new Error('Maximum iteration limit exceeded');
      }
    }

    function __checkRecursion__(fn) {
      return function(...args) {
        __recursionDepth__++;
        if (__recursionDepth__ > __maxRecursion__) {
          __recursionDepth__--;
          throw new Error('Maximum recursion depth exceeded');
        }
        try {
          return fn.apply(this, args);
        } finally {
          __recursionDepth__--;
        }
      };
    }

    function __checkOutput__(output) {
      const outputStr = String(output);
      __outputSize__ += outputStr.length;
      if (__outputSize__ > __maxOutput__) {
        throw new Error('Maximum output size exceeded');
      }
      return output;
    }

    // User code begins below
    ${code}
  `;

  return instrumentedCode;
}

/**
 * Create a Web Worker script with resource monitoring
 */
export function createWorkerWithLimits(
  userCode: string,
  limits: ResourceLimits,
  additionalContext: string = '',
): string {
  return `
    // Resource tracking variables
    let isRunning = true;
    let startTime = Date.now();
    const maxTime = ${limits.maxExecutionTime};
    const maxIterations = ${limits.maxIterations};
    let iterationCount = 0;
    let outputSize = 0;
    const maxOutputSize = ${limits.maxOutputSize};
    const activeTimeouts = [];
    const activeIntervals = [];

    // Check if we should stop
    function checkShouldStop() {
      if (!isRunning) {
        throw new Error('Execution stopped by user');
      }
      if (Date.now() - startTime > maxTime) {
        throw new Error('Execution time limit exceeded');
      }
    }

    // Iteration counter for loops
    function countIteration() {
      iterationCount++;
      if (iterationCount > maxIterations) {
        throw new Error('Maximum iteration limit exceeded (' + maxIterations + ' iterations)');
      }
      checkShouldStop();
    }

    // Output size tracker
    function trackOutput(msg) {
      const str = String(msg);
      outputSize += str.length;
      if (outputSize > maxOutputSize) {
        throw new Error('Maximum output size exceeded');
      }
      return str;
    }

    // Safe setTimeout replacement
    const originalSetTimeout = self.setTimeout;
    self.setTimeout = function(callback, delay, ...args) {
      checkShouldStop();
      const id = originalSetTimeout(function() {
        if (isRunning) {
          try {
            checkShouldStop();
            callback(...args);
          } catch (e) {
            self.postMessage({ type: 'error', data: e.message });
          }
        }
        const idx = activeTimeouts.indexOf(id);
        if (idx > -1) activeTimeouts.splice(idx, 1);
        if (activeTimeouts.length === 0 && activeIntervals.length === 0) {
          self.postMessage({ type: 'done' });
        }
      }, Math.min(delay, maxTime));
      activeTimeouts.push(id);
      return id;
    };

    // Safe setInterval replacement
    const originalSetInterval = self.setInterval;
    self.setInterval = function(callback, delay, ...args) {
      checkShouldStop();
      const id = originalSetInterval(function() {
        if (isRunning) {
          try {
            checkShouldStop();
            countIteration();
            callback(...args);
          } catch (e) {
            self.postMessage({ type: 'error', data: e.message });
            clearInterval(id);
          }
        }
      }, Math.max(delay, 10)); // Minimum 10ms interval
      activeIntervals.push(id);
      return id;
    };

    // Safe clearTimeout
    const originalClearTimeout = self.clearTimeout;
    self.clearTimeout = function(id) {
      const idx = activeTimeouts.indexOf(id);
      if (idx > -1) activeTimeouts.splice(idx, 1);
      return originalClearTimeout(id);
    };

    // Safe clearInterval
    const originalClearInterval = self.clearInterval;
    self.clearInterval = function(id) {
      const idx = activeIntervals.indexOf(id);
      if (idx > -1) activeIntervals.splice(idx, 1);
      return originalClearInterval(id);
    };

    // Message handler
    self.onmessage = function(e) {
      const { code, action } = e.data;

      if (action === 'stop') {
        isRunning = false;
        activeTimeouts.forEach(id => originalClearTimeout(id));
        activeIntervals.forEach(id => originalClearInterval(id));
        activeTimeouts.length = 0;
        activeIntervals.length = 0;
        self.close();
        return;
      }

      // Create safe console
      const safeConsole = {
        log: function(...args) {
          if (!isRunning) return;
          checkShouldStop();
          const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'log', data: trackOutput(message) });
        },
        error: function(...args) {
          if (!isRunning) return;
          checkShouldStop();
          const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'error', data: trackOutput(message) });
        },
        warn: function(...args) {
          if (!isRunning) return;
          checkShouldStop();
          const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'warn', data: trackOutput(message) });
        },
        info: function(...args) {
          if (!isRunning) return;
          checkShouldStop();
          const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'info', data: trackOutput(message) });
        }
      };

      ${additionalContext}

      try {
        // Execute user code in a safe context
        const executeFn = new Function(
          'console',
          'setTimeout',
          'setInterval',
          'clearTimeout',
          'clearInterval',
          'checkShouldStop',
          'countIteration',
          code
        );

        executeFn(
          safeConsole,
          self.setTimeout,
          self.setInterval,
          self.clearTimeout,
          self.clearInterval,
          checkShouldStop,
          countIteration
        );

        // Signal completion if no async operations
        if (activeTimeouts.length === 0 && activeIntervals.length === 0) {
          self.postMessage({ type: 'done' });
        }
      } catch (error) {
        self.postMessage({ type: 'error', data: 'Execution error: ' + error.message });
        self.postMessage({ type: 'done' });
      }
    };

    // Global error handler
    self.onerror = function(event) {
      self.postMessage({ type: 'error', data: 'Worker error: ' + event.message });
      self.postMessage({ type: 'done' });
    };
  `;
}

/**
 * Clean up old rate limit records to prevent memory leaks
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime + RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
