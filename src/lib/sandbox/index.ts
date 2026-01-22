/**
 * Secure Code Execution Sandbox
 *
 * A comprehensive sandbox system for executing untrusted code safely
 * in the browser. Supports multiple languages with security measures.
 *
 * Features:
 * - Multi-language support (JavaScript, TypeScript, Python)
 * - WebAssembly-based isolation (Python via Pyodide)
 * - Web Worker isolation (JavaScript/TypeScript)
 * - Static security analysis
 * - Resource limits (CPU, memory, time, output)
 * - Rate limiting per session
 * - Real-time output streaming
 * - Input/output sanitization
 *
 * Usage:
 * ```typescript
 * import { SandboxExecutor, type ExecutionOutput } from '@/lib/sandbox';
 *
 * const sandbox = new SandboxExecutor(
 *   { language: 'javascript' },
 *   {
 *     onOutput: (output) => console.log(output.content),
 *     onStatusChange: (status) => console.log('Status:', status),
 *     onComplete: (result) => console.log('Done:', result.success),
 *   }
 * );
 *
 * await sandbox.execute('console.log("Hello, World!")');
 * ```
 */

// Main executor
export {
  SandboxExecutor,
  executeCode,
  executeCodeWithCallback,
  getSupportedLanguages,
  getLanguageDisplayName,
  getMonacoLanguage,
  preloadRuntimes,
  initializeSandbox,
  DEFAULT_EXECUTION_CONFIG,
} from './sandbox-executor';

// Types
export type {
  SupportedLanguage,
  ExecutionStatus,
  OutputType,
  ExecutionOutput,
  ResourceLimits,
  SecurityConfig,
  ExecutionConfig,
  ExecutionResult,
  SandboxCallbacks,
  SandboxController,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  CodeTemplate,
  RateLimitInfo,
} from './types';

export { DEFAULT_RESOURCE_LIMITS, DEFAULT_SECURITY_CONFIG } from './types';

// Security validation (for advanced use cases)
export {
  validateCode,
  sanitizeOutput,
  sanitizeInput,
} from './security-validator';

// Resource limiting (for advanced use cases)
export {
  checkRateLimit,
  generateSessionId,
  getOrCreateSessionId,
} from './resource-limiter';

// Language-specific executors (for advanced use cases)
export { executeJavaScript } from './javascript-executor';
export {
  executePython,
  isPyodideAvailable,
  preloadPyodide,
} from './python-executor';
