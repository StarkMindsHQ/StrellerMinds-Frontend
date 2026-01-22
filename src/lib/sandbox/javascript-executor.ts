/**
 * JavaScript/TypeScript Executor for Secure Sandbox
 *
 * Uses Web Workers for isolation with enhanced security measures.
 * Provides mocked Stellar SDK for blockchain education.
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

/**
 * Create the Stellar SDK mock code for the sandbox
 */
function createStellarMock(): string {
  return `
    // Mock Stellar SDK for educational purposes
    const StellarSdk = {
      Server: function(url) {
        console.log('Connected to Stellar server at: ' + url);
        return {
          loadAccount: async function(publicKey) {
            console.log('Loading account: ' + publicKey);
            await new Promise(resolve => setTimeout(resolve, 300));
            return {
              balances: [
                { asset_type: 'native', balance: '10000.0000000' },
                { asset_type: 'credit_alphanum4', asset_code: 'USDC', asset_issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5', balance: '500.0000000' }
              ],
              sequence: '103719435298817',
              accountId: function() { return publicKey; }
            };
          },
          submitTransaction: async function(tx) {
            console.log('Submitting transaction...');
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('Transaction submitted successfully');
            return {
              hash: '3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889',
              ledger: 12345678
            };
          },
          fetchBaseFee: async function() {
            return 100;
          }
        };
      },
      Keypair: {
        random: function() {
          const publicKey = 'G' + Array.from({length: 55}, () =>
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
          ).join('');
          const secret = 'S' + Array.from({length: 55}, () =>
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
          ).join('');
          return {
            publicKey: function() { return publicKey; },
            secret: function() { return secret; },
            sign: function(data) { return 'signature_' + Math.random().toString(36).slice(2); }
          };
        },
        fromSecret: function(secret) {
          console.log('Creating keypair from secret key: ' + secret.substring(0, 5) + '...');
          return {
            publicKey: function() { return 'GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD'; },
            sign: function(data) { return 'signature_' + Math.random().toString(36).slice(2); }
          };
        },
        fromPublicKey: function(publicKey) {
          return {
            publicKey: function() { return publicKey; }
          };
        }
      },
      Asset: {
        native: function() { return { type: 'native', code: 'XLM', issuer: null }; },
        new: function(code, issuer) {
          console.log('Creating asset: ' + code);
          return { code, issuer, type: code.length <= 4 ? 'credit_alphanum4' : 'credit_alphanum12' };
        }
      },
      Operation: {
        payment: function(opts) {
          console.log('Creating payment operation to: ' + opts.destination);
          return { type: 'payment', ...opts };
        },
        changeTrust: function(opts) {
          console.log('Creating changeTrust operation for asset: ' + (opts.asset.code || 'native'));
          return { type: 'changeTrust', ...opts };
        },
        createAccount: function(opts) {
          console.log('Creating account operation: ' + opts.destination);
          return { type: 'createAccount', ...opts };
        },
        setOptions: function(opts) {
          console.log('Creating setOptions operation');
          return { type: 'setOptions', ...opts };
        },
        manageData: function(opts) {
          console.log('Creating manageData operation: ' + opts.name);
          return { type: 'manageData', ...opts };
        },
        manageBuyOffer: function(opts) {
          console.log('Creating manageBuyOffer operation');
          return { type: 'manageBuyOffer', ...opts };
        },
        manageSellOffer: function(opts) {
          console.log('Creating manageSellOffer operation');
          return { type: 'manageSellOffer', ...opts };
        }
      },
      TransactionBuilder: function(sourceAccount, options) {
        const operations = [];
        console.log('Creating transaction builder');
        return {
          addOperation: function(operation) {
            operations.push(operation);
            console.log('Added operation: ' + operation.type);
            return this;
          },
          setTimeout: function(timeout) {
            console.log('Setting timeout: ' + timeout + 's');
            return this;
          },
          setNetworkPassphrase: function(passphrase) {
            return this;
          },
          addMemo: function(memo) {
            console.log('Added memo: ' + (memo.value || memo));
            return this;
          },
          build: function() {
            console.log('Building transaction with ' + operations.length + ' operation(s)');
            return {
              operations: operations,
              sign: function(keypair) {
                console.log('Transaction signed');
                return this;
              },
              toXDR: function() {
                return 'AAAAAgAAAABl' + Math.random().toString(36).slice(2, 10) + 'AAAA==';
              },
              toEnvelope: function() {
                return { toXDR: () => this.toXDR() };
              }
            };
          }
        };
      },
      Networks: {
        TESTNET: 'Test SDF Network ; September 2015',
        PUBLIC: 'Public Global Stellar Network ; September 2015'
      },
      BASE_FEE: '100',
      Memo: {
        text: function(text) { return { type: 'text', value: text }; },
        id: function(id) { return { type: 'id', value: id }; },
        hash: function(hash) { return { type: 'hash', value: hash }; },
        none: function() { return { type: 'none' }; }
      },
      StrKey: {
        isValidEd25519PublicKey: function(key) {
          return typeof key === 'string' && key.length === 56 && key.startsWith('G');
        },
        isValidEd25519SecretSeed: function(seed) {
          return typeof seed === 'string' && seed.length === 56 && seed.startsWith('S');
        }
      }
    };

    // Support both require and direct access
    function require(module) {
      if (module === 'stellar-sdk' || module === '@stellar/stellar-sdk') {
        return StellarSdk;
      }
      throw new Error('Module "' + module + '" is not available in sandbox. Only stellar-sdk is supported.');
    }
  `;
}

