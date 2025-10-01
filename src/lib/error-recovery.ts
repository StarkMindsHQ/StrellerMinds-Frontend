import { reportError } from './error-reporting';
import { logger } from './logger';

export interface RecoveryAction {
  type: 'retry' | 'redirect' | 'reset' | 'fallback' | 'notify';
  payload?: unknown;
  label: string;
  description?: string;
}

export interface ErrorRecoveryConfig {
  maxRetries?: number;
  retryDelay?: number;
  fallbackUrl?: string;
  notifyUser?: boolean;
  customActions?: RecoveryAction[];
}

export class ErrorRecoveryManager {
  private static instance: ErrorRecoveryManager;
  private retryCounts: Map<string, number> = new Map();
  private recoveryStrategies: Map<string, (error: Error) => RecoveryAction[]> =
    new Map();

  private constructor() {
    this.initializeDefaultStrategies();
  }

  public static getInstance(): ErrorRecoveryManager {
    if (!ErrorRecoveryManager.instance) {
      ErrorRecoveryManager.instance = new ErrorRecoveryManager();
    }
    return ErrorRecoveryManager.instance;
  }

  private initializeDefaultStrategies() {
    // Network Error Recovery
    this.recoveryStrategies.set('network', (_error: Error) => [
      {
        type: 'retry',
        label: 'Retry Connection',
        description: 'Try connecting again',
      },
      {
        type: 'redirect',
        payload: '/offline',
        label: 'Go Offline',
        description: 'Switch to offline mode',
      },
      {
        type: 'notify',
        payload:
          'Network connection lost. Please check your internet connection.',
        label: 'Show Network Status',
        description: 'Display network status information',
      },
    ]);

    // Authentication Error Recovery
    this.recoveryStrategies.set('auth', (_error: Error) => [
      {
        type: 'redirect',
        payload: '/login',
        label: 'Sign In',
        description: 'Redirect to login page',
      },
      {
        type: 'reset',
        payload: 'auth',
        label: 'Reset Session',
        description: 'Clear authentication data',
      },
    ]);

    // API Error Recovery
    this.recoveryStrategies.set('api', (_error: Error) => [
      {
        type: 'retry',
        label: 'Retry Request',
        description: 'Try the request again',
      },
      {
        type: 'fallback',
        payload: '/error',
        label: 'Use Fallback',
        description: 'Switch to fallback data',
      },
      {
        type: 'redirect',
        payload: '/contact',
        label: 'Contact Support',
        description: 'Report the issue to support',
      },
    ]);

    // Component Error Recovery
    this.recoveryStrategies.set('component', (_error: Error) => [
      {
        type: 'reset',
        payload: 'component',
        label: 'Reload Component',
        description: 'Reset component state',
      },
      {
        type: 'redirect',
        payload: '/',
        label: 'Go Home',
        description: 'Return to homepage',
      },
    ]);

    // Code Execution Error Recovery
    this.recoveryStrategies.set('code-execution', (_error: Error) => [
      {
        type: 'reset',
        payload: 'editor',
        label: 'Reset Editor',
        description: 'Clear editor and start fresh',
      },
      {
        type: 'fallback',
        payload: 'template',
        label: 'Load Template',
        description: 'Load a working template',
      },
      {
        type: 'redirect',
        payload: '/code-playground',
        label: 'New Playground',
        description: 'Open a new playground',
      },
    ]);

    // Storage Error Recovery
    this.recoveryStrategies.set('storage', (_error: Error) => [
      {
        type: 'retry',
        label: 'Retry Storage',
        description: 'Try saving again',
      },
      {
        type: 'reset',
        payload: 'storage',
        label: 'Clear Storage',
        description: 'Clear local storage',
      },
      {
        type: 'notify',
        payload: 'Storage is full. Please clear some data.',
        label: 'Storage Warning',
        description: 'Notify about storage issues',
      },
    ]);
  }

  /**
   * Get recovery actions for a specific error type
   */
  public getRecoveryActions(error: Error, context?: string): RecoveryAction[] {
    const errorType = this.classifyError(error);
    const strategy = this.recoveryStrategies.get(errorType);

    if (!strategy) {
      return this.getGenericRecoveryActions();
    }

    const actions = strategy(error);

    // Add context-specific actions
    if (context) {
      actions.push({
        type: 'notify',
        payload: `Error in ${context}. Our team has been notified.`,
        label: 'Report Issue',
        description: 'Report this issue to our support team',
      });
    }

    return actions;
  }

  /**
   * Classify error type based on error message and properties
   */
  private classifyError(error: Error): string {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    // Network errors
    if (
      name.includes('network') ||
      name.includes('fetch') ||
      message.includes('network') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('offline')
    ) {
      return 'network';
    }

    // Authentication errors
    if (
      name.includes('auth') ||
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('token') ||
      message.includes('session')
    ) {
      return 'auth';
    }

    // API errors
    if (
      name.includes('api') ||
      message.includes('api') ||
      message.includes('endpoint') ||
      message.includes('server error') ||
      message.includes('bad request')
    ) {
      return 'api';
    }

    // Component errors
    if (
      name.includes('component') ||
      name.includes('render') ||
      message.includes('component') ||
      message.includes('jsx')
    ) {
      return 'component';
    }

    // Code execution errors
    if (
      name.includes('syntax') ||
      name.includes('execution') ||
      message.includes('syntax') ||
      message.includes('runtime') ||
      message.includes('compile')
    ) {
      return 'code-execution';
    }

    // Storage errors
    if (
      name.includes('storage') ||
      message.includes('storage') ||
      message.includes('localstorage') ||
      message.includes('quota')
    ) {
      return 'storage';
    }

    return 'generic';
  }

