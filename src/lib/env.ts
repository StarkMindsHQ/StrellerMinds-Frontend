import { z } from 'zod';

/**
 * Environment validation schema using Zod
 * This ensures all required environment variables are present and valid at startup
 */
const envSchema = z.object({
  // Application Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Application Configuration
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('StrellerMinds'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1).default('0.1.0'),

  // API Configuration
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default('http://localhost:3000/api'),
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().positive().default(10000),

  // External Services
  NEXT_PUBLIC_COINGECKO_API_URL: z
    .string()
    .url()
    .default('https://api.coingecko.com/api/v3'),

  // Authentication & Security
  NEXTAUTH_SECRET: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      if (val.includes('your-') || val.includes('placeholder')) {
        return false; // Reject placeholder values
      }
      return val.length >= 32; // Must be at least 32 characters if provided
    }, 'NEXTAUTH_SECRET must be at least 32 characters long and cannot be a placeholder value'),
  NEXTAUTH_URL: z.string().url().optional(),

  // OAuth Providers (Optional)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Stellar Network Configuration
  NEXT_PUBLIC_STELLAR_NETWORK: z
    .enum(['testnet', 'mainnet'])
    .default('testnet'),
  NEXT_PUBLIC_STELLAR_HORIZON_URL: z
    .string()
    .url()
    .default('https://horizon-testnet.stellar.org'),

  // Database (Optional)
  DATABASE_URL: z.string().url().optional(),

  // Email Configuration (Optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().positive().optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),

  // Analytics (Optional)
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  NEXT_PUBLIC_ENABLE_DEBUG_MODE: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_CODE_PLAYGROUND: z.coerce.boolean().default(true),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

/**
 * Validated environment variables
 * This will throw an error at startup if any required variables are missing or invalid
 */
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
  NEXT_PUBLIC_COINGECKO_API_URL: process.env.NEXT_PUBLIC_COINGECKO_API_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  NEXT_PUBLIC_STELLAR_NETWORK: process.env.NEXT_PUBLIC_STELLAR_NETWORK,
  NEXT_PUBLIC_STELLAR_HORIZON_URL: process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
  NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  NEXT_PUBLIC_ENABLE_DEBUG_MODE: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE,
  NEXT_PUBLIC_ENABLE_CODE_PLAYGROUND:
    process.env.NEXT_PUBLIC_ENABLE_CODE_PLAYGROUND,
  LOG_LEVEL: process.env.LOG_LEVEL,
});

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Environment validation utility functions
 */
export const envUtils = {
  /**
   * Check if running in development mode
   */
  isDevelopment: () => env.NODE_ENV === 'development',

  /**
   * Check if running in production mode
   */
  isProduction: () => env.NODE_ENV === 'production',

  /**
   * Check if running in test mode
   */
  isTest: () => env.NODE_ENV === 'test',

  /**
   * Check if analytics is enabled
   */
  isAnalyticsEnabled: () => env.NEXT_PUBLIC_ENABLE_ANALYTICS,

  /**
   * Check if debug mode is enabled
   */
  isDebugMode: () => env.NEXT_PUBLIC_ENABLE_DEBUG_MODE,

  /**
   * Check if code playground is enabled
   */
  isCodePlaygroundEnabled: () => env.NEXT_PUBLIC_ENABLE_CODE_PLAYGROUND,

  /**
   * Get the current environment name
   */
  getEnvironment: () => env.NODE_ENV,

  /**
   * Get the app URL
   */
  getAppUrl: () => env.NEXT_PUBLIC_APP_URL,

  /**
   * Get the API base URL
   */
  getApiBaseUrl: () => env.NEXT_PUBLIC_API_BASE_URL,

  /**
   * Get the Stellar network configuration
   */
  getStellarConfig: () => ({
    network: env.NEXT_PUBLIC_STELLAR_NETWORK,
    horizonUrl: env.NEXT_PUBLIC_STELLAR_HORIZON_URL,
  }),
};

/**
 * Validate environment variables and log configuration on startup
 */
export function validateEnvironment(): void {
  try {
    // Environment is already validated when imported, but we can add additional checks here
    // Environment variables validated successfully
    // Environment: ${env.NODE_ENV}
    // App URL: ${env.NEXT_PUBLIC_APP_URL}
    // API Base URL: ${env.NEXT_PUBLIC_API_BASE_URL}
    // Stellar Network: ${env.NEXT_PUBLIC_STELLAR_NETWORK}
    // Debug Mode: ${env.NEXT_PUBLIC_ENABLE_DEBUG_MODE ? 'Enabled' : 'Disabled'}
    // Analytics: ${env.NEXT_PUBLIC_ENABLE_ANALYTICS ? 'Enabled' : 'Disabled'}
    // Code Playground: ${env.NEXT_PUBLIC_ENABLE_CODE_PLAYGROUND ? 'Enabled' : 'Disabled'}
  } catch (error) {
    // Environment validation failed
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Missing or invalid environment variables: ${errorMessages.join(', ')}`);
    } else {
      throw error;
    }
  }
}
