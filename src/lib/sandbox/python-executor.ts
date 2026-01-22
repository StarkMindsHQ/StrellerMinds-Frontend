/**
 * Python Executor for Secure Sandbox
 *
 * Uses Pyodide (Python compiled to WebAssembly) for secure,
 * client-side Python execution in the browser.
 *
 * @see https://pyodide.org/ for Pyodide documentation
 */

import type {
  ExecutionConfig,
  ExecutionOutput,
  SandboxCallbacks,
  SandboxController,
} from './types';
import {
  validateCode,
  sanitizeInput,
  sanitizeOutput,
} from './security-validator';
import { checkRateLimit, getOrCreateSessionId } from './resource-limiter';

// Pyodide CDN URL
const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

// Global Pyodide instance (lazy loaded)
let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

// Pyodide interface (minimal typing)
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython: (code: string) => unknown;
  loadPackage: (packages: string | string[]) => Promise<void>;
  loadPackagesFromImports: (code: string) => Promise<void>;
  globals: {
    get: (name: string) => unknown;
    set: (name: string, value: unknown) => void;
  };
  setStdout: (options: { batched: (msg: string) => void }) => void;
  setStderr: (options: { batched: (msg: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

/**
 * Load Pyodide from CDN (lazy loading)
 */
async function loadPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (pyodideLoading) {
    return pyodideLoading;
  }

  pyodideLoading = (async () => {
    // Load Pyodide script if not already loaded
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${PYODIDE_CDN}pyodide.js`;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide'));
        document.head.appendChild(script);
      });
    }

    // Initialize Pyodide
    pyodideInstance = await window.loadPyodide!({
      indexURL: PYODIDE_CDN,
    });

    return pyodideInstance;
  })();

  return pyodideLoading;
}

/**
 * Create Python sandbox with restricted builtins
 */
function createPythonSandbox(
  pyodide: PyodideInterface,
  callbacks: SandboxCallbacks,
  outputs: ExecutionOutput[],
): void {
  // Custom stdout handler
  pyodide.setStdout({
    batched: (msg: string) => {
      const output: ExecutionOutput = {
        type: 'log',
        content: sanitizeOutput(msg),
        timestamp: Date.now(),
      };
      outputs.push(output);
      callbacks.onOutput(output);
    },
  });

  // Custom stderr handler
  pyodide.setStderr({
    batched: (msg: string) => {
      const output: ExecutionOutput = {
        type: 'error',
        content: sanitizeOutput(msg),
        timestamp: Date.now(),
      };
      outputs.push(output);
      callbacks.onOutput(output);
    },
  });

  // Set up restricted environment
  pyodide.runPython(`
import sys
import builtins

# Store original builtins
_original_builtins = dict(builtins.__dict__)

# List of allowed builtins
_allowed_builtins = {
    # Core functions
    'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes',
    'callable', 'chr', 'classmethod', 'complex', 'dict', 'dir', 'divmod',
    'enumerate', 'filter', 'float', 'format', 'frozenset', 'getattr',
    'hasattr', 'hash', 'hex', 'id', 'int', 'isinstance', 'issubclass',
    'iter', 'len', 'list', 'map', 'max', 'min', 'next', 'object', 'oct',
    'ord', 'pow', 'print', 'property', 'range', 'repr', 'reversed',
    'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str',
    'sum', 'super', 'tuple', 'type', 'vars', 'zip',

    # Exceptions
    'BaseException', 'Exception', 'ArithmeticError', 'AssertionError',
    'AttributeError', 'BlockingIOError', 'BrokenPipeError', 'BufferError',
    'BytesWarning', 'ChildProcessError', 'ConnectionAbortedError',
    'ConnectionError', 'ConnectionRefusedError', 'ConnectionResetError',
    'DeprecationWarning', 'EOFError', 'EnvironmentError', 'FileExistsError',
    'FileNotFoundError', 'FloatingPointError', 'FutureWarning',
    'GeneratorExit', 'IOError', 'ImportError', 'ImportWarning',
    'IndentationError', 'IndexError', 'InterruptedError', 'IsADirectoryError',
    'KeyError', 'KeyboardInterrupt', 'LookupError', 'MemoryError',
    'ModuleNotFoundError', 'NameError', 'NotADirectoryError',
    'NotImplementedError', 'OSError', 'OverflowError', 'PendingDeprecationWarning',
    'PermissionError', 'ProcessLookupError', 'RecursionError', 'ReferenceError',
    'ResourceWarning', 'RuntimeError', 'RuntimeWarning', 'StopAsyncIteration',
    'StopIteration', 'SyntaxError', 'SyntaxWarning', 'SystemError',
    'SystemExit', 'TabError', 'TimeoutError', 'TypeError', 'UnboundLocalError',
    'UnicodeDecodeError', 'UnicodeEncodeError', 'UnicodeError',
    'UnicodeTranslateError', 'UnicodeWarning', 'UserWarning', 'ValueError',
    'Warning', 'ZeroDivisionError',

    # Constants
    'True', 'False', 'None', 'Ellipsis', 'NotImplemented',

    # Input (disabled for security)
    # 'input',

    # Type functions
    '__build_class__', '__name__', '__doc__',
}

# List of blocked modules
_blocked_modules = {
    'os', 'sys', 'subprocess', 'socket', 'requests', 'urllib',
    'http', 'ftplib', 'telnetlib', 'smtplib', 'poplib', 'imaplib',
    'nntplib', 'ssl', 'asyncio', 'multiprocessing', 'threading',
    'concurrent', '_thread', 'ctypes', 'pickle', 'shelve', 'dbm',
    'sqlite3', 'pathlib', 'shutil', 'tempfile', 'glob', 'fnmatch',
    'linecache', 'tokenize', 'importlib', 'code', 'codeop', 'pdb',
    'profile', 'pstats', 'timeit', 'trace', 'tracemalloc'
}

# Create restricted __import__
_original_import = builtins.__import__

def _restricted_import(name, globals=None, locals=None, fromlist=(), level=0):
    # Check if module is blocked
    base_module = name.split('.')[0]
    if base_module in _blocked_modules:
        raise ImportError(f"Module '{name}' is not allowed in sandbox")

    return _original_import(name, globals, locals, fromlist, level)

builtins.__import__ = _restricted_import

# Block dangerous builtins
for name in list(builtins.__dict__.keys()):
    if name not in _allowed_builtins and not name.startswith('_'):
        if name in ['exec', 'eval', 'compile', 'open', 'input']:
            delattr(builtins, name)

# Create safe print with output limit
_output_count = 0
_max_output = 10000

_original_print = print

def _safe_print(*args, **kwargs):
    global _output_count
    _output_count += 1
    if _output_count > _max_output:
        raise RuntimeError("Maximum output limit exceeded")
    _original_print(*args, **kwargs)

builtins.print = _safe_print

# Create iteration counter for resource limits
_iteration_count = 0
_max_iterations = 1000000

def _check_iteration():
    global _iteration_count
    _iteration_count += 1
    if _iteration_count > _max_iterations:
        raise RuntimeError("Maximum iteration limit exceeded")

# Helper function for users
def help_sandbox():
    """Display available features in the sandbox."""
    print("=== Python Sandbox Help ===")
    print("Available built-in functions: abs, all, any, bin, bool, chr, dict, dir,")
    print("  enumerate, filter, float, format, hash, hex, int, isinstance, iter,")
    print("  len, list, map, max, min, next, oct, ord, pow, print, range, repr,")
    print("  reversed, round, set, slice, sorted, str, sum, tuple, type, zip")
    print("")
    print("Available modules: math, json, random, datetime, collections, itertools,")
    print("  functools, re, string, decimal, fractions, statistics, copy, heapq,")
    print("  bisect, array, operator, numbers")
    print("")
    print("Blocked for security: os, sys, subprocess, socket, file operations")

builtins.help_sandbox = help_sandbox
  `);
}

/**
 * Execute Python code in a secure sandbox
 */
export async function executePython(
  code: string,
  config: ExecutionConfig,
  callbacks: SandboxCallbacks,
): Promise<SandboxController> {
  const outputs: ExecutionOutput[] = [];
  const startTime = Date.now();
  let isRunning = true;
  let timeoutId: NodeJS.Timeout | null = null;

  // Controller for stopping execution
  const controller: SandboxController = {
    stop: () => {
      if (!isRunning) return;
      isRunning = false;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      const output: ExecutionOutput = {
        type: 'system',
        content: '--- Execution stopped by user ---',
        timestamp: Date.now(),
      };
      outputs.push(output);
      callbacks.onOutput(output);
      callbacks.onStatusChange('stopped');
      callbacks.onComplete({
        success: false,
        outputs,
        status: 'stopped',
        executionTime: Date.now() - startTime,
      });
    },
    isRunning: () => isRunning,
  };

  // Sanitize input
  const sanitizedCode = sanitizeInput(code);

  // Validate code
  callbacks.onStatusChange('validating');
  const validation = validateCode(
    sanitizedCode,
    'python',
    config.securityConfig,
  );

  if (!validation.isValid) {
    for (const error of validation.errors) {
      const output: ExecutionOutput = {
        type: 'error',
        content: `Security Error${error.line ? ` (line ${error.line})` : ''}: ${error.message}`,
        timestamp: Date.now(),
      };
      outputs.push(output);
      callbacks.onOutput(output);
    }

    callbacks.onStatusChange('error');
    callbacks.onComplete({
      success: false,
      outputs,
      status: 'error',
      executionTime: Date.now() - startTime,
      error: 'Code validation failed',
    });

    return controller;
  }

  // Show warnings
  for (const warning of validation.warnings) {
    const output: ExecutionOutput = {
      type: 'warn',
      content: `Warning${warning.line ? ` (line ${warning.line})` : ''}: ${warning.message}`,
      timestamp: Date.now(),
    };
    outputs.push(output);
    callbacks.onOutput(output);
  }

  // Check rate limit
  const sessionId = config.sessionId || getOrCreateSessionId();
  const rateLimit = checkRateLimit(sessionId);

  if (rateLimit.isLimited) {
    const output: ExecutionOutput = {
      type: 'error',
      content: `Rate limit exceeded. Please wait ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds.`,
      timestamp: Date.now(),
    };
    outputs.push(output);
    callbacks.onOutput(output);
    callbacks.onStatusChange('error');
    callbacks.onComplete({
      success: false,
      outputs,
      status: 'error',
      executionTime: Date.now() - startTime,
      error: 'Rate limit exceeded',
    });

    return controller;
  }

  // Load Pyodide
  callbacks.onStatusChange('compiling');
  const loadingOutput: ExecutionOutput = {
    type: 'system',
    content:
      'Loading Python runtime (this may take a few seconds on first run)...',
    timestamp: Date.now(),
  };
  outputs.push(loadingOutput);
  callbacks.onOutput(loadingOutput);

  try {
    const pyodide = await loadPyodide();

    if (!isRunning) return controller;

    // Set up sandbox
    createPythonSandbox(pyodide, callbacks, outputs);

    // Load packages from imports
    try {
      await pyodide.loadPackagesFromImports(sanitizedCode);
    } catch {
      // Ignore package loading errors - they'll show up during execution
    }

    if (!isRunning) return controller;

    // Set up timeout
    timeoutId = setTimeout(() => {
      if (!isRunning) return;

      const output: ExecutionOutput = {
        type: 'error',
        content: `--- Execution timed out after ${config.resourceLimits.maxExecutionTime / 1000} seconds ---`,
        timestamp: Date.now(),
      };
      outputs.push(output);
      callbacks.onOutput(output);

      isRunning = false;
      callbacks.onStatusChange('timeout');
      callbacks.onComplete({
        success: false,
        outputs,
        status: 'timeout',
        executionTime: config.resourceLimits.maxExecutionTime,
        error: 'Execution timed out',
      });
    }, config.resourceLimits.maxExecutionTime);

    // Execute code
    callbacks.onStatusChange('executing');

    const readyOutput: ExecutionOutput = {
      type: 'system',
      content: 'Python runtime ready. Executing code...',
      timestamp: Date.now(),
    };
    outputs.push(readyOutput);
    callbacks.onOutput(readyOutput);

    await pyodide.runPythonAsync(sanitizedCode);

    if (!isRunning) return controller;

    // Success
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    isRunning = false;
    callbacks.onStatusChange('completed');
    callbacks.onComplete({
      success: true,
      outputs,
      status: 'completed',
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    if (!isRunning) return controller;

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    isRunning = false;

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Parse Python traceback if present
    const formattedError = formatPythonError(errorMessage);

    const output: ExecutionOutput = {
      type: 'error',
      content: formattedError,
      timestamp: Date.now(),
    };
    outputs.push(output);
    callbacks.onOutput(output);

    callbacks.onStatusChange('error');
    callbacks.onComplete({
      success: false,
      outputs,
      status: 'error',
      executionTime: Date.now() - startTime,
      error: formattedError,
    });
  }

  return controller;
}

/**
 * Format Python error messages for better readability
 */
function formatPythonError(error: string): string {
  // Extract the most relevant part of Python tracebacks
  const lines = error.split('\n');
  const relevantLines: string[] = [];
  let inTraceback = false;

  for (const line of lines) {
    if (line.includes('Traceback (most recent call last)')) {
      inTraceback = true;
      relevantLines.push('Traceback:');
      continue;
    }

    if (inTraceback) {
      // Skip internal Pyodide frames
      if (line.includes('pyodide') || line.includes('<exec>')) {
        continue;
      }

      // Include user code frames and error messages
      if (
        line.startsWith('  File') ||
        line.trim().startsWith('^') ||
        !line.startsWith(' ')
      ) {
        relevantLines.push(line);
      }
    }
  }

  if (relevantLines.length > 0) {
    return relevantLines.join('\n');
  }

  return error;
}

/**
 * Check if Pyodide is available/loaded
 */
export function isPyodideAvailable(): boolean {
  return pyodideInstance !== null;
}

/**
 * Preload Pyodide for faster first execution
 */
export async function preloadPyodide(): Promise<void> {
  try {
    await loadPyodide();
  } catch (error) {
    console.warn('Failed to preload Pyodide:', error);
  }
}
