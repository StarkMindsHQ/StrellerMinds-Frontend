/**
 * Security Validator for Code Execution Sandbox
 *
 * Performs static analysis to detect potentially dangerous code patterns
 * before execution. This is the first line of defense in our security model.
 */

import type {
  SecurityConfig,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SupportedLanguage,
} from './types';

// Dangerous patterns that should be blocked
const DANGEROUS_PATTERNS = [
  // Code execution
  {
    pattern: /\beval\s*\(/,
    message: 'eval() is not allowed for security reasons',
  },
  {
    pattern: /\bnew\s+Function\s*\(/,
    message: 'new Function() is not allowed for security reasons',
  },

  // DOM manipulation (should not be accessible anyway, but double-check)
  {
    pattern: /\bdocument\s*\./,
    message: 'document access is not allowed in sandbox',
  },
  {
    pattern: /\bwindow\s*\./,
    message: 'window access is not allowed in sandbox',
  },

  // Process/system access
  {
    pattern: /\bprocess\s*\./,
    message: 'process access is not allowed in sandbox',
  },
  {
    pattern: /\brequire\s*\(\s*['"`]child_process/,
    message: 'child_process module is blocked',
  },
  { pattern: /\brequire\s*\(\s*['"`]fs/, message: 'fs module is blocked' },
  { pattern: /\brequire\s*\(\s*['"`]os/, message: 'os module is blocked' },
  { pattern: /\brequire\s*\(\s*['"`]net/, message: 'net module is blocked' },
  {
    pattern: /\brequire\s*\(\s*['"`]http/,
    message: 'http/https modules are blocked',
  },

  // Prototype pollution
  { pattern: /__proto__/, message: '__proto__ access is not allowed' },
  {
    pattern: /\bconstructor\s*\[\s*['"`]prototype/,
    message: 'Prototype manipulation is not allowed',
  },
  {
    pattern: /Object\s*\.\s*setPrototypeOf/,
    message: 'setPrototypeOf is not allowed',
  },

  // Import/export in ways that could bypass sandbox
  { pattern: /\bimport\s*\(/, message: 'Dynamic imports are not allowed' },
  { pattern: /\bimportScripts\s*\(/, message: 'importScripts is not allowed' },

  // Worker creation
  {
    pattern: /\bnew\s+Worker\s*\(/,
    message: 'Creating Workers is not allowed in sandbox',
  },
  {
    pattern: /\bnew\s+SharedWorker\s*\(/,
    message: 'Creating SharedWorkers is not allowed',
  },

  // WebSocket and network (when network is disabled)
  {
    pattern: /\bnew\s+WebSocket\s*\(/,
    message: 'WebSocket is not allowed in sandbox',
    requiresNetworkDisabled: true,
  },
  {
    pattern: /\bfetch\s*\(/,
    message: 'fetch is not allowed in sandbox',
    requiresNetworkDisabled: true,
  },
  {
    pattern: /\bnew\s+XMLHttpRequest/,
    message: 'XMLHttpRequest is not allowed in sandbox',
    requiresNetworkDisabled: true,
  },

  // Storage access
  {
    pattern: /\blocalStorage\s*\./,
    message: 'localStorage access is not allowed',
  },
  {
    pattern: /\bsessionStorage\s*\./,
    message: 'sessionStorage access is not allowed',
  },
  { pattern: /\bindexedDB\s*\./, message: 'indexedDB access is not allowed' },
];

// Patterns that might indicate performance issues
const PERFORMANCE_PATTERNS = [
  {
    pattern: /while\s*\(\s*true\s*\)/,
    message: 'Infinite loop detected (while(true))',
  },
  {
    pattern: /for\s*\(\s*;\s*;\s*\)/,
    message: 'Infinite loop detected (for(;;))',
  },
  {
    pattern: /\.repeat\s*\(\s*\d{6,}/,
    message: 'Very large string repetition detected',
  },
  {
    pattern: /Array\s*\(\s*\d{8,}/,
    message: 'Very large array allocation detected',
  },
];

// Python-specific dangerous patterns
const PYTHON_DANGEROUS_PATTERNS = [
  { pattern: /\bexec\s*\(/, message: 'exec() is restricted in sandbox' },
  { pattern: /\bcompile\s*\(/, message: 'compile() is restricted in sandbox' },
  {
    pattern: /\b__import__\s*\(/,
    message: '__import__() is restricted in sandbox',
  },
  {
    pattern: /\bopen\s*\(/,
    message: 'File operations are restricted in sandbox',
  },
  { pattern: /\bimport\s+os\b/, message: 'os module is blocked' },
  { pattern: /\bimport\s+sys\b/, message: 'sys module is blocked' },
  {
    pattern: /\bimport\s+subprocess\b/,
    message: 'subprocess module is blocked',
  },
  { pattern: /\bfrom\s+os\s+import/, message: 'os module is blocked' },
  { pattern: /\bimport\s+socket\b/, message: 'socket module is blocked' },
];

interface DangerousPattern {
  pattern: RegExp;
  message: string;
  requiresNetworkDisabled?: boolean;
}

/**
 * Validates code for security issues before execution
 */
export function validateCode(
  code: string,
  language: SupportedLanguage,
  config: SecurityConfig,
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check for empty code
  if (!code || code.trim().length === 0) {
    errors.push({
      type: 'syntax',
      message: 'Code cannot be empty',
    });
    return { isValid: false, errors, warnings };
  }

  // Check code length (prevent extremely large code submissions)
  const MAX_CODE_LENGTH = 100000; // 100KB
  if (code.length > MAX_CODE_LENGTH) {
    errors.push({
      type: 'resource',
      message: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`,
    });
    return { isValid: false, errors, warnings };
  }

  // Get patterns based on language
  const patterns: DangerousPattern[] =
    language === 'python'
      ? [...DANGEROUS_PATTERNS, ...PYTHON_DANGEROUS_PATTERNS]
      : DANGEROUS_PATTERNS;

  // Check for dangerous patterns
  for (const { pattern, message, requiresNetworkDisabled } of patterns) {
    // Skip network-related checks if network is allowed
    if (requiresNetworkDisabled && config.allowNetwork) {
      continue;
    }

    const match = code.match(pattern);
    if (match) {
      const lineNumber = getLineNumber(code, match.index || 0);
      errors.push({
        type: 'security',
        message,
        line: lineNumber,
      });
    }
  }

  // Check for performance issues
  for (const { pattern, message } of PERFORMANCE_PATTERNS) {
    const match = code.match(pattern);
    if (match) {
      const lineNumber = getLineNumber(code, match.index || 0);
      warnings.push({
        type: 'performance',
        message,
        line: lineNumber,
      });
    }
  }

  // Check for blocked globals being accessed
  for (const global of config.blockedGlobals) {
    const globalPattern = new RegExp(`\\b${escapeRegExp(global)}\\b`);
    if (globalPattern.test(code)) {
      // Check if it's actually an access, not just a string
      const accessPattern = new RegExp(
        `(?<!['"\`])\\b${escapeRegExp(global)}\\s*[.\\[(]`,
      );
      if (accessPattern.test(code)) {
        errors.push({
          type: 'security',
          message: `Access to '${global}' is not allowed in sandbox`,
        });
      }
    }
  }

  // Language-specific syntax checks
  if (language === 'javascript' || language === 'typescript') {
    validateJavaScriptSyntax(code, errors, warnings);
  } else if (language === 'python') {
    validatePythonSyntax(code, errors, warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Basic JavaScript/TypeScript syntax validation
 */
function validateJavaScriptSyntax(
  code: string,
  errors: ValidationError[],
  warnings: ValidationWarning[],
): void {
  // Check for unbalanced brackets
  const brackets: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
  const stack: string[] = [];
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let inMultilineComment = false;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const nextChar = code[i + 1];
    const prevChar = code[i - 1];

    // Handle comments
    if (!inString) {
      if (char === '/' && nextChar === '/' && !inMultilineComment) {
        inComment = true;
        continue;
      }
      if (char === '/' && nextChar === '*' && !inComment) {
        inMultilineComment = true;
        i++;
        continue;
      }
      if (char === '*' && nextChar === '/' && inMultilineComment) {
        inMultilineComment = false;
        i++;
        continue;
      }
      if (char === '\n' && inComment) {
        inComment = false;
        continue;
      }
    }

    if (inComment || inMultilineComment) continue;

    // Handle strings
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (inString && char === stringChar) {
        inString = false;
      } else if (!inString) {
        inString = true;
        stringChar = char;
      }
      continue;
    }

    if (inString) continue;

    // Check brackets
    if (brackets[char]) {
      stack.push(brackets[char]);
    } else if (Object.values(brackets).includes(char)) {
      if (stack.length === 0 || stack.pop() !== char) {
        warnings.push({
          type: 'style',
          message: `Unbalanced bracket: '${char}'`,
          line: getLineNumber(code, i),
        });
      }
    }
  }

  if (stack.length > 0) {
    warnings.push({
      type: 'style',
      message: `Unclosed brackets: ${stack.join(', ')}`,
    });
  }
}

/**
 * Basic Python syntax validation
 */
function validatePythonSyntax(
  code: string,
  _errors: ValidationError[],
  warnings: ValidationWarning[],
): void {
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) {
      continue;
    }

    // Check for tabs mixed with spaces (common Python issue)
    if (line.includes('\t') && line.includes(' ') && line.match(/^[\t ]+/)) {
      warnings.push({
        type: 'style',
        message: 'Mixed tabs and spaces in indentation',
        line: i + 1,
      });
    }

    // Check for colon at end of control structures
    if (
      /^(if|elif|else|for|while|def|class|try|except|finally|with|async)\b/.test(
        trimmedLine,
      ) &&
      !trimmedLine.endsWith(':') &&
      !trimmedLine.includes(':')
    ) {
      warnings.push({
        type: 'style',
        message: 'Control structure might be missing a colon',
        line: i + 1,
      });
    }
  }
}

/**
 * Sanitize output to prevent XSS and other injection attacks
 */
export function sanitizeOutput(output: string): string {
  // Remove ANSI escape codes
  let sanitized = output.replace(/\x1b\[[0-9;]*m/g, '');

  // Limit output length
  const MAX_OUTPUT_LENGTH = 100000;
  if (sanitized.length > MAX_OUTPUT_LENGTH) {
    sanitized =
      sanitized.substring(0, MAX_OUTPUT_LENGTH) + '\n... (output truncated)';
  }

  // Escape HTML entities for safe display
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return sanitized;
}

/**
 * Sanitize code input to remove potentially harmful characters
 */
export function sanitizeInput(code: string): string {
  // Remove null bytes
  let sanitized = code.replace(/\0/g, '');

  // Normalize line endings
  sanitized = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  return sanitized;
}

// Helper functions
function getLineNumber(code: string, index: number): number {
  return code.substring(0, index).split('\n').length;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
