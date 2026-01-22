import { describe, it, expect } from 'vitest';
import {
  validateCode,
  sanitizeOutput,
  sanitizeInput,
} from '../security-validator';
import { DEFAULT_SECURITY_CONFIG } from '../types';

describe('Security Validator', () => {
  describe('validateCode', () => {
    describe('JavaScript validation', () => {
      it('should allow safe JavaScript code', () => {
        const code = `
          const arr = [1, 2, 3];
          const sum = arr.reduce((a, b) => a + b, 0);
          console.log(sum);
        `;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should block eval() calls', () => {
        const code = `eval("console.log('hello')")`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('eval'))).toBe(
          true,
        );
      });

      it('should block new Function() calls', () => {
        const code = `const fn = new Function("return 1 + 1")`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(
          result.errors.some((e) => e.message.includes('new Function')),
        ).toBe(true);
      });

      it('should block document access', () => {
        const code = `document.getElementById('test')`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('document'))).toBe(
          true,
        );
      });

      it('should block window access', () => {
        const code = `window.location.href = 'http://evil.com'`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('window'))).toBe(
          true,
        );
      });

      it('should block process access', () => {
        const code = `process.env.SECRET`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('process'))).toBe(
          true,
        );
      });

      it('should block require("fs")', () => {
        const code = `const fs = require('fs')`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('fs'))).toBe(true);
      });

      it('should block require("child_process")', () => {
        const code = `const cp = require('child_process')`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(
          result.errors.some((e) => e.message.includes('child_process')),
        ).toBe(true);
      });

      it('should block __proto__ access', () => {
        const code = `obj.__proto__.polluted = true`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('__proto__'))).toBe(
          true,
        );
      });

      it('should block dynamic imports', () => {
        const code = `import('malicious-module')`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(
          result.errors.some((e) => e.message.includes('Dynamic imports')),
        ).toBe(true);
      });

      it('should block Worker creation', () => {
        const code = `const worker = new Worker('worker.js')`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('Worker'))).toBe(
          true,
        );
      });

      it('should block WebSocket when network is disabled', () => {
        const code = `const ws = new WebSocket('ws://evil.com')`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('WebSocket'))).toBe(
          true,
        );
      });

      it('should not block WebSocket when network is enabled', () => {
        const code = `const ws = new WebSocket('ws://example.com')`;
        const config = {
          ...DEFAULT_SECURITY_CONFIG,
          allowNetwork: true,
          blockedGlobals: DEFAULT_SECURITY_CONFIG.blockedGlobals.filter(
            (g) => g !== 'WebSocket',
          ),
        };

        const result = validateCode(code, 'javascript', config);

        // WebSocket-specific security error should not appear if network is allowed
        // and WebSocket is removed from blockedGlobals
        const websocketErrors = result.errors.filter((e) =>
          e.message.toLowerCase().includes('websocket'),
        );
        expect(websocketErrors).toHaveLength(0);
      });

      it('should block fetch when network is disabled', () => {
        const code = `fetch('http://evil.com')`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('fetch'))).toBe(
          true,
        );
      });

      it('should block localStorage access', () => {
        const code = `localStorage.setItem('key', 'value')`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(
          result.errors.some((e) => e.message.includes('localStorage')),
        ).toBe(true);
      });

      it('should detect infinite while loop', () => {
        const code = `while(true) { console.log('infinite'); }`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(
          result.warnings.some((w) => w.message.includes('Infinite loop')),
        ).toBe(true);
      });

      it('should detect infinite for loop', () => {
        const code = `for(;;) { console.log('infinite'); }`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(
          result.warnings.some((w) => w.message.includes('Infinite loop')),
        ).toBe(true);
      });

      it('should allow require("stellar-sdk")', () => {
        const code = `const StellarSdk = require('stellar-sdk')`;

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        // stellar-sdk should not be blocked
        expect(
          result.errors.filter((e) => e.message.includes('stellar-sdk')),
        ).toHaveLength(0);
      });

      it('should reject empty code', () => {
        const result = validateCode('', 'javascript', DEFAULT_SECURITY_CONFIG);

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('empty'))).toBe(
          true,
        );
      });

      it('should reject code exceeding max length', () => {
        const code = 'a'.repeat(100001);

        const result = validateCode(
          code,
          'javascript',
          DEFAULT_SECURITY_CONFIG,
        );

        expect(result.isValid).toBe(false);
        expect(
          result.errors.some((e) => e.message.includes('maximum length')),
        ).toBe(true);
      });
    });

    describe('Python validation', () => {
      it('should allow safe Python code', () => {
        const code = `
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum: {total}")
        `;

        const result = validateCode(code, 'python', DEFAULT_SECURITY_CONFIG);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should block exec() calls', () => {
        const code = `exec("print('hello')")`;

        const result = validateCode(code, 'python', DEFAULT_SECURITY_CONFIG);

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('exec'))).toBe(
          true,
        );
      });

      it('should block compile() calls', () => {
        const code = `compile("print(1)", "", "exec")`;

        const result = validateCode(code, 'python', DEFAULT_SECURITY_CONFIG);

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('compile'))).toBe(
          true,
        );
      });

      it('should block __import__ calls', () => {
        const code = `__import__('os')`;

        const result = validateCode(code, 'python', DEFAULT_SECURITY_CONFIG);

        expect(result.isValid).toBe(false);
        expect(
          result.errors.some((e) => e.message.includes('__import__')),
        ).toBe(true);
      });

      it('should block open() calls', () => {
        const code = `f = open('/etc/passwd', 'r')`;

        const result = validateCode(code, 'python', DEFAULT_SECURITY_CONFIG);

        expect(result.isValid).toBe(false);
        expect(
          result.errors.some(
            (e) => e.message.includes('open') || e.message.includes('File'),
          ),
        ).toBe(true);
      });

      it('should block import os', () => {
        const code = `import os`;

        const result = validateCode(code, 'python', DEFAULT_SECURITY_CONFIG);

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('os'))).toBe(true);
      });

      it('should block import subprocess', () => {
        const code = `import subprocess`;

        const result = validateCode(code, 'python', DEFAULT_SECURITY_CONFIG);

        expect(result.isValid).toBe(false);
        expect(
          result.errors.some((e) => e.message.includes('subprocess')),
        ).toBe(true);
      });

      it('should block from os import', () => {
        const code = `from os import system`;

        const result = validateCode(code, 'python', DEFAULT_SECURITY_CONFIG);

        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('os'))).toBe(true);
      });

      it('should allow safe imports like math', () => {
        const code = `
import math
print(math.sqrt(16))
        `;

        const result = validateCode(code, 'python', DEFAULT_SECURITY_CONFIG);

        // math should not trigger security errors
        expect(
          result.errors.filter((e) => e.message.includes('math')),
        ).toHaveLength(0);
      });
    });
  });

  describe('sanitizeOutput', () => {
    it('should escape HTML entities', () => {
      const output = '<script>alert("xss")</script>';

      const sanitized = sanitizeOutput(output);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    it('should remove ANSI escape codes', () => {
      const output = '\x1b[31mRed text\x1b[0m';

      const sanitized = sanitizeOutput(output);

      expect(sanitized).not.toContain('\x1b');
      expect(sanitized).toContain('Red text');
    });

    it('should truncate very long output', () => {
      const output = 'a'.repeat(150000);

      const sanitized = sanitizeOutput(output);

      expect(sanitized.length).toBeLessThan(110000);
      expect(sanitized).toContain('truncated');
    });

    it('should handle normal output unchanged (except escaping)', () => {
      const output = 'Hello, World!';

      const sanitized = sanitizeOutput(output);

      expect(sanitized).toBe('Hello, World!');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove null bytes', () => {
      const input = 'hello\0world';

      const sanitized = sanitizeInput(input);

      expect(sanitized).not.toContain('\0');
      expect(sanitized).toBe('helloworld');
    });

    it('should normalize line endings', () => {
      const input = 'line1\r\nline2\rline3\nline4';

      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe('line1\nline2\nline3\nline4');
      expect(sanitized).not.toContain('\r');
    });

    it('should handle normal input unchanged', () => {
      const input = 'const x = 1;\nconst y = 2;';

      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe(input);
    });
  });
});
