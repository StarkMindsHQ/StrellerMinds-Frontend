import { env, envUtils } from './env';

export const logger = {
  log: (...args: unknown[]) => {
    if (envUtils.isDevelopment() || env.LOG_LEVEL === 'debug') {
      console.log(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (
      envUtils.isDevelopment() ||
      ['debug', 'info', 'warn'].includes(env.LOG_LEVEL)
    ) {
      console.warn(...args);
    }
  },

  error: (...args: unknown[]) => {
    // Always log errors regardless of environment
    console.error(...args);
  },

  debug: (...args: unknown[]) => {
    if (env.LOG_LEVEL === 'debug') {
      console.debug(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (['debug', 'info'].includes(env.LOG_LEVEL)) {
      console.info(...args);
    }
  },
};
