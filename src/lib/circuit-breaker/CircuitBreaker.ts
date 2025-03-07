import { logger } from '@/utils/loggerInstance';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;

  constructor(failureThreshold: number = 5, resetTimeout: number = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
  }

  public async execute<T>(action: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
    if (this.isOpen()) {
      logger.warn('Circuit breaker is OPEN, using fallback', {
        failures: this.failures,
        lastFailureTime: this.lastFailureTime,
      });
      return fallback();
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      return this.handleFailure(error, fallback);
    }
  }

  private async handleFailure(error: unknown, fallback: () => any): Promise<any> {
    this.failures++;
    this.lastFailureTime = Date.now();
    logger.error('Circuit breaker recorded failure', {
      error,
      failures: this.failures,
      threshold: this.failureThreshold,
    });

    if (this.failures >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      logger.warn('Circuit breaker switched to OPEN state', {
        failures: this.failures,
        threshold: this.failureThreshold,
      });
    }

    return fallback();
  }

  private onSuccess(): void {
    if (this.failures > 0) {
      this.failures = 0;
      this.state = CircuitState.CLOSED;
      logger.info('Circuit breaker reset after success');
    }
  }

  private isOpen(): boolean {
    if (this.state === CircuitState.OPEN) {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
        logger.info('Circuit breaker switched to HALF_OPEN state');
        return false;
      }
      return true;
    }
    return false;
  }

  public getState(): CircuitState {
    return this.state;
  }

  public getFailures(): number {
    return this.failures;
  }
}
