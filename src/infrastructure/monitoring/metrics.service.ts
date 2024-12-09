import { Injectable } from '@nestjs/common';
import { Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private registry: Registry;
  private requestCounter: Counter;
  private errorCounter: Counter;
  private successCounter: Counter;

  constructor() {
    this.registry = new Registry();
    this.initializeMetrics();
  }

  private initializeMetrics() {
    this.requestCounter = new Counter({
      name: 'service_requests_total',
      help: 'Total number of requests',
      labelNames: ['service']
    });

    this.errorCounter = new Counter({
      name: 'service_errors_total',
      help: 'Total number of errors',
      labelNames: ['service']
    });

    this.successCounter = new Counter({
      name: 'service_success_total',
      help: 'Total number of successful requests',
      labelNames: ['service']
    });

    this.registry.registerMetric(this.requestCounter);
    this.registry.registerMetric(this.errorCounter);
    this.registry.registerMetric(this.successCounter);
  }

  recordRequest(serviceName: string) {
    this.requestCounter.labels(serviceName).inc();
  }

  recordError(serviceName: string) {
    this.errorCounter.labels(serviceName).inc();
  }

  recordSuccess(serviceName: string) {
    this.successCounter.labels(serviceName).inc();
  }
} 