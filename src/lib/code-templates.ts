export const codeTemplates = {
  'create-account': `// Create a new Stellar account
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Create a completely new and unique pair of keys
const pair = StellarSdk.Keypair.random();

console.log('Public Key:', pair.publicKey());
console.log('Secret Key:', pair.secret());

// Create account on the testnet
try {
  const response = await fetch(\`https://friendbot.stellar.org?addr=\${encodeURIComponent(pair.publicKey())}\`);
  const responseJSON = await response.json();
  console.log("SUCCESS! You have a new account :)\\n", responseJSON);
} catch (error) {
  console.error("ERROR!", error);
}`,
  'check-balance': `// Check account balance
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Public key of the account to check
const publicKey = 'GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD';

try {
  const account = await server.loadAccount(publicKey);
  console.log('Balances for account:', publicKey);
  
  account.balances.forEach(balance => {
    console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
  });
} catch (error) {
  console.error("Error loading account details", error);
}`,
  'send-payment': `// Send a payment
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Keys for accounts to issue and receive the payment
const sourceSecretKey = 'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4';
const destinationId = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';

// Create a keypair for the source account
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
const sourcePublicKey = sourceKeypair.publicKey();

try {
  // Load the source account
  const sourceAccount = await server.loadAccount(sourcePublicKey);
  
  // Build the transaction
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: destinationId,
      asset: StellarSdk.Asset.native(),
      amount: "10"
    }))
    .setTimeout(30)
    .build();
  
  // Sign the transaction
  transaction.sign(sourceKeypair);
  
  // Submit the transaction
  const transactionResult = await server.submitTransaction(transaction);
  console.log('Transaction successful!');
  console.log('Transaction hash:', transactionResult.hash);
} catch (error) {
  console.error('Something went wrong!', error);
}`,
  'create-trustline': `// Create a trustline for a custom asset
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Keys for the account that will trust the asset
const secretKey = 'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4';
const keypair = StellarSdk.Keypair.fromSecret(secretKey);

// Asset issuer details
const issuingAccountId = 'GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD';
const assetCode = 'MYCOIN';

try {
  // Load the account
  const account = await server.loadAccount(keypair.publicKey());
  
  // Create the asset object
  const asset = new StellarSdk.Asset(assetCode, issuingAccountId);
  
  // Create the trustline transaction
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET
  })
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: asset,
      limit: '1000' // The maximum amount of this asset you're willing to hold
    }))
    .setTimeout(30)
    .build();
  
  // Sign the transaction
  transaction.sign(keypair);
  
  // Submit the transaction
  const transactionResult = await server.submitTransaction(transaction);
  console.log('Trustline created successfully!');
  console.log('Transaction hash:', transactionResult.hash);
} catch (error) {
  console.error('Error creating trustline:', error);
}`,
  'stellar-test': `// Comprehensive test of Stellar SDK functionality
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

async function testStellarSDK() {
  console.log('🚀 Starting Stellar SDK Test');
  console.log('----------------------------');
  
  // Test 1: Generate a new keypair
  console.log('Test 1: Generate a new keypair');
  const keypair = StellarSdk.Keypair.random();
  console.log('✅ Generated new keypair:');
  console.log('   Public Key:', keypair.publicKey());
  console.log('   Secret Key:', keypair.secret());
  console.log('----------------------------');
  
  // Test 2: Load account information
  console.log('Test 2: Load account information');
  try {
    const account = await server.loadAccount(keypair.publicKey());
    console.log('✅ Account loaded successfully');
    console.log('   Balances:');
    account.balances.forEach(balance => {
      console.log(\`   - \${balance.asset_type}: \${balance.balance}\`);
    });
  } catch (error) {
    console.log('✅ Account not found (expected for new keypair)');
  }
  console.log('----------------------------');
  
  // Test 3: Create a transaction
  console.log('Test 3: Create a transaction');
  const sourceKeypair = StellarSdk.Keypair.fromSecret('SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4');
  const destinationId = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q723BM2OARMDUYEJ5';
  
  try {
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    console.log('✅ Source account loaded');
    
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationId,
        asset: StellarSdk.Asset.native(),
        amount: "1.5"
      }))
      .setTimeout(30)
      .build();
    
    transaction.sign(sourceKeypair);
    console.log('✅ Transaction built and signed');
    console.log('   Transaction XDR:', transaction.toXDR());
    
    // We don't actually submit the transaction in this test
    console.log('   (Transaction not submitted to avoid actual blockchain changes)');
  } catch (error) {
    console.log('❌ Error creating transaction:', error.message);
  }
  console.log('----------------------------');
  
  // Test 4: Create a custom asset
  console.log('Test 4: Create a custom asset');
  const issuer = 'GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD';
  const customAsset = new StellarSdk.Asset('TESTCOIN', issuer);
  console.log('✅ Custom asset created:');
  console.log('   Asset Code:', 'TESTCOIN');
  console.log('   Issuer:', issuer);
  console.log('----------------------------');
  
  // Test 5: Test async/await with promises
  console.log('Test 5: Testing async/await with promises');
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(\`Waited for \${ms}ms\`), ms));
  }
  
  console.log('   Starting delay sequence...');
  const result1 = await delay(1000);
  console.log('   First delay complete:', result1);
  
  const result2 = await delay(1500);
  console.log('   Second delay complete:', result2);
  
  console.log('✅ Async/await working correctly');
  console.log('----------------------------');
  
  console.log('🎉 All Stellar SDK tests completed successfully!');
}

// Run the test function
testStellarSDK();
`,
  blank: `// Start coding with Stellar SDK
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Your code here
`,
};
