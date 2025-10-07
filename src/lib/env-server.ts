import { validateEnvironment } from './env';

/**
 * Server-side environment validation
 * This should be called early in the server startup process
 */
export function validateServerEnvironment(): void {
  try {
    validateEnvironment();
    // Server environment validated successfully
  } catch (error) {
    // Server environment validation failed
    if (error instanceof Error) {
      throw new Error(`Server environment validation failed: ${error.message}`);
    }
    throw new Error('Server environment validation failed');
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
