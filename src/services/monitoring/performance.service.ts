import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Logger, Metrics, AlertService } from '../../types';
import { BaseService } from '../base/base.service';
import { Request, Response } from '../../types/express';

@injectable()
export class PerformanceMonitorService extends BaseService {
  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Metrics) metrics: Metrics,
    @inject(TYPES.AlertService) alertService: AlertService,
    private config: PerformanceConfig
  ) {
    super(logger, metrics, alertService);
  }

  async monitorAPIPerformance(req: Request, res: Response, next: Function) {
    const start = Date.now();
    const path = req.path;

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.recordAPIMetrics(path, duration, res.statusCode);
    });

    next();
  }

  private async recordAPIMetrics(path: string, duration: number, statusCode: number) {
    await this.metrics.recordTiming('api.request.duration', duration, {
      path,
      statusCode: String(statusCode)
    });
  }
} 