/**
 * Create the worker script with all safety measures
 */
function createWorkerScript(config: ExecutionConfig): string {
  const stellarMock = config.enableStellarMock ? createStellarMock() : '';

  return `
    // === Secure Sandbox Worker ===

    // State tracking
    let isRunning = true;
    let startTime = null;
    const maxTime = ${config.resourceLimits.maxExecutionTime};
    const maxIterations = ${config.resourceLimits.maxIterations};
    let iterationCount = 0;
    let outputSize = 0;
    const maxOutputSize = ${config.resourceLimits.maxOutputSize};
    const activeTimeouts = [];
    const activeIntervals = [];
    let asyncOperationCount = 0;

    // Time check
    function checkTime() {
      if (!isRunning) throw new Error('Execution stopped');
      if (startTime && Date.now() - startTime > maxTime) {
        throw new Error('Execution time limit exceeded (' + (maxTime / 1000) + ' seconds)');
      }
    }

    // Iteration tracking
    function trackIteration() {
      iterationCount++;
      if (iterationCount > maxIterations) {
        throw new Error('Maximum iteration limit exceeded');
      }
      checkTime();
    }

    // Output size tracking
    function trackOutput(msg) {
      const str = String(msg);
      outputSize += str.length;
      if (outputSize > maxOutputSize) {
        throw new Error('Maximum output size exceeded');
      }
      return str;
    }

    // Clean up all async operations
    function cleanup() {
      isRunning = false;
      activeTimeouts.forEach(id => clearTimeout(id));
      activeIntervals.forEach(id => clearInterval(id));
      activeTimeouts.length = 0;
      activeIntervals.length = 0;
    }

    // Override setTimeout
    const _setTimeout = self.setTimeout;
    self.setTimeout = function(callback, delay, ...args) {
      if (!isRunning) return -1;
      checkTime();
      asyncOperationCount++;

      const id = _setTimeout(function() {
        const idx = activeTimeouts.indexOf(id);
        if (idx > -1) activeTimeouts.splice(idx, 1);
        asyncOperationCount--;

        if (!isRunning) return;

        try {
          checkTime();
          callback(...args);
        } catch (e) {
          self.postMessage({ type: 'error', data: e.message });
        }

        // Check if done
        if (asyncOperationCount <= 0 && activeIntervals.length === 0) {
          self.postMessage({ type: 'done' });
        }
      }, Math.min(delay || 0, maxTime));

      activeTimeouts.push(id);
      return id;
    };

    // Override setInterval
    const _setInterval = self.setInterval;
    self.setInterval = function(callback, delay, ...args) {
      if (!isRunning) return -1;
      checkTime();

      const id = _setInterval(function() {
        if (!isRunning) {
          clearInterval(id);
          return;
        }
        try {
          checkTime();
          trackIteration();
          callback(...args);
        } catch (e) {
          self.postMessage({ type: 'error', data: e.message });
          clearInterval(id);
        }
      }, Math.max(delay || 10, 10));

      activeIntervals.push(id);
      return id;
    };

    // Override clearTimeout/clearInterval
    const _clearTimeout = self.clearTimeout;
    self.clearTimeout = function(id) {
      const idx = activeTimeouts.indexOf(id);
      if (idx > -1) activeTimeouts.splice(idx, 1);
      asyncOperationCount--;
      return _clearTimeout(id);
    };

    const _clearInterval = self.clearInterval;
    self.clearInterval = function(id) {
      const idx = activeIntervals.indexOf(id);
      if (idx > -1) activeIntervals.splice(idx, 1);
      return _clearInterval(id);
    };

    // Message handler
    self.onmessage = function(e) {
      const { code, action } = e.data;

      if (action === 'stop') {
        cleanup();
        self.postMessage({ type: 'stopped' });
        self.close();
        return;
      }

      startTime = Date.now();
      asyncOperationCount = 0;

      // Create safe console
      const console = {
        log: function(...args) {
          if (!isRunning) return;
          checkTime();
          const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'log', data: trackOutput(message) });
        },
        error: function(...args) {
          if (!isRunning) return;
          const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'error', data: trackOutput(message) });
        },
        warn: function(...args) {
          if (!isRunning) return;
          const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'warn', data: trackOutput(message) });
        },
        info: function(...args) {
          if (!isRunning) return;
          const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'info', data: trackOutput(message) });
        },
        debug: function(...args) {
          if (!isRunning) return;
          const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'log', data: '[DEBUG] ' + trackOutput(message) });
        },
        table: function(data) {
          console.log(data);
        },
        clear: function() {
          self.postMessage({ type: 'system', data: '--- Console cleared ---' });
        },
        time: function() {},
        timeEnd: function() {}
      };

      ${stellarMock}

      try {
        // Wrap user code to handle async/await at top level
        const wrappedCode = \`
          (async () => {
            try {
              \${code}
            } catch (e) {
              console.error('Runtime error: ' + e.message);
            }
          })().then(() => {
            // Check if truly done (no pending async ops)
            if (activeTimeouts.length === 0 && activeIntervals.length === 0) {
              self.postMessage({ type: 'done' });
            }
          }).catch(e => {
            console.error('Async error: ' + e.message);
            self.postMessage({ type: 'done' });
          });
        \`;

        // Create and execute function
        const executeFn = new Function(
          'console',
          'setTimeout',
          'setInterval',
          'clearTimeout',
          'clearInterval',
          'require',
          'StellarSdk',
          'checkTime',
          'trackIteration',
          wrappedCode
        );

        executeFn(
          console,
          self.setTimeout,
          self.setInterval,
          self.clearTimeout,
          self.clearInterval,
          typeof require !== 'undefined' ? require : undefined,
          typeof StellarSdk !== 'undefined' ? StellarSdk : undefined,
          checkTime,
          trackIteration
        );

      } catch (error) {
        self.postMessage({ type: 'error', data: 'Execution error: ' + error.message });
        self.postMessage({ type: 'done' });
      }
    };

    // Global error handler
    self.onerror = function(event) {
      self.postMessage({ type: 'error', data: 'Runtime error: ' + (event.message || 'Unknown error') });
      self.postMessage({ type: 'done' });
    };

    // Unhandled rejection handler
    self.onunhandledrejection = function(event) {
      self.postMessage({ type: 'error', data: 'Unhandled promise rejection: ' + (event.reason?.message || event.reason || 'Unknown') });
    };
  `;
}

