@injectable()
export class MetricsService {
  private metrics: Map<string, number>;

  constructor(@inject(TYPES.Logger) private logger: Logger) {
    this.metrics = new Map();
  }

  increment(metric: string): void {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current + 1);
  }
} 