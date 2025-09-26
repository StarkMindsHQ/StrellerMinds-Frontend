import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock environment variables for testing
const originalEnv = process.env;

describe('Environment Validation', () => {
  beforeEach(() => {
    // Reset environment variables
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  it('should validate with default values', () => {
    // Clear all environment variables to test defaults
    process.env = {};

    // This should not throw an error as all variables have defaults
    expect(() => {
      // Re-import to trigger validation
      delete require.cache[require.resolve('../env')];
      require('../env');
    }).not.toThrow();
  });

  it('should validate required environment variables', () => {
    // Set valid environment variables
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_APP_NAME = 'Test App';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

    expect(() => {
      delete require.cache[require.resolve('../env')];
      require('../env');
    }).not.toThrow();
  });

  it('should throw error for invalid NODE_ENV', () => {
    process.env.NODE_ENV = 'invalid';

    expect(() => {
      delete require.cache[require.resolve('../env')];
      require('../env');
    }).toThrow();
  });

  it('should throw error for invalid URL', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'not-a-valid-url';

    expect(() => {
      delete require.cache[require.resolve('../env')];
      require('../env');
    }).toThrow();
  });

  it('should validate Stellar network values', () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = 'mainnet';

    expect(() => {
      delete require.cache[require.resolve('../env')];
      require('../env');
    }).not.toThrow();
  });

  it('should throw error for invalid Stellar network', () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = 'invalid-network';

    expect(() => {
      delete require.cache[require.resolve('../env')];
      require('../env');
    }).toThrow();
  });
});
