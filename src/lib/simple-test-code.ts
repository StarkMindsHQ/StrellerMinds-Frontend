export const simpleTestCode = `
// Simple test to verify the code execution works
console.log("Hello from Stellar Playground!");
console.log("Testing basic functionality...");

// Test a simple calculation
const a = 5;
const b = 10;
console.log(\`Simple calculation: \${a} + \${b} = \${a + b}\`);

// Test the mock Stellar SDK
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
console.log("Created Stellar server connection");

// Test keypair generation
const keypair = StellarSdk.Keypair.random();
console.log("Generated random keypair");
console.log("Public key:", keypair.publicKey());

// Test async/await with promises
console.log("Testing async/await with promises...");

async function testAsync() {
  console.log("Starting async test");
  
  // Create a simple delay function
  function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(\`Waited for \${ms}ms\`), ms));
  }
  
  // Test with a 1 second delay
  const result = await delay(1000);
  console.log("Async result:", result);
  
  console.log("Async test completed");
}

// Run the async test
testAsync().then(() => {
  console.log("All tests completed successfully!");
});
`;