  /**
   * Get generic recovery actions for unknown error types
   */
  private getGenericRecoveryActions(): RecoveryAction[] {
    return [
      {
        type: 'retry',
        label: 'Try Again',
        description: 'Attempt the operation again',
      },
      {
        type: 'redirect',
        payload: '/',
        label: 'Go Home',
        description: 'Return to the homepage',
      },
      {
        type: 'redirect',
        payload: '/contact',
        label: 'Contact Support',
        description: 'Get help from our support team',
      },
    ];
  }

  /**
   * Execute a recovery action
   */
  public async executeRecoveryAction(
    action: RecoveryAction,
    context?: string,
  ): Promise<boolean> {
    try {
      switch (action.type) {
        case 'retry':
          return await this.handleRetry(context);

        case 'redirect':
          return await this.handleRedirect(action.payload);

        case 'reset':
          return await this.handleReset(action.payload, context);

        case 'fallback':
          return await this.handleFallback(action.payload);

        case 'notify':
          return await this.handleNotify(action.payload);

        default:
          logger.warn('Unknown recovery action type:', action.type);
          return false;
      }
    } catch (recoveryError) {
      logger.error('Recovery action failed:', recoveryError);
      reportError(recoveryError, {
        feature: 'error-recovery',
        action: action.type,
      });
      return false;
    }
  }

  private async handleRetry(context?: string): Promise<boolean> {
    const key = context || 'default';
    const currentCount = this.retryCounts.get(key) || 0;
    const maxRetries = 3;

    if (currentCount >= maxRetries) {
      logger.warn(`Max retries exceeded for context: ${context}`);
      return false;
    }

    this.retryCounts.set(key, currentCount + 1);

    // Wait before retrying (exponential backoff)
    const delay = Math.min(1000 * Math.pow(2, currentCount), 5000);
    await new Promise((resolve) => setTimeout(resolve, delay));

    logger.info(`Retry attempt ${currentCount + 1} for context: ${context}`);
    return true;
  }

  private async handleRedirect(url: string): Promise<boolean> {
    if (typeof window !== 'undefined') {
      window.location.href = url;
      return true;
    }
    return false;
  }

  private async handleReset(
    target: string,
    _context?: string,
  ): Promise<boolean> {
    try {
      switch (target) {
        case 'auth':
          // Clear authentication data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
            sessionStorage.removeItem('auth-token');
            localStorage.removeItem('user-data');
          }
          break;

        case 'storage':
          // Clear local storage
          if (typeof window !== 'undefined') {
            localStorage.clear();
          }
          break;

        case 'component':
          // Reset component state (this would be handled by the component)
          logger.info('Component reset requested');
          break;

        case 'editor':
          // Reset code editor
          logger.info('Code editor reset requested');
          break;

        default:
          logger.warn('Unknown reset target:', target);
          return false;
      }

      logger.info(`Reset completed for target: ${target}`);
      return true;
    } catch (error) {
      logger.error('Reset failed:', error);
      return false;
    }
  }

  private async handleFallback(url: string): Promise<boolean> {
    if (typeof window !== 'undefined') {
      // Try to load fallback content or redirect
      try {
        window.location.href = url;
        return true;
      } catch (error) {
        logger.error('Fallback redirect failed:', error);
        return false;
      }
    }
    return false;
  }

  private async handleNotify(message: string): Promise<boolean> {
    try {
      // This would integrate with your notification system
      if (typeof window !== 'undefined') {
        // You could use toast notifications, modals, etc.
        // console.log('Notification:', message);

        // Example with a simple alert (replace with your notification system)
        if (process.env.NODE_ENV === 'development') {
          alert(message);
        }
      }
      return true;
    } catch (error) {
      logger.error('Notification failed:', error);
      return false;
    }
  }

  /**
   * Reset retry counts for a specific context
   */
  public resetRetryCount(context?: string): void {
    if (context) {
      this.retryCounts.delete(context);
    } else {
      this.retryCounts.clear();
    }
  }

  /**
   * Add custom recovery strategy
   */
  public addRecoveryStrategy(
    errorType: string,
    strategy: (error: Error) => RecoveryAction[],
  ): void {
    this.recoveryStrategies.set(errorType, strategy);
  }

  /**
   * Get retry count for a context
   */
  public getRetryCount(context?: string): number {
    return this.retryCounts.get(context || 'default') || 0;
  }
}

// Export singleton instance
export const errorRecovery = ErrorRecoveryManager.getInstance();

// Export convenience functions
export const getRecoveryActions = (error: Error, context?: string) =>
  errorRecovery.getRecoveryActions(error, context);

export const executeRecoveryAction = (
  action: RecoveryAction,
  context?: string,
) => errorRecovery.executeRecoveryAction(action, context);

export const resetRetryCount = (context?: string) =>
  errorRecovery.resetRetryCount(context);

export default errorRecovery;
