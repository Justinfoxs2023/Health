import { ConfigService } from '../config/config.service';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.service';
import { MetricsService } from '../monitoring/metrics.service';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

interface ICircuitBreakerConfig {
  /** failureThreshold 的描述 */
  failureThreshold: number;
  /** resetTimeout 的描述 */
  resetTimeout: number;
  /** halfOpenRetries 的描述 */
  halfOpenRetries: number;
}

interface ICircuitStats {
  /** failures 的描述 */
  failures: number;
  /** successes 的描述 */
  successes: number;
  /** lastFailure 的描述 */
  lastFailure: Date;
  /** lastSuccess 的描述 */
  lastSuccess: Date;
  /** state 的描述 */
  state: import("D:/Health/src/infrastructure/circuit-breaker/circuit-breaker.service").CircuitState.CLOSED | import("D:/Health/src/infrastructure/circuit-breaker/circuit-breaker.service").CircuitState.OPEN | import("D:/Health/src/infrastructure/circuit-breaker/circuit-breaker.service").CircuitState.HALF_OPEN;
}

@Injectable()
export class CircuitBreakerService {
  private readonly stats: Map<string, ICircuitStats> = new Map();
  private readonly config: ICircuitBreakerConfig;
  private readonly logger = new Logger(CircuitBreakerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly metrics: MetricsService,
  ) {
    this.config = {
      failureThreshold: parseInt(configService.get('CIRCUIT_BREAKER_FAILURE_THRESHOLD') || '5'),
      resetTimeout: parseInt(configService.get('CIRCUIT_BREAKER_RESET_TIMEOUT') || '60000'),
      halfOpenRetries: parseInt(configService.get('CIRCUIT_BREAKER_HALF_OPEN_RETRIES') || '3'),
    };
  }

  async execute<T>(
    serviceId: string,
    operation: () => Promise<T>,
    fallback: () => Promise<T>,
  ): Promise<T> {
    const stats = this.getStats(serviceId);

    if (this.isOpen(stats)) {
      this.logger.warn(`Circuit breaker is OPEN for service ${serviceId}`);
      return fallback();
    }

    try {
      const result = await operation();
      this.recordSuccess(serviceId);
      return result;
    } catch (error) {
      this.recordFailure(serviceId);
      return fallback();
    }
  }

  private getStats(serviceId: string): ICircuitStats {
    if (!this.stats.has(serviceId)) {
      this.stats.set(serviceId, {
        failures: 0,
        successes: 0,
        lastFailure: new Date(0),
        lastSuccess: new Date(0),
        state: CircuitState.CLOSED,
      });
    }
    return this.stats.get(serviceId)!;
  }

  private isOpen(stats: ICircuitStats): boolean {
    if (stats.state === CircuitState.OPEN) {
      const now = Date.now();
      const lastFailure = stats.lastFailure.getTime();
      if (now - lastFailure > this.config.resetTimeout) {
        stats.state = CircuitState.HALF_OPEN;
        return false;
      }
      return true;
    }
    return false;
  }

  private recordSuccess(serviceId: string): void {
    const stats = this.getStats(serviceId);
    stats.successes++;
    stats.lastSuccess = new Date();

    if (stats.state === CircuitState.HALF_OPEN && stats.successes >= this.config.halfOpenRetries) {
      stats.state = CircuitState.CLOSED;
      stats.failures = 0;
      stats.successes = 0;
      this.logger.log(`Circuit breaker CLOSED for service ${serviceId}`);
    }

    this.metrics.recordCircuitBreakerSuccess(serviceId);
  }

  private recordFailure(serviceId: string): void {
    const stats = this.getStats(serviceId);
    stats.failures++;
    stats.lastFailure = new Date();

    if (stats.failures >= this.config.failureThreshold) {
      stats.state = CircuitState.OPEN;
      this.logger.warn(`Circuit breaker OPENED for service ${serviceId}`);
    }

    this.metrics.recordCircuitBreakerFailure(serviceId);
  }

  getState(serviceId: string): CircuitState {
    return this.getStats(serviceId).state;
  }

  reset(serviceId: string): void {
    this.stats.delete(serviceId);
  }
}
