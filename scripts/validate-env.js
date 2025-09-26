#!/usr/bin/env node

/**
 * Environment Validation Script
 *
 * This script validates environment variables without starting the full application.
 * Useful for CI/CD pipelines and development setup verification.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

console.log('🔍 Validating environment configuration...\n');

// Check for .env file
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('📝 Please create a .env file by copying .env.example:');
  console.log('   cp .env.example .env');
  console.log('   Then edit .env with your actual values.\n');
  process.exit(1);
}

// Check for .env.example file
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found!');
  console.log('📝 Please ensure .env.example exists in the project root.\n');
  process.exit(1);
}

console.log('✅ .env file found');
console.log('✅ .env.example file found');

// Load environment variables
dotenv.config({ path: envPath });

// Validate required variables
const requiredVars = [
  'NODE_ENV',
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_API_BASE_URL',
];

// Check for placeholder values in optional but important variables
const importantOptionalVars = [
  'NEXTAUTH_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
];

const placeholderVars = importantOptionalVars.filter((varName) => {
  const value = process.env[varName];
  return value && (value.includes('your-') || value.includes('placeholder'));
});

if (placeholderVars.length > 0) {
  console.warn(
    '⚠️  Warning: The following variables appear to contain placeholder values:',
  );
  placeholderVars.forEach((varName) => {
    console.warn(`   - ${varName}: ${process.env[varName]}`);
  });
  console.log(
    '📝 These should be set to real values for production deployment.\n',
  );
}

const missingVars = requiredVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.log('\n📝 Please set these variables in your .env file.\n');
  process.exit(1);
}

console.log('✅ All required environment variables are set');

// Validate URL formats
const urlVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_COINGECKO_API_URL',
];

const invalidUrls = urlVars.filter((varName) => {
  const value = process.env[varName];
  if (!value) return false;
  try {
    new URL(value);
    return false;
  } catch {
    return true;
  }
});

if (invalidUrls.length > 0) {
  console.error('❌ Invalid URL format in environment variables:');
  invalidUrls.forEach((varName) => {
    console.error(`   - ${varName}: ${process.env[varName]}`);
  });
  console.log('\n📝 Please ensure all URL variables are valid URLs.\n');
  process.exit(1);
}

console.log('✅ All URL environment variables are valid');

// Validate NODE_ENV
const validEnvs = ['development', 'production', 'test'];
if (!validEnvs.includes(process.env.NODE_ENV)) {
  console.error(`❌ Invalid NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`📝 NODE_ENV must be one of: ${validEnvs.join(', ')}\n`);
  process.exit(1);
}

console.log('✅ NODE_ENV is valid');

// Validate Stellar network
const validNetworks = ['testnet', 'mainnet'];
if (
  process.env.NEXT_PUBLIC_STELLAR_NETWORK &&
  !validNetworks.includes(process.env.NEXT_PUBLIC_STELLAR_NETWORK)
) {
  console.error(
    `❌ Invalid NEXT_PUBLIC_STELLAR_NETWORK: ${process.env.NEXT_PUBLIC_STELLAR_NETWORK}`,
  );
  console.log(
    `📝 NEXT_PUBLIC_STELLAR_NETWORK must be one of: ${validNetworks.join(', ')}\n`,
  );
  process.exit(1);
}

console.log('✅ Stellar network configuration is valid');

console.log('\n🎉 Environment validation completed successfully!');
console.log('🚀 You can now start the development server with: npm run dev\n');
