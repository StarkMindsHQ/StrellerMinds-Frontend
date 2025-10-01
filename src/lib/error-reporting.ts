// @ts-expect-error - Sentry types may not be available in all environments
import * as Sentry from '@sentry/nextjs';
import { logger } from './logger';

export interface ErrorContext {
  userId?: string;
  userEmail?: string;
  feature?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorSeverity {
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  tags?: Record<string, string>;
  fingerprint?: string[];
}

export class ErrorReporter {
  private static instance: ErrorReporter;
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  private initialize() {
    if (this.isInitialized) return;

    // Set up global error handlers
    if (typeof window !== 'undefined') {
      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.captureException(event.reason, {
          feature: 'unhandled-promise-rejection',
          metadata: {
            promise: event.promise?.toString(),
            type: 'unhandledrejection',
          },
        });
      });

      // Global JavaScript errors
      window.addEventListener('error', (event) => {
        this.captureException(event.error || new Error(event.message), {
          feature: 'global-error',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            type: 'error',
          },
        });
      });
    }

    this.isInitialized = true;
    logger.info('ErrorReporter initialized');
  }

  /**
   * Capture an exception with context
   */
  public captureException(
    error: Error | string,
    context?: ErrorContext,
    severity?: ErrorSeverity,
  ): string {
    const errorObject = typeof error === 'string' ? new Error(error) : error;
    const eventId = Sentry.captureException(errorObject, (scope: any) => {
      // Set context
      if (context) {
        if (context.userId) {
          scope.setUser({ id: context.userId, email: context.userEmail });
        }

        if (context.feature) {
          scope.setTag('feature', context.feature);
        }

        if (context.component) {
          scope.setTag('component', context.component);
        }

        if (context.action) {
          scope.setTag('action', context.action);
        }

        if (context.metadata) {
          scope.setContext('metadata', context.metadata);
        }
      }

      // Set severity
      if (severity) {
        scope.setLevel(severity.level);

        if (severity.tags) {
          Object.entries(severity.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        if (severity.fingerprint) {
          scope.setFingerprint(severity.fingerprint);
        }
      }

      // Add breadcrumb
      scope.addBreadcrumb({
        message: `Error captured: ${errorObject.message}`,
        level: 'error',
        category: 'error',
        data: {
          errorName: errorObject.name,
          ...context?.metadata,
        },
      });
    });

    logger.error('Exception captured:', {
      error: errorObject.message,
      context,
      eventId,
    });

    return eventId;
  }

  /**
   * Capture a message (non-error events)
   */
  public captureMessage(
    message: string,
    context?: ErrorContext,
    severity?: ErrorSeverity,
  ): string {
    const level = severity?.level || 'info';
    const eventId = Sentry.captureMessage(message, level, (scope: any) => {
      // Set context
      if (context) {
        if (context.userId) {
          scope.setUser({ id: context.userId, email: context.userEmail });
        }

        if (context.feature) {
          scope.setTag('feature', context.feature);
        }

        if (context.component) {
          scope.setTag('component', context.component);
        }

        if (context.action) {
          scope.setTag('action', context.action);
        }

        if (context.metadata) {
          scope.setContext('metadata', context.metadata);
        }
      }

      // Set severity
      if (severity) {
        if (severity.tags) {
          Object.entries(severity.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        if (severity.fingerprint) {
          scope.setFingerprint(severity.fingerprint);
        }
      }
    });

    logger.info('Message captured:', {
      message,
      context,
      eventId,
    });

    return eventId;
  }

  /**
   * Add breadcrumb for debugging
   */
  public addBreadcrumb(
    message: string,
    category: string = 'custom',
    data?: Record<string, any>,
  ): void {
    Sentry.addBreadcrumb({
      message,
      category,
      level: 'info',
      data,
    });
  }

  /**
   * Set user context
   */
  public setUser(user: {
    id?: string;
    email?: string;
    username?: string;
  }): void {
    Sentry.setUser(user);
    logger.info('User context set:', {
      userId: user.id,
      userEmail: user.email,
    });
  }

  /**
   * Clear user context
   */
  public clearUser(): void {
    Sentry.setUser(null);
    logger.info('User context cleared');
  }

  /**
   * Set tags for filtering
   */
  public setTags(tags: Record<string, string>): void {
    Sentry.setTags(tags);
    logger.info('Tags set:', tags);
  }

  /**
   * Set context data
   */
  public setContext(key: string, context: Record<string, any>): void {
    Sentry.setContext(key, context);
    logger.info('Context set:', { key, context });
  }

  /**
   * Capture performance transaction
   */
  public startTransaction(
    name: string,
    op: string = 'custom',
  ): Sentry.Transaction {
    return Sentry.startTransaction({ name, op });
  }

  /**
   * Create a span for performance monitoring
   */
  public startSpan<T>(
    options: { name: string; op?: string; data?: Record<string, any> },
    callback: (span: Sentry.Span) => T,
  ): T {
    return Sentry.startSpan(options, callback);
  }

  /**
   * Report network errors with retry logic
   */
  public reportNetworkError(
    error: Error,
    url: string,
    retryCount: number = 0,
    context?: ErrorContext,
  ): string {
    return this.captureException(
      error,
      {
        ...context,
        feature: 'network',
        metadata: {
          url,
          retryCount,
          timestamp: new Date().toISOString(),
          userAgent:
            typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        },
      },
      {
        level: 'error',
        tags: {
          errorType: 'network',
          retryCount: retryCount.toString(),
        },
      },
    );
  }

  /**
   * Report form validation errors
   */
  public reportValidationError(
    field: string,
    value: any,
    rule: string,
    context?: ErrorContext,
  ): string {
    return this.captureMessage(
      `Validation failed: ${field}`,
      {
        ...context,
        feature: 'validation',
        metadata: {
          field,
          value: typeof value === 'object' ? JSON.stringify(value) : value,
          rule,
          timestamp: new Date().toISOString(),
        },
      },
      {
        level: 'warning',
        tags: {
          errorType: 'validation',
          field,
          rule,
        },
      },
    );
  }

  /**
   * Report API errors
   */
  public reportApiError(
    error: Error,
    endpoint: string,
    method: string,
    statusCode?: number,
    context?: ErrorContext,
  ): string {
    return this.captureException(
      error,
      {
        ...context,
        feature: 'api',
        metadata: {
          endpoint,
          method,
          statusCode,
          timestamp: new Date().toISOString(),
        },
      },
      {
        level: 'error',
        tags: {
          errorType: 'api',
          endpoint,
          method,
          statusCode: statusCode?.toString() || 'unknown',
        },
      },
    );
  }

  /**
   * Report component errors
   */
  public reportComponentError(
    error: Error,
    componentName: string,
    props?: Record<string, any>,
    context?: ErrorContext,
  ): string {
    return this.captureException(
      error,
      {
        ...context,
        component: componentName,
        feature: 'component',
        metadata: {
          componentName,
          props: props ? JSON.stringify(props) : undefined,
          timestamp: new Date().toISOString(),
        },
      },
      {
        level: 'error',
        tags: {
          errorType: 'component',
          component: componentName,
        },
      },
    );
  }
}

// Export singleton instance
export const errorReporter = ErrorReporter.getInstance();

// Export convenience functions
export const reportError = (
  error: Error | string,
  context?: ErrorContext,
  severity?: ErrorSeverity,
) => errorReporter.captureException(error, context, severity);

export const reportMessage = (
  message: string,
  context?: ErrorContext,
  severity?: ErrorSeverity,
) => errorReporter.captureMessage(message, context, severity);

export const reportNetworkError = (
  error: Error,
  url: string,
  retryCount?: number,
  context?: ErrorContext,
) => errorReporter.reportNetworkError(error, url, retryCount, context);

export const reportValidationError = (
  field: string,
  value: any,
  rule: string,
  context?: ErrorContext,
) => errorReporter.reportValidationError(field, value, rule, context);

export const reportApiError = (
  error: Error,
  endpoint: string,
  method: string,
  statusCode?: number,
  context?: ErrorContext,
) => errorReporter.reportApiError(error, endpoint, method, statusCode, context);

export const reportComponentError = (
  error: Error,
  componentName: string,
  props?: Record<string, any>,
  context?: ErrorContext,
) => errorReporter.reportComponentError(error, componentName, props, context);

export const setUserContext = (user: {
  id?: string;
  email?: string;
  username?: string;
}) => errorReporter.setUser(user);

export const clearUserContext = () => errorReporter.clearUser();

export const addBreadcrumb = (
  message: string,
  category?: string,
  data?: Record<string, any>,
) => errorReporter.addBreadcrumb(message, category, data);

export default errorReporter;
