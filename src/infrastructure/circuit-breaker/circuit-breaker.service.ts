import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MetricsService } from '../monitoring/metrics.service';
import { Logger } from '../logger/logger.service';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenRetries: number;
}

interface CircuitStats {
  failures: number;
  successes: number;
  lastFailure: Date;
  lastSuccess: Date;
  state: CircuitState;
}

@Injectable()
export class CircuitBreakerService {
  private readonly stats: Map<string, CircuitStats> = new Map();
  private readonly config: CircuitBreakerConfig;
  private readonly logger = new Logger(CircuitBreakerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly metrics: MetricsService
  ) {
    this.config = {
      failureThreshold: parseInt(configService.get('CIRCUIT_BREAKER_FAILURE_THRESHOLD') || '5'),
      resetTimeout: parseInt(configService.get('CIRCUIT_BREAKER_RESET_TIMEOUT') || '60000'),
      halfOpenRetries: parseInt(configService.get('CIRCUIT_BREAKER_HALF_OPEN_RETRIES') || '3')
    };
  }

  async execute<T>(
    serviceId: string,
    operation: () => Promise<T>,
    fallback: () => Promise<T>
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

  private getStats(serviceId: string): CircuitStats {
    if (!this.stats.has(serviceId)) {
      this.stats.set(serviceId, {
        failures: 0,
        successes: 0,
        lastFailure: new Date(0),
        lastSuccess: new Date(0),
        state: CircuitState.CLOSED
      });
    }
    return this.stats.get(serviceId)!;
  }

  private isOpen(stats: CircuitStats): boolean {
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

    if (stats.state === CircuitState.HALF_OPEN && 
        stats.successes >= this.config.halfOpenRetries) {
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