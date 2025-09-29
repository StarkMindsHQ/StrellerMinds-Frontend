export async function executeCode(
  code: string,
  logCallback: (log: string) => void,
): Promise<{ stop: () => void }> {
  // Create a simpler worker script with better error handling
  const workerScript = `
    // Set up communication channel
    let activeTimeouts = [];
    let isRunning = true;
    let isRunningAsync = false;
    
    self.onmessage = function(e) {
      const { code, action } = e.data;
      
      if (action === 'stop') {
        isRunning = false;
        // Clear all active timeouts
        activeTimeouts.forEach(id => clearTimeout(id));
        activeTimeouts = [];
        self.close();
        return;
      }
      
      // Create mock console
      const mockConsole = {
        log: function() {
          if (!isRunning) return;
          const args = Array.from(arguments);
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'log', data: message });
        },
        error: function() {
          if (!isRunning) return;
          const args = Array.from(arguments);
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          self.postMessage({ type: 'error', data: message });
        }
      };
      
      // Override setTimeout to track active timeouts
      self.originalSetTimeout = self.setTimeout;
      self.setTimeout = function(callback, delay, ...args) {
        if (!isRunning) return;
        const timeoutId = self.originalSetTimeout(function() {
          if (isRunning) {
            callback(...args);
          }
          // Remove from active timeouts
          const index = activeTimeouts.indexOf(timeoutId);
          if (index > -1) {
            activeTimeouts.splice(index, 1);
          }
          
          // If no more timeouts and not running async code, signal completion
          if (activeTimeouts.length === 0 && !isRunningAsync) {
            self.postMessage({ type: 'done' });
          }
        }, delay);
        
        activeTimeouts.push(timeoutId);
        return timeoutId;
      };
      
      try {
        // Create function with mocked environment
        const executeFunction = new Function('console', 'setTimeout', \`
          try {
            // Track if we're running async code
            let asyncOperationCount = 0;
            
            // Override Promise to track async operations
            const OriginalPromise = Promise;
            Promise = class extends OriginalPromise {
              constructor(executor) {
                asyncOperationCount++;
                self.postMessage({ type: 'log', data: 'Starting async operation' });
                
                super((resolve, reject) => {
                  executor(
                    (value) => {
                      asyncOperationCount--;
                      if (asyncOperationCount === 0) {
                        setTimeout(() => {
                          if (asyncOperationCount === 0) {
                            self.postMessage({ type: 'done' });
                          }
                        }, 0);
                      }
                      resolve(value);
                    },
                    (reason) => {
                      asyncOperationCount--;
                      if (asyncOperationCount === 0) {
                        setTimeout(() => {
                          if (asyncOperationCount === 0) {
                            self.postMessage({ type: 'done' });
                          }
                        }, 0);
                      }
                      reject(reason);
                    }
                  );
                });
              }
            };
            
            // Mock Stellar SDK - using a variable that won't conflict with user code
            const _stellarSdkMock = {
              Server: function(url) {
                console.log('Connected to Stellar server at: ' + url);
                return {
                  loadAccount: async function(publicKey) {
                    console.log('Loading account: ' + publicKey);
                    await new Promise(resolve => setTimeout(resolve, 500));
                    return {
                      balances: [
                        { asset_type: 'native', balance: '10000.0000000' },
                        { asset_type: 'credit_alphanum4', asset_code: 'USDC', asset_issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5', balance: '500.0000000' }
                      ],
                      sequence: '103719435298817'
                    };
                  },
                  submitTransaction: async function() {
                    console.log('Submitting transaction...');
                    await new Promise(resolve => setTimeout(resolve, 800));
                    console.log('Transaction submitted successfully');
                    return { hash: '3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889' };
                  }
                };
              },
              Keypair: {
                random: function() {
                  return {
                    publicKey: function() { return 'GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD'; },
                    secret: function() { return 'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4'; }
                  };
                },
                fromSecret: function(secret) {
                  console.log('Creating keypair from secret key: ' + secret.substring(0, 5) + '...');
                  return {
                    publicKey: function() { return 'GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD'; }
                  };
                }
              },
              Asset: {
                native: function() { return { type: 'native' }; },
                new: function(code, issuer) { 
                  console.log('Creating asset: ' + code);
                  return { code, issuer, type: 'credit_alphanum4' }; 
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
                }
              },
              TransactionBuilder: function(sourceAccount) {
                console.log('Creating transaction for account: ' + sourceAccount.sequence);
                return {
                  addOperation: function(operation) { 
                    console.log('Added operation: ' + operation.type);
                    return this; 
                  },
                  setTimeout: function(timeout) { 
                    console.log('Setting timeout: ' + timeout);
                    return this; 
                  },
                  build: function() { 
                    console.log('Building transaction');
                    return { 
                      sign: function(keypair) { 
                        console.log('Transaction signed'); 
                        return this;
                      },
                      toXDR: function() {
                        return 'AAAAAGXNhB2hIkbP8iEuiTOyy/hqe4UOiL9k2qxo4ejKQsfdAAAAZAAADXYAAAABAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAAO2C/AO45YBD3tHVFO1R3A0MekP8JR6nN1A9eWidyItUAAAABVVNEQwAAAACrp94ozBzWY/puR0sMTkbX+7XdD8+kcPxT4YxUuQhbZQAAAAAdzWUAAAAAAAAAAAE=';
                      }
                    }; 
                  }
                };
              },
              Networks: {
                TESTNET: 'Test SDF Network ; September 2015',
                PUBLIC: 'Public Global Stellar Network ; September 2015'
              },
              BASE_FEE: '100'
            };
            
            // Handle require statements for StellarSdk
            function require(module) {
              if (module === 'stellar-sdk') {
                return _stellarSdkMock;
              }
              throw new Error('Module ' + module + ' not found');
            }
            
            // Execute the user code
            ${code}
          } catch (error) {
            console.error('Execution error: ' + error.message);
          }
        \`);
        
        // Execute with mocked console and setTimeout
        executeFunction(mockConsole, self.setTimeout);
        
        // If no async operations were started, signal completion
        if (activeTimeouts.length === 0) {
          self.postMessage({ type: 'done' });
        }
      } catch (error) {
        self.postMessage({ type: 'error', data: 'Worker error: ' + error.message });
        self.postMessage({ type: 'done' });
      }
    };
    
    // Handle errors
    self.onerror = function(event) {
      self.postMessage({ type: 'error', data: 'Worker error: ' + event.message });
      self.postMessage({ type: 'done' });
    };
  `;

  // Create a blob from the worker script
  const blob = new Blob([workerScript], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);

  // Create the worker
  const worker = new Worker(workerUrl);

  // Function to stop execution
  const stop = () => {
    worker.postMessage({ action: 'stop' });
    worker.terminate();
    URL.revokeObjectURL(workerUrl);
  };

  return new Promise((resolve) => {
    // Set up message handler
    worker.onmessage = (e) => {
      if (e.data.type === 'log') {
        logCallback(e.data.data);
      } else if (e.data.type === 'error') {
        logCallback('ERROR: ' + e.data.data);
      } else if (e.data.type === 'done') {
        // Clean up
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      }
    };

    // Set up error handler
    worker.onerror = (error) => {
      logCallback(`ERROR: Worker initialization failed: ${error.message}`);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };

    // Start the worker with the code
    worker.postMessage({ code });

    // Resolve immediately with the stop function
    resolve({ stop });
  });
}
