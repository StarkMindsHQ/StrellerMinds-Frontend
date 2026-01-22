/**
 * Sandbox Executor - Main orchestrator for secure code execution
 *
 * This module provides a unified interface for executing code in multiple
 * languages with security, resource limits, and real-time output streaming.
 *
 * Security Model:
 * 1. Static analysis (security-validator.ts) - First line of defense
 * 2. Web Worker isolation (JS/TS) or WebAssembly sandbox (Python)
 * 3. Resource limits (CPU, memory, time, output)
 * 4. Rate limiting per session
 * 5. Output sanitization
 *
 * @see https://github.com/restyler/awesome-sandbox - Code sandbox best practices
 * @see https://pyodide.org/docs/security/ - WebAssembly security model
 */

import type {
  SupportedLanguage,
  ExecutionConfig,
  ExecutionOutput,
  ExecutionResult,
  ExecutionStatus,
  SandboxCallbacks,
  SandboxController,
  ValidationResult,
} from './types';
import { DEFAULT_EXECUTION_CONFIG } from './types';
import { executeJavaScript } from './javascript-executor';
import { executePython, preloadPyodide } from './python-executor';
import { validateCode, sanitizeInput } from './security-validator';
import { getOrCreateSessionId } from './resource-limiter';

export type {
  SupportedLanguage,
  ExecutionConfig,
  ExecutionOutput,
  ExecutionResult,
  ExecutionStatus,
};
export { DEFAULT_EXECUTION_CONFIG };

/**
 * Main sandbox executor class
 */
export class SandboxExecutor {
  private config: ExecutionConfig;
  private controller: SandboxController | null = null;
  private callbacks: SandboxCallbacks;

  constructor(
    config: Partial<ExecutionConfig> = {},
    callbacks: SandboxCallbacks,
  ) {
    this.config = {
      ...DEFAULT_EXECUTION_CONFIG,
      ...config,
      resourceLimits: {
        ...DEFAULT_EXECUTION_CONFIG.resourceLimits,
        ...config.resourceLimits,
      },
      securityConfig: {
        ...DEFAULT_EXECUTION_CONFIG.securityConfig,
        ...config.securityConfig,
      },
    };
    this.callbacks = callbacks;
  }

  /**
   * Execute code in the sandbox
   */
  async execute(code: string): Promise<SandboxController> {
    // Stop any existing execution
    this.stop();

    // Execute based on language
    switch (this.config.language) {
      case 'javascript':
      case 'typescript':
        this.controller = await executeJavaScript(
          code,
          this.config,
          this.callbacks,
        );
        break;

      case 'python':
        this.controller = await executePython(
          code,
          this.config,
          this.callbacks,
        );
        break;

      default:
        const error: ExecutionOutput = {
          type: 'error',
          content: `Unsupported language: ${this.config.language}`,
          timestamp: Date.now(),
        };
        this.callbacks.onOutput(error);
        this.callbacks.onStatusChange('error');
        this.callbacks.onComplete({
          success: false,
          outputs: [error],
          status: 'error',
          executionTime: 0,
          error: `Unsupported language: ${this.config.language}`,
        });
        this.controller = { stop: () => {}, isRunning: () => false };
    }

    return this.controller;
  }

  /**
   * Stop current execution
   */
  stop(): void {
    if (this.controller?.isRunning()) {
      this.controller.stop();
    }
    this.controller = null;
  }

  /**
   * Check if currently executing
   */
  isRunning(): boolean {
    return this.controller?.isRunning() ?? false;
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<ExecutionConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      resourceLimits: {
        ...this.config.resourceLimits,
        ...config.resourceLimits,
      },
      securityConfig: {
        ...this.config.securityConfig,
        ...config.securityConfig,
      },
    };
  }

  /**
   * Set the execution language
   */
  setLanguage(language: SupportedLanguage): void {
    this.config.language = language;
  }

  /**
   * Get current configuration
   */
  getConfig(): ExecutionConfig {
    return { ...this.config };
  }

  /**
   * Validate code without executing
   */
  validate(code: string): ValidationResult {
    const sanitized = sanitizeInput(code);
    return validateCode(
      sanitized,
      this.config.language,
      this.config.securityConfig,
    );
  }
}

/**
 * Simplified execution function for basic use cases
 */
export async function executeCode(
  code: string,
  language: SupportedLanguage = 'javascript',
  onOutput?: (output: ExecutionOutput) => void,
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const outputs: ExecutionOutput[] = [];

    const callbacks: SandboxCallbacks = {
      onOutput: (output) => {
        outputs.push(output);
        onOutput?.(output);
      },
      onStatusChange: () => {},
      onComplete: (result) => {
        resolve(result);
      },
    };

    const executor = new SandboxExecutor({ language }, callbacks);
    executor.execute(code);
  });
}

/**
 * Execute code with a callback for each log (backwards compatible)
 */
export async function executeCodeWithCallback(
  code: string,
  logCallback: (log: string) => void,
  language: SupportedLanguage = 'javascript',
): Promise<{ stop: () => void }> {
  const callbacks: SandboxCallbacks = {
    onOutput: (output) => {
      const prefix =
        output.type === 'error'
          ? 'ERROR: '
          : output.type === 'warn'
            ? 'WARNING: '
            : output.type === 'system'
              ? ''
              : '';
      logCallback(prefix + output.content);
    },
    onStatusChange: () => {},
    onComplete: () => {},
  };

  const executor = new SandboxExecutor({ language }, callbacks);
  const controller = await executor.execute(code);

  return { stop: () => controller.stop() };
}

/**
 * Get supported languages
 */
export function getSupportedLanguages(): SupportedLanguage[] {
  return ['javascript', 'typescript', 'python'];
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(language: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
  };
  return names[language] || language;
}

/**
 * Get Monaco editor language ID
 */
export function getMonacoLanguage(language: SupportedLanguage): string {
  const monacoLanguages: Record<SupportedLanguage, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
  };
  return monacoLanguages[language] || 'javascript';
}

/**
 * Preload runtimes for faster execution
 */
export async function preloadRuntimes(): Promise<void> {
  // Preload Pyodide in the background
  preloadPyodide().catch(() => {
    // Silently ignore preload failures
  });
}

/**
 * Initialize sandbox (call on app startup if desired)
 */
export function initializeSandbox(): void {
  // Get or create session ID for rate limiting
  getOrCreateSessionId();

  // Optionally preload runtimes
  if (typeof window !== 'undefined') {
    // Defer preloading to not block initial load
    setTimeout(() => {
      preloadRuntimes();
    }, 5000);
  }
}
