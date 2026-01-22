/**
 * Secure Code Execution Sandbox - Type Definitions
 *
 * Based on best practices from:
 * - WebAssembly security model
 * - Docker container isolation patterns
 * - Defense-in-depth architectures
 */

export type SupportedLanguage = 'javascript' | 'typescript' | 'python';

export type ExecutionStatus =
  | 'idle'
  | 'validating'
  | 'compiling'
  | 'executing'
  | 'completed'
  | 'error'
  | 'timeout'
  | 'stopped';

export type OutputType =
  | 'log'
  | 'error'
  | 'warn'
  | 'info'
  | 'result'
  | 'system';

export interface ExecutionOutput {
  type: OutputType;
  content: string;
  timestamp: number;
}

export interface ResourceLimits {
  /** Maximum execution time in milliseconds */
  maxExecutionTime: number;
  /** Maximum memory usage in bytes (approximate, enforced via heuristics) */
  maxMemory: number;
  /** Maximum number of iterations in loops */
  maxIterations: number;
  /** Maximum recursion depth */
  maxRecursionDepth: number;
  /** Maximum output size in characters */
  maxOutputSize: number;
}

export interface SecurityConfig {
  /** Allow network requests (fetch, XMLHttpRequest) */
  allowNetwork: boolean;
  /** Allow file system access (in virtual FS only) */
  allowFileSystem: boolean;
  /** Allow eval and Function constructor */
  allowDynamicCode: boolean;
  /** List of blocked global objects */
  blockedGlobals: string[];
  /** List of blocked import patterns */
  blockedImports: string[];
}

export interface ExecutionConfig {
  language: SupportedLanguage;
  resourceLimits: ResourceLimits;
  securityConfig: SecurityConfig;
  /** Enable Stellar SDK mock for blockchain education */
  enableStellarMock: boolean;
  /** Session ID for rate limiting */
  sessionId?: string;
}

export interface ExecutionResult {
  success: boolean;
  outputs: ExecutionOutput[];
  status: ExecutionStatus;
  executionTime: number;
  memoryUsage?: number;
  error?: string;
}

export interface SandboxCallbacks {
  onOutput: (output: ExecutionOutput) => void;
  onStatusChange: (status: ExecutionStatus) => void;
  onComplete: (result: ExecutionResult) => void;
}

export interface SandboxController {
  /** Stop the current execution */
  stop: () => void;
  /** Check if execution is running */
  isRunning: () => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: 'security' | 'syntax' | 'resource';
  message: string;
  line?: number;
  column?: number;
}

export interface ValidationWarning {
  type: 'performance' | 'deprecation' | 'style';
  message: string;
  line?: number;
  column?: number;
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: SupportedLanguage;
  code: string;
  category: 'basic' | 'blockchain' | 'algorithm' | 'data-structure' | 'web3';
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  isLimited: boolean;
}

// Default configurations
export const DEFAULT_RESOURCE_LIMITS: ResourceLimits = {
  maxExecutionTime: 30000, // 30 seconds
  maxMemory: 50 * 1024 * 1024, // 50 MB
  maxIterations: 1000000, // 1 million iterations
  maxRecursionDepth: 100,
  maxOutputSize: 100000, // 100KB of output
};

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  allowNetwork: false,
  allowFileSystem: false,
  allowDynamicCode: false,
  blockedGlobals: [
    'process',
    'require',
    'module',
    'exports',
    '__dirname',
    '__filename',
    'global',
    'globalThis',
    'window',
    'document',
    'localStorage',
    'sessionStorage',
    'indexedDB',
    'WebSocket',
    'Worker',
    'SharedWorker',
    'ServiceWorker',
    'importScripts',
  ],
  blockedImports: [
    'fs',
    'path',
    'os',
    'child_process',
    'cluster',
    'dgram',
    'dns',
    'http',
    'https',
    'net',
    'tls',
    'crypto',
    'vm',
    'worker_threads',
  ],
};

export const DEFAULT_EXECUTION_CONFIG: ExecutionConfig = {
  language: 'javascript',
  resourceLimits: DEFAULT_RESOURCE_LIMITS,
  securityConfig: DEFAULT_SECURITY_CONFIG,
  enableStellarMock: true,
};
