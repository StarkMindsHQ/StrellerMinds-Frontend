import { describe, it, expect, vi } from 'vitest';
import {
  SandboxExecutor,
  getSupportedLanguages,
  getLanguageDisplayName,
  getMonacoLanguage,
  DEFAULT_EXECUTION_CONFIG,
} from '../sandbox-executor';
import type { ExecutionOutput, SandboxCallbacks } from '../types';

// Mock callbacks factory
function createMockCallbacks(): SandboxCallbacks & {
  outputs: ExecutionOutput[];
  statuses: string[];
  completed: boolean;
  result: any;
} {
  const state = {
    outputs: [] as ExecutionOutput[],
    statuses: [] as string[],
    completed: false,
    result: null as any,
  };

  return {
    ...state,
    onOutput: vi.fn((output: ExecutionOutput) => {
      state.outputs.push(output);
    }),
    onStatusChange: vi.fn((status: string) => {
      state.statuses.push(status);
    }),
    onComplete: vi.fn((result: any) => {
      state.completed = true;
      state.result = result;
    }),
  };
}

describe('Sandbox Executor', () => {
  describe('getSupportedLanguages', () => {
    it('should return all supported languages', () => {
      const languages = getSupportedLanguages();

      expect(languages).toContain('javascript');
      expect(languages).toContain('typescript');
      expect(languages).toContain('python');
      expect(languages.length).toBe(3);
    });
  });

  describe('getLanguageDisplayName', () => {
    it('should return display name for JavaScript', () => {
      expect(getLanguageDisplayName('javascript')).toBe('JavaScript');
    });

    it('should return display name for TypeScript', () => {
      expect(getLanguageDisplayName('typescript')).toBe('TypeScript');
    });

    it('should return display name for Python', () => {
      expect(getLanguageDisplayName('python')).toBe('Python');
    });
  });

  describe('getMonacoLanguage', () => {
    it('should return Monaco language ID for JavaScript', () => {
      expect(getMonacoLanguage('javascript')).toBe('javascript');
    });

    it('should return Monaco language ID for TypeScript', () => {
      expect(getMonacoLanguage('typescript')).toBe('typescript');
    });

    it('should return Monaco language ID for Python', () => {
      expect(getMonacoLanguage('python')).toBe('python');
    });
  });

  describe('DEFAULT_EXECUTION_CONFIG', () => {
    it('should have default language as JavaScript', () => {
      expect(DEFAULT_EXECUTION_CONFIG.language).toBe('javascript');
    });

    it('should have resource limits defined', () => {
      expect(DEFAULT_EXECUTION_CONFIG.resourceLimits).toBeDefined();
      expect(
        DEFAULT_EXECUTION_CONFIG.resourceLimits.maxExecutionTime,
      ).toBeGreaterThan(0);
      expect(DEFAULT_EXECUTION_CONFIG.resourceLimits.maxMemory).toBeGreaterThan(
        0,
      );
      expect(
        DEFAULT_EXECUTION_CONFIG.resourceLimits.maxIterations,
      ).toBeGreaterThan(0);
    });

    it('should have security config defined', () => {
      expect(DEFAULT_EXECUTION_CONFIG.securityConfig).toBeDefined();
      expect(DEFAULT_EXECUTION_CONFIG.securityConfig.allowNetwork).toBe(false);
      expect(DEFAULT_EXECUTION_CONFIG.securityConfig.allowFileSystem).toBe(
        false,
      );
    });

    it('should have Stellar mock enabled by default', () => {
      expect(DEFAULT_EXECUTION_CONFIG.enableStellarMock).toBe(true);
    });
  });

  describe('SandboxExecutor', () => {
    it('should create executor with default config', () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor({}, callbacks);

      expect(executor.getConfig().language).toBe('javascript');
      expect(executor.isRunning()).toBe(false);
    });

    it('should create executor with custom config', () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor({ language: 'python' }, callbacks);

      expect(executor.getConfig().language).toBe('python');
    });

    it('should allow changing language', () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor({}, callbacks);

      executor.setLanguage('typescript');

      expect(executor.getConfig().language).toBe('typescript');
    });

    it('should allow updating config', () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor({}, callbacks);

      executor.setConfig({
        resourceLimits: {
          ...DEFAULT_EXECUTION_CONFIG.resourceLimits,
          maxExecutionTime: 10000,
        },
      });

      expect(executor.getConfig().resourceLimits.maxExecutionTime).toBe(10000);
    });

    it('should validate code without executing', () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor({}, callbacks);

      // Safe code
      const safeResult = executor.validate('console.log("hello")');
      expect(safeResult.isValid).toBe(true);

      // Unsafe code
      const unsafeResult = executor.validate('eval("dangerous")');
      expect(unsafeResult.isValid).toBe(false);
    });

    it('should report execution status changes', async () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor(
        { language: 'javascript' },
        callbacks,
      );

      // Execute code that will fail validation
      await executor.execute('eval("test")');

      // Should have called onStatusChange
      expect(callbacks.onStatusChange).toHaveBeenCalled();
    });

    it('should call onComplete when execution finishes', async () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor(
        { language: 'javascript' },
        callbacks,
      );

      // Execute code that will fail validation
      await executor.execute('eval("test")');

      // Should have called onComplete
      expect(callbacks.onComplete).toHaveBeenCalled();
    });

    it('should report validation errors via onOutput', async () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor(
        { language: 'javascript' },
        callbacks,
      );

      // Execute unsafe code
      await executor.execute('eval("dangerous")');

      // Should have output containing security error
      expect(callbacks.onOutput).toHaveBeenCalled();
      expect(callbacks.outputs.some((o) => o.type === 'error')).toBe(true);
    });

    it('should stop execution when stop is called', async () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor(
        { language: 'javascript' },
        callbacks,
      );

      // In Node.js test environment, Worker is not available
      // The executor should gracefully handle this
      try {
        const controller = await executor.execute('console.log("test")');
        // Stop execution
        executor.stop();
      } catch {
        // Expected in Node.js environment where Worker is not available
      }

      // Should not be running after stop
      expect(executor.isRunning()).toBe(false);
    });

    it('should handle empty code', async () => {
      const callbacks = createMockCallbacks();
      const executor = new SandboxExecutor({}, callbacks);

      // Validation should catch empty code before Worker is needed
      await executor.execute('');

      // onComplete should have been called with failure
      expect(callbacks.onComplete).toHaveBeenCalled();
      // The result should indicate failure for empty code
      const lastCall = (callbacks.onComplete as any).mock?.calls?.[0]?.[0];
      if (lastCall) {
        expect(lastCall.success).toBe(false);
      }
    });
  });

  describe('Resource limits', () => {
    it('should have reasonable default execution time', () => {
      expect(DEFAULT_EXECUTION_CONFIG.resourceLimits.maxExecutionTime).toBe(
        30000,
      );
    });

    it('should have reasonable default memory limit', () => {
      expect(DEFAULT_EXECUTION_CONFIG.resourceLimits.maxMemory).toBe(
        50 * 1024 * 1024,
      );
    });

    it('should have reasonable default iteration limit', () => {
      expect(DEFAULT_EXECUTION_CONFIG.resourceLimits.maxIterations).toBe(
        1000000,
      );
    });

    it('should have reasonable default recursion depth', () => {
      expect(DEFAULT_EXECUTION_CONFIG.resourceLimits.maxRecursionDepth).toBe(
        100,
      );
    });

    it('should have reasonable default output size', () => {
      expect(DEFAULT_EXECUTION_CONFIG.resourceLimits.maxOutputSize).toBe(
        100000,
      );
    });
  });

  describe('Security config', () => {
    it('should block network access by default', () => {
      expect(DEFAULT_EXECUTION_CONFIG.securityConfig.allowNetwork).toBe(false);
    });

    it('should block file system access by default', () => {
      expect(DEFAULT_EXECUTION_CONFIG.securityConfig.allowFileSystem).toBe(
        false,
      );
    });

    it('should block dynamic code by default', () => {
      expect(DEFAULT_EXECUTION_CONFIG.securityConfig.allowDynamicCode).toBe(
        false,
      );
    });

    it('should have blocked globals defined', () => {
      const blockedGlobals =
        DEFAULT_EXECUTION_CONFIG.securityConfig.blockedGlobals;

      expect(blockedGlobals).toContain('process');
      expect(blockedGlobals).toContain('window');
      expect(blockedGlobals).toContain('document');
      expect(blockedGlobals).toContain('localStorage');
    });

    it('should have blocked imports defined', () => {
      const blockedImports =
        DEFAULT_EXECUTION_CONFIG.securityConfig.blockedImports;

      expect(blockedImports).toContain('fs');
      expect(blockedImports).toContain('child_process');
      expect(blockedImports).toContain('os');
      expect(blockedImports).toContain('net');
    });
  });
});