/**
 * Execute JavaScript/TypeScript code in a secure sandbox
 */
export async function executeJavaScript(
  code: string,
  config: ExecutionConfig,
  callbacks: SandboxCallbacks,
): Promise<SandboxController> {
  const outputs: ExecutionOutput[] = [];
  const startTime = Date.now();

  // Sanitize input
  const sanitizedCode = sanitizeInput(code);

  // Validate code
  callbacks.onStatusChange('validating');
  const validation = validateCode(
    sanitizedCode,
    config.language,
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

    return { stop: () => {}, isRunning: () => false };
  }

  // Show warnings but continue
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

    return { stop: () => {}, isRunning: () => false };
  }

  // Create worker
  callbacks.onStatusChange('executing');
  const workerScript = createWorkerScript(config);
  const blob = new Blob([workerScript], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  const worker = new Worker(workerUrl);

  let isRunning = true;
  let timeoutId: NodeJS.Timeout | null = null;

  // Stop function
  const stop = () => {
    if (!isRunning) return;
    isRunning = false;

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    worker.postMessage({ action: 'stop' });

    // Force terminate after a short delay
    setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    }, 100);

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
  };

  // Controller
  const controller: SandboxController = {
    stop,
    isRunning: () => isRunning,
  };

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
    worker.terminate();
    URL.revokeObjectURL(workerUrl);

    callbacks.onStatusChange('timeout');
    callbacks.onComplete({
      success: false,
      outputs,
      status: 'timeout',
      executionTime: config.resourceLimits.maxExecutionTime,
      error: 'Execution timed out',
    });
  }, config.resourceLimits.maxExecutionTime + 1000); // Extra second for cleanup

  // Message handler
  worker.onmessage = (e) => {
    if (!isRunning) return;

    const { type, data } = e.data;

    if (type === 'done' || type === 'stopped') {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      isRunning = false;
      worker.terminate();
      URL.revokeObjectURL(workerUrl);

      callbacks.onStatusChange('completed');
      callbacks.onComplete({
        success: true,
        outputs,
        status: 'completed',
        executionTime: Date.now() - startTime,
      });
      return;
    }

    const outputType = type as OutputType;
    const output: ExecutionOutput = {
      type: outputType,
      content: sanitizeOutput(data),
      timestamp: Date.now(),
    };
    outputs.push(output);
    callbacks.onOutput(output);
  };

  // Error handler
  worker.onerror = (error) => {
    if (!isRunning) return;

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    isRunning = false;

    const output: ExecutionOutput = {
      type: 'error',
      content: `Worker error: ${error.message || 'Unknown error'}`,
      timestamp: Date.now(),
    };
    outputs.push(output);
    callbacks.onOutput(output);

    worker.terminate();
    URL.revokeObjectURL(workerUrl);

    callbacks.onStatusChange('error');
    callbacks.onComplete({
      success: false,
      outputs,
      status: 'error',
      executionTime: Date.now() - startTime,
      error: error.message,
    });
  };

  // Start execution
  worker.postMessage({ code: sanitizedCode });

  return controller;
}

type OutputType = 'log' | 'error' | 'warn' | 'info' | 'result' | 'system';
