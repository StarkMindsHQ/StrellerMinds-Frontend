import { validateEnvironment } from './env';

/**
 * Server-side environment validation
 * This should be called early in the server startup process
 */
export function validateServerEnvironment(): void {
  try {
    validateEnvironment();
    console.log('🚀 Server environment validated successfully');
  } catch (error) {
    console.error('❌ Server environment validation failed:');
    console.error(error);
    process.exit(1);
  }
}

/**
 * Initialize server environment validation
 * Call this at the top of your server entry points
 */
export function initializeServerEnvironment(): void {
  // Validate environment variables on server startup
  validateServerEnvironment();
}
