import { env, envUtils } from './env';

export const logger = {
  log: (...args: unknown[]) => {
    if (envUtils.isDevelopment() || env.LOG_LEVEL === 'debug') {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (
      envUtils.isDevelopment() ||
      ['debug', 'info', 'warn'].includes(env.LOG_LEVEL)
    ) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },

  error: (...args: unknown[]) => {
    // Always log errors regardless of environment
    // eslint-disable-next-line no-console
    console.error(...args);
  },

  debug: (...args: unknown[]) => {
    if (env.LOG_LEVEL === 'debug') {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (['debug', 'info'].includes(env.LOG_LEVEL)) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },
};
