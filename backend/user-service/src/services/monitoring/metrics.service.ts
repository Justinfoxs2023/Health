/**
 * @fileoverview TS 文件 metrics.service.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

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
