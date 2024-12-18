import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsService } from '../monitoring/metrics.service';

export enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

export interface ICircuitBreakerConfig {
  /** failureThreshold 的描述 */
  failureThreshold: number;
  /** resetTimeout 的描述 */
  resetTimeout: number;
  /** halfOpenRetries 的描述 */
  halfOpenRetries: number;
}

@Injectable()
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private successCount = 0;

  constructor(
    private readonly config: ICircuitBreakerConfig,
    private readonly metrics: MetricsService,
    private readonly logger: Logger,
  ) {}

  async execute<T>(operation: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      this.metrics.incrementCounter('circuit_breaker_fallback_total');
      return fallback();
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      return fallback();
    }
  }

  private isOpen(): boolean {
    if (this.state === CircuitState.OPEN) {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.config.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
        this.logger.info('Circuit breaker state changed to HALF_OPEN');
        return false;
      }
      return true;
    }
    return false;
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.halfOpenRetries) {
        this.reset();
      }
    }
    this.metrics.incrementCounter('circuit_breaker_success_total');
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.CLOSED && this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.logger.warn('Circuit breaker state changed to OPEN');
    }

    this.metrics.incrementCounter('circuit_breaker_failure_total');
  }

  private reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.logger.info('Circuit breaker state reset to CLOSED');
  }

  getState(): CircuitState {
    return this.state;
  }

  getMetrics(): {
    state: CircuitState;
    failureCount: number;
    successCount: number;
    lastFailureTime: number;
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}
